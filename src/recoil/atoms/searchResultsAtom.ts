import {atom} from "recoil";
import Book from "../../utils/models/Book";

type SearchResultsState = {
  books: Book[];
}

export const searchResultsAtom = atom<SearchResultsState>({
  key: "searchResultsState",
  default: {
    books: [],
  },
});
