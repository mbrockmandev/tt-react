import * as React from "react";
import { useEffect, useState } from "react";
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
import { User, emptyUser } from "./utils/models/User";

const App = () => {
  const [user, setUser] = useRecoilState(userAtom);
  const [, setLibrary] = useRecoilState(libraryAtom);
  const [, setBook] = useRecoilState(bookAtom);
  const [alert, setAlert] = useRecoilState(alertAtom);

  const [localUser, setLocalUser] = useState<User>(emptyUser);

  const navigate = useNavigate();

  // get user, library, book data from local storage first, if it exists
  const fetchLocalStorageData = () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData && userData.id !== 0) {
      setLocalUser(userData);
      if (userData.isLoggedIn) {
        navigate(`/${user.role}/dashboard`);
      }
    }
    const libraryData = localStorage.getItem("library");
    if (libraryData) {
      setLibrary(JSON.parse(libraryData));
    }
    const bookData = localStorage.getItem("book");
    if (bookData) {
      setBook(JSON.parse(bookData));
    }
  };

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
          type: "success",
        });
      } else if (!res.ok) {
        setAlert({
          message: "Error fetching user info",
          type: "error",
        });
        setLocalUser({ ...localUser, isLoggedIn: false });
        navigate("/login");
        return;
      }

      const data = await res.json();
      // console.log("data from refresh token (jwtInfo)", data);

      if (data && data.user_info.id !== 0) {
        fetchUserInfo(data.user_info.id);
        navigate(GetLastUrl());
      }
    } catch (err) {
      setAlert({ message: err.message, type: "error" });
      console.error("error fetching user data: ", err);
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
      setLocalUser(data);
    } catch (error) {
      setAlert({ message: error.message, type: "error" });
    }
  };

  // load from local storage, then backend on initial load
  useEffect(() => {
    if (!user || !user.isLoggedIn) {
      fetchLocalStorageData();
      fetchRefreshToken();
      setTimeout(() => {
        if (user && user.isLoggedIn) {
          navigate(user.lastUrl);
        }
      }, 100);
    }
  }, []);

  // log in with jwt if available
  useEffect(() => {
    setUser({ ...localUser });
    if (
      localUser.isLoggedIn &&
      window.location.pathname !== `/${user.role}/dashboard`
    ) {
      navigate(`/${user.role}/dashboard`);
    } else {
      navigate("login");
    }
  }, [localUser]);

  useEffect(() => {
    if (alert.message && alert.message !== "") {
      setTimeout(() => {
        setAlert({
          message: "",
          type: "",
        });
      }, 5000);
    }
  }, [alert]);

  useEffect(() => {
    const url = UpdateCurrentUrl();
    setUser({ ...user, lastUrl: url });
  }, [navigate]);

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
