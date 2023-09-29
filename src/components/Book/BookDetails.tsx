import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";

// atoms
import { bookAtom } from "../../recoil/atoms/bookAtom";
import { userAtom } from "../../recoil/atoms/userAtom";
import { alertQueueAtom } from "../../recoil/atoms/alertAtom";

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
  const [, setAlert] = useRecoilState(alertQueueAtom);
  const [borrowButtonText, setBorrowButtonText] = useState("");
  const [loading, setLoading] = useState(true);

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
        setAlert((prev) => [
          ...prev,
          {
            message: `Book ${action}ed.`,
            type: "success",
          },
        ]);
      }
      if (!res.ok) {
        throw new Error(data.message || "unknown error occurred");
      }
    } catch (error) {
      setAlert((prev) => [
        ...prev,
        {
          message: error.message,
          type: "error",
        },
      ]);
      console.error(error);
    }
  };

  const handleChangeLibrary = () => {
    navigate("/libraries");
  };

  // initial load, update current URL and get book, library data
  useEffect(() => {
    if (!loading || !userData || userData.homeLibraryId === 0) return;

    UpdateCurrentUrl();

    const fetchBookData = async () => {
      const reqOptions: RequestInit = {
        method: "GET",
        credentials: "include",
      };
      try {
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
          console.log("complete book data from fetch: ", data);
          setBookData(updatedBook);
          return updatedBook;
        }
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

    const updateBorrowButtonText = async (b: Book) => {
      // only users may borrow/return
      if (userData.role !== "user") {
        setBorrowButtonText("n/a");
        return;
      } else if (b.metadata && b.metadata.availableCopies <= 0) {
        setBorrowButtonText("n/a");
        return;
      }

      const borrowedBookIds: number[] = userData.borrowedBooks.map(
        (book) => book.id,
      );

      if (borrowedBookIds.includes(b.id)) {
        setBorrowButtonText("return");
      } else {
        setBorrowButtonText("borrow");
      }
    };

    const loadDataAndUpdateButton = async () => {
      const book = await fetchBookData();
      await updateBorrowButtonText(book);
    };

    loadDataAndUpdateButton();

    setLoading(false);
  }, []);

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
