import {atom} from "recoil";
import Book from "../../utils/models/Book";
import BookMetadata from "../../utils/models/BookMetadata";

export type BooksWithMetadata = {
  book: Book;
  metadata: BookMetadata;
}

type BooksByLibraryState = {
  books: BooksWithMetadata[];
  libraryId: number;
  page: number;
  totalPages: number;
  totalBookCount: number;
}

export const booksByLibraryAtom = atom<BooksByLibraryState>({
  key: "booksByLibraryState",
  default: {
    books: [],
    libraryId: 0,
    page: 0,
    totalPages: 0,
    totalBookCount: 0,
  },
});

