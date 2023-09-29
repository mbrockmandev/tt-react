import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

import BorrowedBooks from "./BorrowedBooks";
import ReturnedBooks from "./ReturnedBooks";
import RecommendedBooks from "../User/RecommendedBooks";

import { userAtom } from "../../../recoil/atoms/userAtom";
import { alertAtom } from "../../../recoil/atoms/alertAtom";

import Library, { emptyLibrary } from "../../../utils/models/Library";
import { UpdateCurrentUrl } from "../../../utils/urlStorage";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const [userData, setUserData] = useRecoilState(userAtom);
  const [, setAlert] = useRecoilState(alertAtom);

  const [library, setLibrary] = useState<Library>(emptyLibrary);
  const [allDoneLoading, setAllDoneLoading] = useState(false);

  const navigate = useNavigate();

  const fetchAllUserData = async () => {
    UpdateCurrentUrl();
    const reqOptions: RequestInit = {
      method: "GET",
      credentials: "include",
    };

    let tempUserData = { ...userData };

    try {
      if (userData.id === 0) {
        return;
      }
      // fetch user data first
      let url = `${process.env.REACT_APP_BACKEND}/users/${userData.id}`;
      let res = await fetch(url, reqOptions);
      let data = await res.json();
      if (data) {
        tempUserData = {
          ...tempUserData,
          id: data.id,
          isLoggedIn: true,
          lastUrl: "user/dashboard",
          role: data.role,
          email: data.email,
        };
      }

      // Fetch home library info
      url = `${process.env.REACT_APP_BACKEND}/users/${userData.id}/homeLibrary`;
      res = await fetch(url, reqOptions);
      data = await res.json();
      if (data) {
        url = `${process.env.REACT_APP_BACKEND}/libraries/${data}`;
        res = await fetch(url, reqOptions);
        data = await res.json();
        setLibrary({ ...data });
      }

      // Fetch returned books
      url = `${process.env.REACT_APP_BACKEND}/users/${userData.id}/returned`;
      res = await fetch(url, reqOptions);
      data = await res.json();
      if (data) {
        console.log(data);
        console.log(tempUserData);
        tempUserData = {
          ...tempUserData,
          returnedBooks: data,
        };
      }

      // Fetch borrowed books
      url = `${process.env.REACT_APP_BACKEND}/users/${userData.id}/borrowed`;
      res = await fetch(url, reqOptions);
      data = await res.json();
      if (data) {
        console.log(data);
        console.log(tempUserData);
        tempUserData = {
          ...tempUserData,
          borrowedBooks: data,
        };
      }

      setUserData(tempUserData);
      localStorage.setItem("user", JSON.stringify(tempUserData));
      localStorage.setItem("library", JSON.stringify(library));
      setAllDoneLoading(true);
    } catch (error) {
      console.error("ok, something went wrong: ", error);
      setAlert({
        message: error.message,
        type: "error",
      });
    }
  };

  useEffect(() => {
    if (!userData.id) navigate("/login");

    fetchAllUserData();
  }, []);

  // useEffect(() => {
  //   console.log(userData, library);
  // }, [alert, setAlert]);

  return allDoneLoading ? (
    <div>
      <div className="library-dashboard flex">
        <div className="main-section flex-1 p-4 space-y-4">
          {/* Borrowed Books */}
          <h2 className="text-xl font-semibold">Borrowed Books</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4">
            {userData.borrowedBooks && <BorrowedBooks />}
          </div>

          {/* Recently Returned */}
          <div className="recently-returned space-y-2">
            <h2 className="text-xl font-semibold">Recently Returned</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4">
              {userData.returnedBooks && <ReturnedBooks />}
            </div>
          </div>
        </div>

        <div className="">
          <aside className="hidden sm:block max-w-xs sidebar p-4 space-y-4 border-l">
            <RecommendedBooks />

            {/* Events or Classes */}
            <div className="upcoming-events space-y-2">
              <h2 className="text-xl font-semibold">Upcoming Events</h2>
            </div>

            {/* News & Updates */}
            <div className="library-news space-y-2">
              <h2 className="text-xl font-semibold">News & Updates</h2>
            </div>
          </aside>
        </div>
      </div>
    </div>
  ) : (
    <div className="library-dashboard flex">Loading...</div>
  );
};

export default UserDashboard;
