import Book from "./Book";

export interface User {
  id: number;
  email: string;
  borrowedBooks: Book[];
  returnedBooks: Book[];
  homeLibraryId: number;
  isLoggedIn: boolean;
  role: string;
  lastUrl: string;
}

export const emptyUser: User = {
  id: 0,
  email: "",
  role: "",
  borrowedBooks: [],
  returnedBooks: [],
  homeLibraryId: 0,
  isLoggedIn: false,
  lastUrl: "",
};
