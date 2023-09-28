import * as React from "react";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";

// components
import Alert from "./components/Common/Alert";
import Footer from "./components/Common/Footer";
import Header from "./components/Common/Header";

// atoms
import { alertAtom } from "./recoil/atoms/alertAtom";
import { userAtom } from "./recoil/atoms/userAtom";
import { GetLastUrl, UpdateCurrentUrl } from "./utils/urlStorage";
import { libraryAtom } from "./recoil/atoms/libraryAtom";
import { bookAtom } from "./recoil/atoms/bookAtom";

const App = () => {
  const [user, setUser] = useRecoilState(userAtom);
  const [, setLibrary] = useRecoilState(libraryAtom);
  const [, setBook] = useRecoilState(bookAtom);
  const [alert, setAlert] = useRecoilState(alertAtom);
  const navigate = useNavigate();

  useEffect(() => {
    // Load data from local storage
    const userData = JSON.parse(localStorage.getItem("user") || "null");
    const libraryData = JSON.parse(localStorage.getItem("library") || "null");
    const bookData = JSON.parse(localStorage.getItem("book") || "null");

    if (userData && userData.id !== 0) setUser(userData);
    if (libraryData) setLibrary(libraryData);
    if (bookData) setBook(bookData);

    if (!user || !user.isLoggedIn) fetchRefreshToken();
  }, []);

  useEffect(() => {
    if (user && user.isLoggedIn) {
      const targetPath = `/${user.role}/dashboard`;

      if (window.location.pathname !== targetPath) {
        navigate(targetPath);
      }
    } else {
      navigate("/login");
    }
  }, [user]);

  useEffect(() => {
    if (alert.message) {
      setTimeout(() => {
        setAlert({ message: "", type: "" });
      }, 5000);
    }
  }, [alert]);

  useEffect(() => {
    const url = UpdateCurrentUrl();
    setUser((p) => ({ ...p, lastUrl: url }));
  }, [navigate]);

  // fetch refresh token from backend if it exists
  const fetchRefreshToken = async () => {
    try {
      const reqOptions: RequestInit = {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      };

      const url = `${process.env.REACT_APP_BACKEND}/jwtInfo`;
      const res = await fetch(url, reqOptions);

      if (!res.ok && res.status === 429) {
        return;
      } else if (!res.ok && res.status === 401) {
        setAlert({
          message: "Please log in!",
          type: "info",
        });
      } else if (!res.ok) {
        setAlert({
          message: "Error fetching user info",
          type: "error",
        });
        setUser({ ...user, isLoggedIn: false });
        navigate("/login");
        return;
      }

      const data = await res.json();

      if (data && data.user_info && data.user_info.id !== 0) {
        fetchUserInfo(data.user_info.id);
        navigate(GetLastUrl());
      }
    } catch (err) {
      setAlert({ message: err.message, type: "error" });
    }
  };

  const fetchUserInfo = async (id: number) => {
    try {
      const reqOptions: RequestInit = {
        method: "GET",
        credentials: "include",
      };
      const url = `${process.env.REACT_APP_BACKEND}/users/${id}`;
      const res = await fetch(url, reqOptions);
      const data = await res.json();
      setUser(data);
    } catch (error) {
      setAlert({ message: error.message, type: "error" });
    }
  };

  return (
    <div className="background-root">
      <Header />
      {alert.message && <Alert />}
      <Outlet />
      <Footer />
    </div>
  );
};

export default App;
