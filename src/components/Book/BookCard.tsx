import React from "react";
import { Link } from "react-router-dom";

import Book from "../../utils/models/Book";
import BookMetadata from "../../utils/models/BookMetadata";

type BookCardProps = {
  book: Book;
  metadata?: BookMetadata;
};

export function ImageContainer({ src, title }) {
  return (
    <div className="w-full h-full overflow-hidden relative">
      <img
        src={src}
        alt={`${title} cover`}
        className="w-full h-full object-cover absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      />
    </div>
  );
}

const BookCard: React.FC<BookCardProps> = ({ book, metadata }) => {
  const { id, title, thumbnail } = book;

  return (
    <div
      style={{ aspectRatio: "9/6" }}
      className="w-fit z-10 relative py-8">
      <Link
        to={`/books/${id}`}
        className={`group relative block transition hover:scale-105 ${
          metadata ? "h-96 w-60" : "h-48 w-28"
        }`}>
        <span className="absolute inset-0 drop-shadow"></span>

        <div
          className={`relative flex h-full transform items-end drop-shadow-md bg-white transition-transform`}>
          <ImageContainer
            src={thumbnail}
            title={title}
          />
        </div>

        {metadata && <h5>Available Copies: {metadata?.availableCopies}</h5>}
      </Link>
    </div>
  );
};

export default BookCard;
