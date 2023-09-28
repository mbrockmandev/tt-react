import React from "react";
import { useRecoilState } from "recoil";

import { booksByLibraryAtom } from "../../../recoil/atoms/booksByLibraryAtom";

import BookCard from "../../Book/BookCard";

import PaginationNumbers from "../../Common/PaginationNumbers";

const ITEMS_PER_PAGE = 10;

const BooksByLibraryReport = () => {
  const [booksByLibrary, setBooksByLibrary] =
    useRecoilState(booksByLibraryAtom);

  const displayedBooks = booksByLibrary.books.slice(
    (booksByLibrary.page - 1) * ITEMS_PER_PAGE,
    booksByLibrary.page * ITEMS_PER_PAGE,
  );

  return (
    <>
      <div className="flex items-center justify-center w-screen gap-3 pt-4">
        <div className="main-section flex-1 p-4 space-y-4">
          <div>
            <div className="font-black text-3xl">
              {booksByLibrary.books.length} different titles at Library #
              {booksByLibrary.libraryId}
            </div>
            <div className="font-bold text-xl">
              A total of {booksByLibrary.totalBookCount} books!
            </div>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4">
            {displayedBooks.map((b) => (
              <BookCard
                key={`${b.book.id}`}
                book={b.book}
                metadata={b.metadata}
              />
            ))}
          </div>
        </div>
      </div>
      <PaginationNumbers
        page={booksByLibrary.page}
        totalPages={booksByLibrary.totalPages}
        onPageChange={(newPage) =>
          setBooksByLibrary({
            ...booksByLibrary,
            page: newPage,
          })
        }
      />
    </>
  );
};

export default BooksByLibraryReport;
