import React, { useState } from "react";
import { useRecoilState } from "recoil";
import { Link } from "react-router-dom";

import { alertAtom } from "../../../recoil/atoms/alertAtom";
import { booksByLibraryAtom } from "../../../recoil/atoms/booksByLibraryAtom";

import { keysToCamelCase } from "../../../utils/jsonConverter";
import Book from "../../../utils/models/Book";

const BooksByLibraryFetcher = () => {
  const [booksByLibrary, setBooksByLibrary] =
    useRecoilState(booksByLibraryAtom);
  const [, setAlert] = useRecoilState(alertAtom);

  const [libraryId, setLibraryId] = useState("");

  const calculateTotalBooksAtLibrary = (books: Book[]): number => {
    let sum = 0;
    for (let book of books) {
      sum += book.metadata.totalCopies;
    }
    return sum;
  };

  const fetchReport = async () => {
    const url = `${process.env.REACT_APP_BACKEND}/staff/reports/booksByLibrary?library_id=${libraryId}`;
    // console.log("fetchReport URL:", url);
    const reqOptions: RequestInit = {
      method: "GET",
      credentials: "include",
    };

    try {
      const res = await fetch(url, reqOptions);
      const data = await res.json();
      const camelCasedData = keysToCamelCase(data);

      if (res.ok && camelCasedData) {
        setAlert({
          message: "Report fetched successfully",
          type: "success",
        });
      } else {
        setBooksByLibrary({
          books: [],
          libraryId: 0,
          page: 0,
          totalPages: 0,
          totalBookCount: 0,
        });
        setAlert({
          message: camelCasedData.message,
          type: "error",
        });
      }
      if (
        camelCasedData.books &&
        Array.isArray(camelCasedData.books) &&
        camelCasedData.metadata
      ) {
        setBooksByLibrary({
          books: camelCasedData.books,
          libraryId: +libraryId,
          page: camelCasedData.metadata.currentPage,
          totalPages: camelCasedData.metadata.totalPages,
          totalBookCount: calculateTotalBooksAtLibrary(camelCasedData.books),
        });
      }
    } catch (error) {
      setAlert({
        message: error.message,
        type: "error",
      });
    }
  };

  return (
    <div>
      <div>
        <label htmlFor="libraryId">Library ID: </label>
        <input
          className="rounded-md border-gray-400 hover:border-gray-600"
          type="number"
          id="libraryId"
          value={libraryId}
          onChange={(e) => setLibraryId(e.target.value)}
        />
        <button
          className="my-2 p-2 bg-blue-100 rounded-md hover:bg-blue-400 hover:scale-105"
          onClick={fetchReport}
        >
          Fetch Report
        </button>
      </div>

      <div>
        {booksByLibrary.books.length > 0 && (
          <>
            <h2 className="mb-4">
              {booksByLibrary.books.length} Books in Library
            </h2>
            <Link
              className="my-2 p-3 bg-blue-100 rounded-md hover:bg-blue-400 hover:scale-105"
              to={`/reports/booksByLibrary`}
            >
              See Details
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default BooksByLibraryFetcher;
