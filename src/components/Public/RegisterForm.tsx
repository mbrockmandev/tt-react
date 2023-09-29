import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  doPasswordsMatch,
  isValidEmail,
  isValidName,
  isValidPassword,
} from "../../utils/validators";
import Alert from "../Common/Alert";
import { useRecoilState } from "recoil";
import { userAtom } from "../../recoil/atoms/userAtom";
import { alertQueueAtom } from "../../recoil/atoms/alertAtom";

export interface LoginUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  homeLibraryId: number;
  confirmPassword: string;
  role: string;
}

export const emptyLoginUser: LoginUser = {
  id: 0,
  email: "",
  firstName: "",
  lastName: "",
  password: "",
  homeLibraryId: 1,
  confirmPassword: "",
  role: "user",
};

const RegisterForm = () => {
  const [user, setUser] = useRecoilState(userAtom);
  const [, setAlert] = useRecoilState(alertQueueAtom);
  const [showPassword, setShowPassword] = useState(false);
  const [error] = useState("");
  const [tempUser, setTempUser] = useState<LoginUser>({
    ...emptyLoginUser,
  });

  const navigate = useNavigate();

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "user") {
      setTempUser({
        ...tempUser,
        role: e.target.value,
      });
    } else if (e.target.value === "staff") {
      setTempUser({
        ...tempUser,
        role: e.target.value,
      });
    } else if (e.target.value === "admin") {
      setTempUser({
        ...tempUser,
        role: e.target.value,
      });
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempUser({
      ...tempUser,
      email: e.target.value,
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempUser({
      ...tempUser,
      password: e.target.value,
    });
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setTempUser({
      ...tempUser,
      confirmPassword: e.target.value,
    });
  };

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempUser({
      ...tempUser,
      firstName: e.target.value,
    });
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempUser({
      ...tempUser,
      lastName: e.target.value,
    });
  };

  const handlePasswordToggleClick = () => {
    setShowPassword((cur) => !cur);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (!isValidEmail(tempUser.email)) {
        throw new Error("Invalid email");
      }

      if (!isValidName(tempUser.firstName)) {
        throw new Error("Invalid first name");
      }

      if (!isValidName(tempUser.lastName)) {
        throw new Error("Invalid last name");
      }

      if (!isValidPassword(tempUser.password)) {
        throw new Error("Invalid password");
      }

      if (!doPasswordsMatch(tempUser.password, tempUser.confirmPassword)) {
        throw new Error("Passwords do not match");
      }

      const reqOptions: RequestInit = {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: tempUser.email,
          first_name: tempUser.firstName,
          last_name: tempUser.lastName,
          password: tempUser.password,
          confirm_password: tempUser.confirmPassword,
          role: tempUser.role,
        }),
      };

      const url = `${process.env.REACT_APP_BACKEND}/register`;
      const res = await fetch(url, reqOptions);

      if (!res.ok && res.status === 409) {
        setAlert((prev) => [
          ...prev,
          { message: "You already have an account.", type: "error" },
        ]);
      } else if (!res.ok) {
        throw new Error("HTTP status code: " + res.status);
      }

      const data = await res.json();

      if (data && data.user_info) {
        setUser({
          ...user,
          id: data.user_info.id,
          email: data.user_info.email,
          role: data.user_info.role,
          isLoggedIn: true,
        });
        setAlert((prev) => [
          ...prev,
          {
            message: "Logged in!",
            type: "success",
          },
        ]);
      }
    } catch (err) {
      setAlert((prev) => [
        ...prev,
        { message: "Error creating user.", type: "error" },
      ]);
      console.error(err);
      if (error !== "") {
        return;
      }
    }
  };

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

  const createUserModal = (
    <>
      <form
        onSubmit={handleSubmit}
        className="mb-0 mt-6 space-y-4 rounded-lg p-4 shadow-lg shadow-gray-300/50 sm:mt-8 sm:p-6 lg:p-8"
      >
        <p className="text-center text-lg font-medium">
          Register a new account
        </p>

        <div>
          <label htmlFor="email" className="sr-only">
            Email
          </label>

          <div className="relative">
            <input
              id="email"
              type="email"
              onChange={handleEmailChange}
              className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm focus:ring-gray-200 focus:border-gray-400 active:border-gray-200"
              placeholder="Email"
              autoComplete="email"
            />

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

          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              onChange={handlePasswordChange}
              className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm shadow-gray-300 focus:ring-gray-200 focus:border-gray-400 active:border-gray-200"
              placeholder="Password"
            />
            <span
              onClick={handlePasswordToggleClick}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
            >
              {showPassword ? "🙈" : "👀"}
            </span>
          </div>
          <label htmlFor="confirmPassword" className="sr-only">
            Password
          </label>

          <div className="relative pt-4">
            <input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              onChange={handleConfirmPasswordChange}
              className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm shadow-gray-300 focus:ring-gray-200 focus:border-gray-400 active:border-gray-200"
              placeholder="Confirm Password"
            />

            <span
              onClick={handlePasswordToggleClick}
              className="absolute right-4 top-11 transform -translate-y-1/2 cursor-pointer"
            >
              {showPassword ? "🙈" : "👀"}
            </span>
          </div>
          <label htmlFor="firstname" className="sr-only">
            First Name
          </label>

          <div className="relative my-4">
            <input
              id="firstname"
              type="text"
              onChange={handleFirstNameChange}
              className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm shadow-gray-300 focus:ring-gray-200 focus:border-gray-400 active:border-gray-200"
              placeholder="First Name"
              pattern="[a-zA-Z]*"
            />
          </div>

          <label htmlFor="lastname" className="sr-only">
            Last Name
          </label>

          <div className="relative">
            <input
              id="lastname"
              type="text"
              onChange={handleLastNameChange}
              className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm shadow-gray-300 focus:ring-gray-200 focus:border-gray-400 active:border-gray-200"
              placeholder="Last Name"
              pattern="[a-zA-Z]*"
            />
          </div>

          <div className="py-4 flex justify-end items-center gap-4">
            <label htmlFor="role">Role:</label>
            <select
              id="role"
              className="w-[25%] rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm shadow-gray-300 focus:ring-gray-200 focus:border-gray-400 active:border-gray-200"
              onChange={handleRoleChange}
            >
              <option value="user" placeholder="Role" defaultChecked>
                User
              </option>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="block w-[35%] bg-gray-200 rounded-lg bg-secondary px-5 py-3 text-sm font-medium text-black w-[25%] mx-auto"
        >
          Register
        </button>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            className="hover:underline text-gray-700 hover:text-gray-500"
            to="/login"
          >
            Sign In
          </Link>
        </p>
      </form>
    </>
  );

  return (
    <div>
      <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg">
          {error && <Alert />}
          <h1 className="text-center text-2xl font-bold text-gray-800 sm:text-3xl">
            TomeTracker
          </h1>

          <p className="mx-auto mt-4 max-w-md text-center text-gray-500">
            Are you ready to explore the world?
          </p>
          {createUserModal}
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
