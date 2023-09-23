import React, { useEffect, useState } from "react";

import { keysToCamelCase } from "../../../utils/jsonConverter";
import { BooksWithMetadata } from "../../../recoil/atoms/booksByLibraryAtom";
import Book from "../../../utils/models/Book";
import { formatUTCDate } from "../../../utils/formatDate";

const PopularBooksReport: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetch(`/books/popular?page=${currentPage}&limit=10`)
      .then((res) => res.json())
      .then((data: BooksWithMetadata) => {
        const camelCaseData = keysToCamelCase(data);
        setBooks(camelCaseData.books);
        setTotalPages(camelCaseData.metadata.totalPages);
      })
      .catch((error) => console.error("Failed to fetch all books:", error));
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
          onClick={() => setCurrentPage((prev) => prev - 1)}>
          Previous
        </button>
        <span className="mx-2">
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}>
          Next
        </button>
      </div>
    </div>
  );
};

export default PopularBooksReport;
