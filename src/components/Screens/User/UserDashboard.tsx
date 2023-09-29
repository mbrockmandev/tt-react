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

    const errors = [];

    // fetch user data first
    try {
      if (userData.id === 0) {
        return;
      }
      const url = `${process.env.REACT_APP_BACKEND}/users/${userData.id}`;
      const res = await fetch(url, reqOptions);
      const data = await res.json();
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
    } catch (error) {
      errors.push(error);
    }

    // fetch home library info
    try {
      let url = `${process.env.REACT_APP_BACKEND}/users/${userData.id}/homeLibrary`;
      let res = await fetch(url, reqOptions);
      let data = await res.json();
      tempUserData = { ...tempUserData, homeLibraryId: data };
      if (data) {
        url = `${process.env.REACT_APP_BACKEND}/libraries/${data}`;
        res = await fetch(url, reqOptions);
        data = await res.json();
        setLibrary({ ...data });
      }
    } catch (error) {
      errors.push(error);
    }

    // fetch returned books
    try {
      const url = `${process.env.REACT_APP_BACKEND}/users/${userData.id}/returned`;
      const res = await fetch(url, reqOptions);
      if (res.status !== 204) {
        const data = await res.json();
        if (data) {
          tempUserData = {
            ...tempUserData,
            returnedBooks: data,
          };
        }
      }
    } catch (error) {
      errors.push(error);
    }

    // fetch borrowed books
    try {
      const url = `${process.env.REACT_APP_BACKEND}/users/${userData.id}/borrowed`;
      const res = await fetch(url, reqOptions);
      if (res.status !== 204) {
        const data = await res.json();
        if (data) {
          tempUserData = {
            ...tempUserData,
            borrowedBooks: data,
          };
        }
      }
    } catch (error) {
      errors.push(error);
    }

    if (errors.length > 0) {
      console.error("some requests failed:", errors);
      setAlert({
        message: `${errors.length} requests failed. Please try again.`,
        type: "error",
      });
    }

    setUserData(tempUserData);
    localStorage.setItem("user", JSON.stringify(tempUserData));
    localStorage.setItem("library", JSON.stringify(library));
    setAllDoneLoading(true);
  };

  useEffect(() => {
    if (!userData.id) navigate("/login");

    fetchAllUserData();
  }, []);

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
