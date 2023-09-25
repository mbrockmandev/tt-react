// react, react router
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// local storage funcs
import { UpdateCurrentUrl } from "../../../utils/urlStorage";

// recoil funcs
import { useRecoilState, useRecoilValue } from "recoil";
import { userAtom } from "../../../recoil/atoms/userAtom";
import { modalAtom } from "../../../recoil/atoms/modalAtom";

// recoil state
import { selectedUserAtom } from "../../../recoil/atoms/selectedUserAtom";
import { selectedLibraryAtom } from "../../../recoil/atoms/selectedLibraryAtom";
import { selectedBookAtom } from "../../../recoil/atoms/selectedBookAtom";

// empty state
import { emptyLibrary } from "../../../utils/models/Library";
import { emptyBook } from "../../../utils/models/Book";
import { emptyUserResponse } from "../../../utils/models/UserResponse";

// modals
import CreateUserModal from "../Modals/Users/CreateUserModal";
import LookupUserModal from "../Modals/Users/LookupUserModal";
import DeleteUserModal from "../Modals/Users/DeleteUserModal";
import CreateLibraryModal from "../Modals/Libraries/CreateLibraryModal";
import LookupLibraryModal from "../Modals/Libraries/LookupLibraryModal";
import UpdateLibraryModal from "../Modals/Libraries/UpdateLibraryModal";
import DeleteLibraryModal from "../Modals/Libraries/DeleteLibraryModal";
import CreateBookModal from "../Modals/Books/CreateBookModal";
import LookupBookModal from "../Modals/Books/LookupBookModal";
import UpdateBookModal from "../Modals/Books/UpdateBookModal";
import DeleteBookModal from "../Modals/Books/DeleteBookModal";
import BooksByLibraryFetcher from "../Staff/BooksByLibraryFetcher";
import BooksReport from "../Staff/BooksReport";
import { alertAtom } from "../../../recoil/atoms/alertAtom";
import { libraryAtom } from "../../../recoil/atoms/libraryAtom";
import UpdateUserModal from "../Modals/Users/UpdateUserModal";

