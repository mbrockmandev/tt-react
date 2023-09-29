import React from "react";
import { Button } from "@material-tailwind/react";

import Book from "../../utils/models/Book";

interface TooltipProps {
  message: string;
}

interface BorrowButtonProps {
  borrowButtonText: string;
  book: Book;
  handleBookAction: (action: string) => void;
}

interface TooltipProps {
  message: string;
}

interface BorrowButtonProps {
  borrowButtonText: string;
  book: Book;
  handleBookAction: (action: string) => void;
}

const Tooltip: React.FC<TooltipProps> = ({ message }) => {
  return (
    <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 px-2 py-1 text-sm text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      {message}
    </div>
  );
};

export const BorrowButton: React.FC<BorrowButtonProps> = ({
  borrowButtonText,
  book,
  handleBookAction,
}) => {
  if (borrowButtonText === "return") {
    return (
      <Button
        className="mb-4 w-36 h-16 bg-red-400 hover:bg-red-500 transition-colors duration-300"
        onClick={() => handleBookAction("return")}
      >
        Return
      </Button>
    );
  }

  const isBorrowable =
    borrowButtonText === "borrow" && book.metadata?.availableCopies > 0;
  const buttonClass = isBorrowable
    ? "bg-green-400 hover:bg-green-500"
    : "bg-gray-200 cursor-not-allowed";

  return (
    <div
      className={`relative group ${borrowButtonText === "n/a" ? "hover:cursor-not-allowed" : ""
        }`}
    >
      <Button
        className={`mb-4 w-36 h-16 transition-colors duration-300 ${buttonClass}`}
        onClick={isBorrowable ? () => handleBookAction("borrow") : undefined}
      >
        Borrow
      </Button>
      {borrowButtonText === "n/a" && <Tooltip message="Book not available" />}
      {borrowButtonText === "return" && (
        <Tooltip message="Book already borrowed" />
      )}
    </div>
  );
};
