import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";

// atoms
import { bookAtom } from "../../recoil/atoms/bookAtom";
import { userAtom } from "../../recoil/atoms/userAtom";
import { alertAtom } from "../../recoil/atoms/alertAtom";

// components
import { ImageContainer } from "./BookCard";

// models
import Book from "../../utils/models/Book";

// utils
import { UpdateCurrentUrl } from "../../utils/urlStorage";
import { BorrowButton } from "./BorrowButton";
import { libraryAtom } from "../../recoil/atoms/libraryAtom";
import { formatUTCDate } from "../../utils/formatDate";

const BookDetails: React.FC = () => {
  const [userData, setUserData] = useRecoilState(userAtom);
  const [bookData, setBookData] = useRecoilState(bookAtom);
  const libraryData = useRecoilValue(libraryAtom);
  const [, setAlert] = useRecoilState(alertAtom);
  const [borrowButtonText, setBorrowButtonText] = useState("borrow");

  const { bookId } = useParams();

  const navigate = useNavigate();

  const handleBookAction = async (action: string) => {
    const url = `${process.env.REACT_APP_BACKEND}/users/books/${action}`;
    const reqOptions: RequestInit = {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        library_id: userData.homeLibraryId,
        user_id: userData.id,
        book_id: bookData.id,
      }),
    };

    try {
      const res = await fetch(url, reqOptions);
      const data = await res.json();

      if (res.ok) {
        const updatedUser =
          action === "borrow"
            ? {
                ...userData,
                borrowedBooks: [...userData.borrowedBooks, bookData],
              }
            : {
                ...userData,
                borrowedBooks: userData.borrowedBooks.filter(
                  (b) => b.id !== bookData.id,
                ),
              };
        setUserData(updatedUser);
        setAlert({
          message: "Book borrowed.",
          type: "success",
        });
      }
      if (!res.ok) {
        throw new Error(data.message || "unknown error occurred");
      }
    } catch (error) {
      setAlert({
        message: error.message,
        type: "error",
      });
      console.error(error);
    }
  };

  const handleChangeLibrary = () => {
    navigate("/libraries");
  };

  const fetchBookData = async () => {
    const reqOptions: RequestInit = {
      method: "GET",
      credentials: "include",
    };
    try {
      if (userData.homeLibraryId === 0) {
        setAlert({
          message:
            "Home library has not been set!\nPlease navigate to the Libraries page!",
          type: "error",
        });
        return;
      }
      const url = `${process.env.REACT_APP_BACKEND}/books/${bookId}?library_id=${userData.homeLibraryId}`;
      const res = await fetch(url, reqOptions);
      const data = await res.json();
      if (data && data.book.id !== 0) {
        const updatedBook: Book = {
          id: data.book.id,
          title: data.book.title,
          author: data.book.author,
          publishedAt: formatUTCDate(data.book.published_at),
          thumbnail: data.book.thumbnail,
          summary: data.book.summary,
          isbn: data.book.isbn,
          metadata: {
            availableCopies: data.metadata.available_copies,
            totalCopies: data.metadata.total_copies,
            borrowedCopies: data.metadata.borrowed_copies,
          },
        };
        setBookData(updatedBook);
      }
    } catch (err) {
      setAlert({
        message: err.message,
        type: "error",
      });
    }
  };

  const updateBorrowButtonText = async () => {
    if (userData.role !== "user") {
      setBorrowButtonText("n/a");
    }
    if (userData.id === 0 && bookData.id === 0) {
      return;
    }

    const borrowedBookIds: number[] = [];
    for (let book of userData.borrowedBooks) {
      borrowedBookIds.push(book.id);
    }

    if (borrowedBookIds.includes(bookData.id)) {
      setBorrowButtonText("return");
    } else if (
      !borrowedBookIds.includes(bookData.id) &&
      bookData.metadata?.availableCopies <= 0
    ) {
      setBorrowButtonText("n/a");
    } else {
      setBorrowButtonText("borrow");
    }
  };

  // initial load, update current URL and get book, library data
  useEffect(() => {
    UpdateCurrentUrl();
    fetchBookData();
    updateBorrowButtonText();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData.role]);

  if (!bookData) {
    return (
      <>
        <div className="flex w-screen items-center justify-center">
          <div className="book m-4">
            <h3 className="font-black">Book Details</h3>
            <div className="flex">Loading...</div>
            <p>
              <span className="font-semibold">Title:</span> Loading...
            </p>
            <p>
              <span className="font-semibold">Author:</span> Loading...
            </p>
          </div>
        </div>
        <div className="mx-8">
          <p className="font-bold">Description:</p>
          <p>Loading...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mx-auto">
        <div className="book m-4">
          <h3 className="font-black">Book Details</h3>
          <div className="md:flex justify-center gap-8 items-start">
            {/* Title & Author */}
            <div className="ml-8 mt-8 mr-auto">
              <p>
                <span className="font-semibold">Title:</span> {bookData.title}
              </p>
              <p>
                <span className="font-semibold">Author:</span> {bookData.author}
              </p>
            </div>

            {/* Cover Art */}
            <div
              style={{ aspectRatio: "9/6" }}
              className="mx-auto w-fit z-10 relative py-8"
            >
              <div className="group relative block h-96 w-60">
                <span className="absolute inset-0 drop-shadow"></span>

                <div className="relative flex h-full transform items-end drop-shadow-md bg-white transition-transform ">
                  <ImageContainer
                    src={bookData.thumbnail}
                    title={bookData.title}
                  />
                </div>
              </div>
            </div>

            <div>
              {/* Button */}
              <BorrowButton
                borrowButtonText={borrowButtonText}
                book={bookData}
                handleBookAction={handleBookAction}
              />
              <div className="mt-4">
                <div className="flex">
                  <h4 className="mb-4">Book Data for {libraryData.name}</h4>
                  <button
                    className="ml-8 mb-4 hover:underline hover:text-blue-400"
                    onClick={handleChangeLibrary}
                  >
                    Change?
                  </button>
                </div>
                <hr className="mb-4" />
                <h5 className="mb-4 text-md">
                  Available Copies: {bookData.metadata?.availableCopies}
                </h5>
                <h5 className="mb-4 text-md">
                  Total Copies: {bookData.metadata?.totalCopies}
                </h5>
                <h5 className="mb-4 text-md">
                  Borrowed Copies: {bookData.metadata?.borrowedCopies}
                </h5>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-8">
        <p className="font-bold">Description:</p>
        <p>{bookData.summary}</p>
      </div>
    </>
  );
};

export default BookDetails;
