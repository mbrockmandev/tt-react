import { atom } from "recoil";
import Book, { emptyBook } from "../../utils/models/Book";

export const selectedBookAtom = atom<Book>({
  key: "selectedBookState",
  default: { ...emptyBook },
});
