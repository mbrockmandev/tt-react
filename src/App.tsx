import * as React from "react";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";

// components
import Alert from "./components/Common/Alert";
import Footer from "./components/Common/Footer";
import Header from "./components/Common/Header";

// atoms
import { alertQueueAtom, currentAlertSelector } from "./recoil/atoms/alertAtom";
import { userAtom } from "./recoil/atoms/userAtom";
import { GetLastUrl, UpdateCurrentUrl } from "./utils/urlStorage";
import { libraryAtom } from "./recoil/atoms/libraryAtom";
import { bookAtom } from "./recoil/atoms/bookAtom";

const App = () => {
  const [user, setUser] = useRecoilState(userAtom);
  const [, setLibrary] = useRecoilState(libraryAtom);
  const [, setBook] = useRecoilState(bookAtom);
  const [, setAlert] = useRecoilState(alertQueueAtom);
  const currentAlert = useRecoilValue(currentAlertSelector);
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
      if (user.role === "user" && window.location.pathname === "register")
        return;
      const targetPath = `/${user.role}/dashboard`;

      if (window.location.pathname !== targetPath) {
        navigate(targetPath);
      }
    } else {
      navigate("/login");
    }
  }, [user]);

  // process alert queue and display them according to what is passed from components
  useEffect(() => {
    if (currentAlert && currentAlert.message) {
      const timer = setTimeout(() => {
        setAlert((prev) => prev.slice(1));
      }, currentAlert.duration || 5000);

      return () => clearTimeout(timer);
    }
  }, [currentAlert]);

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
        setAlert((prev) => [
          ...prev,
          {
            message: "Please log in!",
            type: "info",
          },
        ]);
      } else if (!res.ok) {
        setAlert((prev) => [
          ...prev,
          {
            message: "Error fetching user info",
            type: "error",
          },
        ]);
        setUser({ ...user, isLoggedIn: false });
        navigate("/login");
        return;
      }

      const data = await res.json();

      if (data && data.user_info && data.user_info.id !== 0) {
        fetchUserInfo(data.user_info.id);
        navigate(GetLastUrl());
      }
    } catch (error) {
      // setAlert((prev) => [...prev, { message: "Unable to get refresh token.", type: "error" }]);
      console.error("Unable to refresh token. Logging out...");
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
      setAlert((prev) => [
        ...prev,
        { message: "Unable to get user info.", type: "error" },
      ]);
    }
  };

  return (
    <div className="background-root">
      <Header />
      {currentAlert && <Alert />}
      <Outlet />
      <Footer />
    </div>
  );
};

export default App;
