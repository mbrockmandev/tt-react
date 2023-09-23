import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";

import { alertAtom } from "../../../recoil/atoms/alertAtom";
import { bookAtom } from "../../../recoil/atoms/bookAtom";

import Book from "../../../utils/models/Book";
import { userAtom } from "../../../recoil/atoms/userAtom";

const BookRecommendations = () => {
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const user = useRecoilValue(userAtom);
  const [, setBookData] = useRecoilState(bookAtom);
  const [, setAlert] = useRecoilState(alertAtom);

  const navigate = useNavigate();

  useEffect(() => {
    const getRecommendedBooks = async () => {
      const reqOptions: RequestInit = {
        method: "GET",
        credentials: "include",
      };

      const page = Math.floor(Math.random() * 30);
      const limit = 5;
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND}/books/popular?page=${page}&limit=${limit}`,
        reqOptions,
      );
      const data = await res.json();
      if (res.ok && data) {
        setRecommendedBooks(data.books);
      }
    };

    getRecommendedBooks();
  }, []);

  const handleClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    b: Book,
  ) => {
    e.preventDefault();

    const fetchBookData = async () => {
      try {
        const reqOptions: RequestInit = {
          method: "GET",
          credentials: "include",
        };
        const res = await fetch(
          `${process.env.REACT_APP_BACKEND}/books/${b.id}?library_id=${user.homeLibraryId}`,
          reqOptions,
        );
        const data = await res.json();

        setBookData({
          id: data.book.id,
          title: data.book.title,
          author: data.book.author,
          publishedAt: data.book.published_at,
          thumbnail: data.book.thumbnail,
          summary: data.book.summary,
          isbn: data.book.isbn,
          metadata: {
            availableCopies: data.metadata.available_copies,
            totalCopies: data.metadata.total_copies,
            borrowedCopies: data.metadata.borrowed_copies,
          },
        });
        navigate(`/books/${b.id}`);
      } catch (err) {
        setAlert({
          message: err.message,
          type: "error",
        });
      }
    };
    fetchBookData();
  };

  return (
    <div>
      <h4>Recommended Books:</h4>
      {recommendedBooks &&
        recommendedBooks.map((b) => (
          <div
            key={b.id}
            id={b.id}>
            <div className="my-4">
              <button
                className="align-center justify-center text-start break-normal text-blue-600 hover:text-blue-400"
                onClick={(e) => handleClick(e, b)}>
                <p>{b.title}</p>
              </button>
              <hr />
            </div>
          </div>
        ))}
    </div>
  );
};

export default BookRecommendations;
