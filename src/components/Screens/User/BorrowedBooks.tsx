import React from "react";
import { useRecoilValue } from "recoil";

import { userAtom } from "../../../recoil/atoms/userAtom";

import Book from "../../../utils/models/Book";
import BookCard from "../../Book/BookCard";

const BorrowedBooks: React.FC = () => {
  const user = useRecoilValue(userAtom);

  if (user.borrowedBooks.length === 0) {
    return (
      <div className="">
        <p>You don't have any borrowed books. Get to reading!</p>
      </div>
    );
  }

  return (
    <>
      {user.borrowedBooks &&
        user.borrowedBooks.map((b: Book) => (
          <div
            className="mr-4 mb-4"
            key={`${b.id}`}>
            <BookCard book={b} />
          </div>
        ))}
    </>
  );
};

export default BorrowedBooks;
