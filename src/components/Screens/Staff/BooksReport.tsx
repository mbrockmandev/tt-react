import React, { useEffect, useState } from "react";

import { keysToCamelCase } from "../../../utils/jsonConverter";
import { BooksWithMetadata } from "../../../recoil/atoms/booksByLibraryAtom";
import Book from "../../../utils/models/Book";
import { formatUTCDate } from "../../../utils/formatDate";
import { alertQueueAtom } from "../../../recoil/atoms/alertAtom";
import { useRecoilState } from "recoil";

const PopularBooksReport: React.FC = () => {
  const [, setAlert] = useRecoilState(alertQueueAtom);
  const [books, setBooks] = useState<Book[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchBooks = async () => {
      const url = `${process.env.REACT_APP_BACKEND}/books/popular?page=${currentPage}&limit=10`;
      const reqOptions: RequestInit = {
        method: "GET",
        credentials: "include",
      };
      try {
        const res = await fetch(url, reqOptions);
        const data = await res.json();
        if (data as BooksWithMetadata) {
          const camelCaseData = keysToCamelCase(data);
          setBooks(camelCaseData.books);
          setTotalPages(camelCaseData.metadata.totalPages);
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
    fetchBooks();
  }, [currentPage]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">All Books Report</h2>
      <table className="min-w-full divide-y divide-gray-200 border">
        <thead>
          <tr>
            <th className="border p-2">Title</th>
            <th className="border p-2">Author</th>
            <th className="border p-2">ISBN</th>
            <th className="border p-2">Published At</th>
            <th className="border p-2">Created At</th>
            <th className="border p-2">Updated At</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td className="border p-2">{book.title}</td>
              <td className="border p-2">{book.author}</td>
              <td className="border p-2">{book.isbn}</td>
              <td className="border p-2">{formatUTCDate(book.publishedAt)}</td>
              <td className="border p-2">{formatUTCDate(book.createdAt)}</td>
              <td className="border p-2">{formatUTCDate(book.updatedAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Previous
        </button>
        <span className="mx-2">
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PopularBooksReport;
