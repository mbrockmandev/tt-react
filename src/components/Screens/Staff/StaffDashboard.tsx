// react, react router
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// local storage funcs
import { UpdateCurrentUrl } from "./../../../utils/urlStorage";

// modal screens
import LookupUserModal from "../Modals/Users/LookupUserModal";
import LookupLibraryModal from "../Modals/Libraries/LookupLibraryModal";
import UpdateLibraryModal from "../Modals/Libraries/UpdateLibraryModal";
import LookupBookModal from "../Modals/Books/LookupBookModal";
import UpdateBookModal from "../Modals/Books/UpdateBookModal";

// recoil funcs
import { useRecoilState } from "recoil";
import { userAtom } from "./../../../recoil/atoms/userAtom";
import { modalAtom } from "./../../../recoil/atoms/modalAtom";

// recoil atoms
import { selectedLibraryAtom } from "./../../../recoil/atoms/selectedLibraryAtom";
import { selectedBookAtom } from "./../../../recoil/atoms/selectedBookAtom";
import { selectedUserAtom } from "./../../../recoil/atoms/selectedUserAtom";

// empty entities
import { emptyLibrary } from "./../../../utils/models/Library";
import { emptyBook } from "./../../../utils/models/Book";
import { emptyLoginUser } from "../../Public/RegisterForm";
import BooksReport from "./BooksReport";
import BooksByLibraryFetcher from "./BooksByLibraryFetcher";
import { alertQueueAtom } from "../../../recoil/atoms/alertAtom";
import UpdateUserModal from "../Modals/Users/UpdateUserModal";
import { libraryAtom } from "../../../recoil/atoms/libraryAtom";

const AdminDashboard = () => {
  const [, setActiveModal] = useRecoilState(modalAtom);
  const [, setAlert] = useRecoilState(alertQueueAtom);
  const [userData, setUserData] = useRecoilState(userAtom);
  const [library, setLibrary] = useRecoilState(libraryAtom);

  const [selectedUser, setSelectedUser] = useRecoilState(selectedUserAtom);
  const [selectedLibrary, setSelectedLibrary] =
    useRecoilState(selectedLibraryAtom);
  const [selectedBook, setSelectedBook] = useRecoilState(selectedBookAtom);

  const [showBookByLibraryReport, setShowBookByLibraryReport] =
    React.useState(false);
  const [showAllBooksReport, setShowAllBooksReport] = React.useState(false);

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

      tempUserData = {
        ...tempUserData,
        id: data.id,
        isLoggedIn: true,
        lastUrl: "staff/dashboard",
        role: data.role,
        email: data.email,
      };

      // Fetch home library info
      url = `${process.env.REACT_APP_BACKEND}/users/${userData.id}/homeLibrary`;
      res = await fetch(url, reqOptions);
      data = await res.json();

      url = `${process.env.REACT_APP_BACKEND}/libraries/${data}`;
      res = await fetch(url, reqOptions);
      data = await res.json();

      tempUserData = {
        ...tempUserData,
        homeLibraryId: data.id,
      };
      setLibrary({ ...data });

      setUserData(tempUserData);
      localStorage.setItem("user", JSON.stringify(tempUserData));
      localStorage.setItem("library", JSON.stringify(library));
    } catch (error) {
      setAlert((prev) => [
        ...prev,
        {
          message: error.message,
          type: "error",
        },
      ]);
    }
  };

  useEffect(() => {
    if (!userData.id) navigate("/login");

    fetchAllUserData();
  }, []);

  const handleResetLibraryToModify = (e: any) => {
    e.preventDefault();
    setSelectedLibrary(emptyLibrary);
  };

  const handleResetUserToModify = (e: any) => {
    e.preventDefault();
    setSelectedUser(emptyLoginUser);
  };

  const handleResetBookToModify = (e: any) => {
    e.preventDefault();
    setSelectedBook(emptyBook);
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
              <LookupUserModal />
              <UpdateUserModal />
            </div>
          </div>

          <div className="space-x-4 space-y-2">
            <h3>Libraries Toolbox</h3>
            <div className="flex">
              <LookupLibraryModal />
              <UpdateLibraryModal />
            </div>
          </div>
          <div className="space-x-4  space-y-2">
            <h3>Books Toolbox</h3>
            <div className="flex">
              <LookupBookModal />
              <UpdateBookModal />
            </div>
          </div>
          {showAllBooksReport && <BooksReport />}
        </div>
        {/* Sidebar */}
        <aside className="hidden sm:block max-w-xs sidebar p-4 space-y-4 border-l">
          <div className="upcoming-events space-y-2">
            <h2 className="text-xl font-semibold">Entities To Modify</h2>
            <hr />
          </div>

          {/* User details */}
          <div>
            <div className="flex items-baseline justify-between">
              <h2 className="text-xl font-semibold">User</h2>
              <button
                className={`hover:underline hover:text-blue-400 ${selectedUser.id === 0 ? "hidden" : ""
                  }`}
                onClick={handleResetUserToModify}
              >
                Reset User
              </button>
            </div>
            {selectedUser.id !== 0 && (
              <>
                <p>ID: {selectedUser.id}</p>
                <p>User to Modify: {selectedUser.email}</p>
                <p>First Name: {selectedUser.firstName}</p>
                <p>Last Name: {selectedUser.lastName}</p>
                <p>Role: {selectedUser.role}</p>
              </>
            )}

            <hr />
          </div>
          {/* Library details */}
          <div>
            <div className="flex items-baseline justify-between">
              <h2 className="text-xl font-semibold">Library</h2>
              <button
                className={`hover:underline hover:text-blue-400 ${selectedLibrary.id === 0 ? "hidden" : ""
                  }`}
                onClick={handleResetLibraryToModify}
              >
                Reset Library
              </button>
            </div>
            {selectedLibrary.id !== 0 && (
              <>
                <p>ID: {selectedLibrary.id}</p>
                <p>Name: {selectedLibrary.name}</p>
                <p>City: {selectedLibrary.city}</p>
                <p>Street Address: {selectedLibrary.streetAddress}</p>
                <p>Country: {selectedLibrary.country}</p>
                <p>PostalCode: {selectedLibrary.postalCode}</p>
                <p>Phone: {selectedLibrary.phone}</p>
              </>
            )}

            <hr />
          </div>
          {/* Book details */}
          <div>
            <div className="flex items-baseline justify-between">
              <h2 className="text-xl font-semibold">Book</h2>
              <button
                className={`hover:underline hover:text-blue-400 ${selectedBook.id === 0 ? "hidden" : ""
                  }`}
                onClick={handleResetBookToModify}
              >
                Reset Book
              </button>
            </div>
            {selectedBook.id !== 0 && (
              <>
                <p>ID: {selectedBook.id}</p>
                <p>Title: {selectedBook.title}</p>
                <p>ISBN: {selectedBook.isbn}</p>
                <p>Author: {selectedBook.author}</p>
              </>
            )}
          </div>
          <div className="reports-dash">
            <div className="container">
              <div className="flex flex-col gap-y-2">
                <h2 className="text-lg font-semibold">Reports</h2>
                <div className="">
                  <div
                    className="ml-auto hover:underline hover:text-blue-400 cursor-pointer"
                    onClick={toggleShowBookByLibraryFetcher}
                  >
                    Books By Library
                  </div>
                  {showBookByLibraryReport && <BooksByLibraryFetcher />}
                </div>
                <div className="">
                  <div
                    className="ml-auto hover:underline hover:text-blue-400 cursor-pointer"
                    onClick={toggleShowAllBooksReport}
                  >
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
