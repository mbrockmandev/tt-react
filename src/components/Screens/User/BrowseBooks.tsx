import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

import { alertAtom } from "../../../recoil/atoms/alertAtom";

import Book from "../../../utils/models/Book";
import BookCard from "../../Book/BookCard";

import PaginationNumbers from "../../Common/PaginationNumbers";
import { UpdateCurrentUrl } from "../../../utils/urlStorage";

const BrowseBooks = () => {
  const [, setAlert] = useRecoilState(alertAtom);
  const [books, setBooks] = useState<Book[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(20);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const fetchBooks = async () => {
      const reqOptions: RequestInit = {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      };

      const url = `${process.env.REACT_APP_BACKEND}/books/popular?page=${page}&limit=${limit}`;

      try {
        const res = await fetch(url, reqOptions);
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const data = await res.json();

        setTotalPages(data.metadata.totalPages);

        if (Array.isArray(data.books)) {
          setBooks(
            data.books.map(
              (b: {
                id: number;
                title: string;
                author: string;
                summary: string;
                thumbnail: string;
              }) => ({
                id: b.id,
                title: b.title,
                author: b.author,
                summary: b.summary,
                thumbnail: b.thumbnail,
              }),
            ),
          );
          UpdateCurrentUrl();
        }
      } catch (err) {
        setAlert({
          message: err.message,
          type: "error",
        });
      }
    };

    fetchBooks();
  }, [setBooks, page, limit]);

  return (
    <>
      <div className="flex items-center justify-center w-screen gap-3 pt-4">
        <div className="main-section flex-1 p-4 space-y-4">
          <h1 className="font-black text-3xl">
            Page {page} of {totalPages}
          </h1>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4">
            {books.map((b) => (
              <BookCard key={`${b.id}`} book={b} />
            ))}
          </div>
        </div>
      </div>
      <PaginationNumbers
        page={page}
        totalPages={totalPages}
        onPageChange={(newPage) => setPage(newPage)}
      />
    </>
  );
};

export default BrowseBooks;
