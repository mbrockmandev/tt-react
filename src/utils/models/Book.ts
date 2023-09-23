import BookMetadata from "./BookMetadata";

export interface Book {
  id: number;
  title: string;
  isbn: string;
  author: string;
  summary: string;
  thumbnail: string;
  publishedAt: string;
  createdAt?: string;
  updatedAt?: string;
  metadata?: BookMetadata;
}

export const emptyBook: Book = {
  id: 0,
  title: "",
  isbn: "",
  author: "",
  summary: "",
  thumbnail: "",
  publishedAt: "",
  metadata: undefined,
};

export default Book;
