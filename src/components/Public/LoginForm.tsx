import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isValidEmail, isValidPassword } from "../../utils/validators";
import { useRecoilState } from "recoil";
import { userAtom } from "../../recoil/atoms/userAtom";
import { alertAtom } from "../../recoil/atoms/alertAtom";

const LoginForm = () => {
  const [user, setUser] = useRecoilState(userAtom);
  const navigate = useNavigate();
  const [, setAlert] = useRecoilState(alertAtom);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const redirect = () => {
      if (user.role === "admin") {
        setUser({ ...user, isLoggedIn: true });
        navigate("/admin/dashboard");
      }
      if (user.role === "staff") {
        setUser({ ...user, isLoggedIn: true });
        navigate("/staff/dashboard");
      }
      if (user.role === "user") {
        setUser({ ...user, isLoggedIn: true });
        navigate("/user/dashboard");
      }
    };

    setTimeout(() => {
      redirect();
    }, 50);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.role, navigate]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handlePasswordVisibleClick = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      if (!isValidEmail(email)) {
        throw new Error("Invalid email");
      }

      if (!isValidPassword(password)) {
        throw new Error("Invalid password");
      }

      const reqOptions: RequestInit = {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      };
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND}/auth/login`,
        reqOptions
      );

      const data = await res.json();
      if (data && data.user_info) {
        setUser({
          ...user,
          id: data.user_info.id,
          email: data.user_info.email,
          role: data.user_info.role,
          isLoggedIn: true,
        });
        navigate(`/${data.user_info.role}/dashboard`);
        setAlert({
          message: "Logged in!",
          type: "success",
        });
      }
    } catch (err) {
      setAlert(err.message);
      if (err.message !== "") {
        return;
      }
    }
  };

  return (
    <div>
      <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg">
          <h1 className="text-center text-2xl font-bold text-gray-700 sm:text-3xl">
            TomeTracker
          </h1>

          <p className="mx-auto mt-4 max-w-md text-center text-gray-500">
            Are you ready to explore the world?
          </p>

          <form
            action=""
            className="mb-0 mt-6 space-y-4 rounded-lg p-4 shadow-lg shadow-gray-300/50 sm:mt-8 sm:p-6 lg:p-8"
          >
            <p className="text-center text-lg font-medium">
              Sign in to your account
            </p>

            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>

              <div className="relative">
                <input
                  id="email"
                  type="email"
                  className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                  placeholder="Email"
                  autoComplete="off"
                  onChange={handleEmailChange}
                />

                {/* email icon */}
                <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </span>
              </div>
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>

              <div className="relative pt-4">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  onChange={handlePasswordChange}
                  className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm shadow-gray-300"
                  placeholder="Confirm Password"
                  autoComplete="off"
                />

                <span
                  onClick={handlePasswordVisibleClick}
                  className="absolute right-4 top-11 transform -translate-y-1/2 cursor-pointer"
                >
                  {showPassword ? "🙈" : "👀"}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="block w-[35%] bg-gray-200 rounded-lg bg-secondary px-5 py-3 text-sm font-medium text-black w-[25%] mx-auto"
              onClick={handleSubmit}
            >
              Sign in
            </button>

            <p className="text-center text-sm text-gray-500">
              No account?{" "}
              <Link
                className="hover:underline text-gray-700 hover:text-gray-500"
                to="/register"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
