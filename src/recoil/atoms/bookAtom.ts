import {atom} from "recoil";
import {Book} from "../../utils/models/Book";

export const bookAtom = atom<Book>({
  key: "bookState",
  default: null,
});