const AdminDashboard = () => {
  // recoil atoms
  const [, setActiveModal] = useRecoilState(modalAtom);
  const [, setAlert] = useRecoilState(alertAtom);
  const [user, setUser] = useRecoilState(userAtom);
  const [, setLibraryData] = useRecoilState(libraryAtom);
  const [userToModify, setUserToModify] = useRecoilState(selectedUserAtom);
  const [libraryToModify, setLibraryToModify] =
    useRecoilState(selectedLibraryAtom);
  const [bookToModify, setBookToModify] = useRecoilState(selectedBookAtom);

  // react state
  const [showBookByLibraryReport, setShowBookByLibraryReport] =
    React.useState(false);
  const [showAllBooksReport, setShowAllBooksReport] = React.useState(false);

  // react hooks
  const navigate = useNavigate();

  useEffect(() => {
    setActiveModal(null);
    UpdateCurrentUrl();
    if (user && user.id !== 0) {
      fetchHomeLibraryInfo();
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      fetchUserData();
    }

    if (!user.isLoggedIn) {
      navigate("/login");
      return;
    }
  }, []);

  const fetchHomeLibraryInfo = async () => {
    const reqOptions: RequestInit = {
      method: "GET",
      credentials: "include",
    };
    let url = `${process.env.REACT_APP_BACKEND}/users/${user.id}/homeLibrary`;
    try {
      let res = await fetch(url, reqOptions);
      let data = await res.json();
      // console.log(data);

      url = `${process.env.REACT_APP_BACKEND}/libraries/${data}`;
      res = await fetch(url, reqOptions);
      data = await res.json();

      const updatedUser = { ...user, homeLibraryId: data.id };
      setUser(updatedUser);

      const updatedLibrary = { ...data };
      setLibraryData(updatedLibrary);
    } catch (error) {
      setAlert({
        message: error.message,
        type: "error",
      });
    }
  };

  const fetchUserData = async () => {
    const reqOptions: RequestInit = {
      method: "GET",
      credentials: "include",
    };
    const url = `${process.env.REACT_APP_BACKEND}/users/${user.id}`;
    try {
      const res = await fetch(url, reqOptions);
      const data = await res.json();
      const updatedUser = { ...data };
      setUser(updatedUser);
    } catch (error) {
      setAlert({
        message: error.message,
        type: "error",
      });
    }
  };

  const handleResetLibraryToModify = (e: any) => {
    e.preventDefault();
    setLibraryToModify(emptyLibrary);
  };

  const handleResetUserToModify = (e: any) => {
    e.preventDefault();
    setUserToModify(emptyUserResponse);
  };

  const handleResetBookToModify = (e: any) => {
    e.preventDefault();
    setBookToModify(emptyBook);
  };

  const toggleShowBookByLibraryFetcher = () => {
    setShowBookByLibraryReport(!showBookByLibraryReport);
  };

  const toggleShowAllBooksReport = () => {
    setShowAllBooksReport(!showAllBooksReport);
  };

  return (
    <div>
      <div className="library-dashboard flex m-2">
        <div className="main-section flex-1 p-4 space-y-8">
          <div className="space-x-4 space-y-2">
            <h3>Users Toolbox</h3>
            <div className="flex">
              <CreateUserModal />
              <LookupUserModal />
              <UpdateUserModal />
              <DeleteUserModal />
            </div>
          </div>

          <div className="space-x-4 space-y-2">
            <h3>Libraries Toolbox</h3>
            <div className="flex">
              <CreateLibraryModal />
              <LookupLibraryModal />
              <UpdateLibraryModal />
              <DeleteLibraryModal />
            </div>
          </div>
          <div className="space-x-4  space-y-2">
            <h3>Books Toolbox</h3>
            <div className="flex">
              <CreateBookModal />
              <LookupBookModal />
              <UpdateBookModal />
              <DeleteBookModal />
            </div>
          </div>
          {showAllBooksReport && <BooksReport />}
        </div>

        {/* Sidebar */}
        <aside className="hidden sm:block max-w-xs sidebar p-4 space-y-4 border-l">
          <div className="upcoming-events space-y-2">
            <h2 className="text-xl font-semibold">Active Entities</h2>
            <hr />
          </div>

          {/* User details */}
          <div>
            <div className="flex items-baseline justify-between">
              <h2 className="text-lg font-semibold">User</h2>
              <button
                className={`hover:underline hover:text-blue-400 ${
                  userToModify.id === 0 ? "hidden" : ""
                }`}
                onClick={handleResetUserToModify}>
                Reset User
              </button>
            </div>
            {userToModify.id !== 0 && (
              <>
                <p>ID: {userToModify.id}</p>
                <p>User to Modify: {userToModify.email}</p>
                <p>First Name: {userToModify.firstName}</p>
                <p>Last Name: {userToModify.lastName}</p>
                <p>Role: {userToModify.role}</p>
              </>
            )}

            <hr />
          </div>
          {/* Library details */}
          <div>
            <div className="flex items-baseline justify-between">
              <h2 className="text-lg font-semibold">Library</h2>
              <button
                className={`hover:underline hover:text-blue-400 ${
                  libraryToModify.id === 0 ? "hidden" : ""
                }`}
                onClick={handleResetLibraryToModify}>
                Reset Library
              </button>
            </div>
            {libraryToModify.id !== 0 && (
              <>
                <p>ID: {libraryToModify.id}</p>
                <p>Name: {libraryToModify.name}</p>
                <p>City: {libraryToModify.city}</p>
                <p>Street Address: {libraryToModify.streetAddress}</p>
                <p>Country: {libraryToModify.country}</p>
                <p>PostalCode: {libraryToModify.postalCode}</p>
                <p>Phone: {libraryToModify.phone}</p>
              </>
            )}

            <hr />
          </div>
          {/* Book details */}
          <div>
            <div className="flex items-baseline justify-between">
              <h2 className="text-lg font-semibold">Book</h2>
              <button
                className={`hover:underline hover:text-blue-400 ${
                  bookToModify.id === 0 ? "hidden" : ""
                }`}
                onClick={handleResetBookToModify}>
                Reset Book
              </button>
            </div>
            {bookToModify.id !== 0 && (
              <>
                <p>ID: {bookToModify.id}</p>
                <p>Title: {bookToModify.title}</p>
                <p>ISBN: {bookToModify.isbn}</p>
                <p>Author: {bookToModify.author}</p>
              </>
            )}
          </div>
          <hr />
          <div className="reports-dash">
            <div className="container">
              <div className="flex flex-col gap-y-2">
                <h2 className="text-lg font-semibold">Reports</h2>
                <div className="">
                  <div
                    className="ml-auto hover:underline hover:text-blue-400 cursor-pointer"
                    onClick={toggleShowBookByLibraryFetcher}>
                    Books By Library
                  </div>
                  {showBookByLibraryReport && <BooksByLibraryFetcher />}
                </div>
                <div className="">
                  <div
                    className="ml-auto hover:underline hover:text-blue-400 cursor-pointer"
                    onClick={toggleShowAllBooksReport}>
                    All Books
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AdminDashboard;
