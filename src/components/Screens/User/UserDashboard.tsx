import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

import BorrowedBooks from "./BorrowedBooks";
import ReturnedBooks from "./ReturnedBooks";
import RecommendedBooks from "../User/RecommendedBooks";

import { userAtom } from "../../../recoil/atoms/userAtom";
import { alertAtom } from "../../../recoil/atoms/alertAtom";

import Library, { emptyLibrary } from "../../../utils/models/Library";

import debounce from "lodash.debounce";

const UserDashboard = () => {
  const [userData, setUserData] = useRecoilState(userAtom);
  const [, setAlert] = useRecoilState(alertAtom);

  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [returnedBooks, setReturnedBooks] = useState([]);
  const [library, setLibrary] = useState<Library>(emptyLibrary);
  const [loading, setLoading] = useState([true, true, true, true]);
  const [allDoneLoading, setAllDoneLoading] = useState(false);

  const fetchUserData = async () => {
    if (userData.id === 0) return;
    const reqOptions: RequestInit = {
      method: "GET",
      credentials: "include",
    };
    const url = `${process.env.REACT_APP_BACKEND}/users/${userData.id}`;
    try {
      const res = await fetch(url, reqOptions);
      setLoading((p) => [false, p[1], p[2], p[3]]);

      const data = await res.json();
      setUserData({
        ...userData,
        id: data.id,
        isLoggedIn: true,
        lastUrl: "user/dashboard",
        role: data.role,
        email: data.email,
      });
    } catch (error) {
      setAlert({
        message: error.message,
        type: "error",
      });
    }
  };

  const fetchHomeLibraryInfo = async () => {
    if (userData.id === 0) return;
    const reqOptions: RequestInit = {
      method: "GET",
      credentials: "include",
    };
    let url = `${process.env.REACT_APP_BACKEND}/users/${userData.id}/homeLibrary`;
    try {
      let res = await fetch(url, reqOptions);
      let data = await res.json();

      url = `${process.env.REACT_APP_BACKEND}/libraries/${data}`;
      res = await fetch(url, reqOptions);
      setLoading((p) => [p[0], false, p[2], p[3]]);

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
    if (userData.id === 0) return;
    const reqOptions: RequestInit = {
      method: "GET",
      credentials: "include",
    };
    const url = `${process.env.REACT_APP_BACKEND}/users/${userData.id}/returned`;

    try {
      const res = await fetch(url, reqOptions);
      setLoading((p) => [p[0], p[1], false, p[3]]);

      if (res.status !== 204) {
        const data = await res.json();
        setReturnedBooks(data);
      }
    } catch (error) {
      setAlert({
        message: error.message,
        type: "error",
      });
    }
  };

  const fetchBorrowedBooks = async () => {
    if (userData.id === 0) return;
    const reqOptions: RequestInit = {
      method: "GET",
      credentials: "include",
    };
    const url = `${process.env.REACT_APP_BACKEND}/users/${userData.id}/borrowed`;

    try {
      const res = await fetch(url, reqOptions);
      setLoading((p) => [p[0], p[1], p[2], false]);

      if (res.status !== 204) {
        const data = await res.json();
        setBorrowedBooks(data);
      }
    } catch (error) {
      setAlert({
        message: error.message,
        type: "error",
      });
    }
  };

  const hasEverythingLoaded = () => {
    return loading.every((state) => !state);
  };

  useEffect(() => {
    // done loading all data
    if (loading[0]) fetchUserData();
    if (loading[1]) fetchHomeLibraryInfo();
    if (loading[2]) fetchReturnedBooks();
    if (loading[3]) fetchBorrowedBooks();

    if (loading[0] || loading[1] || loading[2] || loading[3]) return;

    const updatedUser = {
      ...userData,
      homeLibraryId: library.id,
      returnedBooks,
      borrowedBooks,
    };
    setUserData(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    localStorage.setItem("library", JSON.stringify(library));

    setTimeout(() => {
      setAllDoneLoading(hasEverythingLoaded());
    }, 200);
  }, [loading]);

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
