import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

import BorrowedBooks from "./BorrowedBooks";
import ReturnedBooks from "./ReturnedBooks";
import RecommendedBooks from "../User/RecommendedBooks";

import { userAtom } from "../../../recoil/atoms/userAtom";
import { alertAtom } from "../../../recoil/atoms/alertAtom";

import { UpdateCurrentUrl } from "../../../utils/urlStorage";
import Book from "../../../utils/models/Book";
import Library, { emptyLibrary } from "../../../utils/models/Library";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const [userData, setUserData] = useRecoilState(userAtom);
  const [, setAlert] = useRecoilState(alertAtom);

  const [returnedBooks, setReturnedBooks] = useState<Book[]>([]);
  const [borrowedBooks, setBorrowedBooks] = useState<Book[]>([]);
  const [library, setLibrary] = useState<Library>(emptyLibrary);

  const navigate = useNavigate();

  const fetchUserData = async () => {
    const reqOptions: RequestInit = {
      method: "GET",
      credentials: "include",
    };
    const url = `${process.env.REACT_APP_BACKEND}/users/${userData.id}`;
    try {
      const res = await fetch(url, reqOptions);
      const data = await res.json();
      // console.log("data from fetchUserData: ", data);
    } catch (error) {
      setAlert({
        message: error.message,
        type: "error",
      });
    }
  };

  const fetchHomeLibraryInfo = async () => {
    const reqOptions: RequestInit = {
      method: "GET",
      credentials: "include",
    };
    let url = `${process.env.REACT_APP_BACKEND}/users/${userData.id}/homeLibrary`;
    try {
      let res = await fetch(url, reqOptions);
      let data = await res.json();
      // console.log(data);

      url = `${process.env.REACT_APP_BACKEND}/libraries/${data}`;
      res = await fetch(url, reqOptions);
      data = await res.json();
      const updatedLibrary = { ...data };
      setLibrary(updatedLibrary);
    } catch (error) {
      setAlert({
        message: error.message,
        type: "error",
      });
    }
  };

  const fetchReturnedBooks = async () => {
    const reqOptions: RequestInit = {
      method: "GET",
      credentials: "include",
    };
    const url = `${process.env.REACT_APP_BACKEND}/users/${userData.id}/returned`;

    try {
      const res = await fetch(url, reqOptions);
      if (res.status !== 204) {
        const data = await res.json();
        if (res.ok) {
          setReturnedBooks(data);
          return;
        }
      }
    } catch (error) {
      setAlert({
        message: error.message,
        type: "error",
      });
    }
  };

  const fetchBorrowedBooks = async () => {
    const reqOptions: RequestInit = {
      method: "GET",
      credentials: "include",
    };
    const url = `${process.env.REACT_APP_BACKEND}/users/${userData.id}/borrowed`;

    try {
      const res = await fetch(url, reqOptions);
      const data = await res.json();

      if (data) {
        setBorrowedBooks(data);
      }
    } catch (error) {
      setAlert({
        message: error.message,
        type: "error",
      });
    }
  };

  useEffect(() => {
    UpdateCurrentUrl();

    if (userData && userData.id !== 0 && userData.isLoggedIn) {
      setTimeout(() => {
        fetchUserData();
        fetchReturnedBooks();
        fetchBorrowedBooks();
        fetchHomeLibraryInfo();
      }, 150);
    } else if (!userData) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    if (userData.id === 0) {
      return;
    }
    const updatedUser = {
      ...userData,
      returnedBooks,
      borrowedBooks,
      homeLibraryId: library.id,
    };
    // console.log("updatedUser: ", updatedUser);
    setUserData(updatedUser);
    // console.log("UPDATING USER4", updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    localStorage.setItem("library", JSON.stringify(library));
  }, [returnedBooks, borrowedBooks, library]);

  return (
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
  );
};

export default UserDashboard;
