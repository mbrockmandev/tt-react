import { atom } from "recoil";
import Library, { emptyLibrary } from "../../utils/models/Library";

export const selectedLibraryAtom = atom<Library>({
  key: "selectedLibraryState",
  default: {
    ...emptyLibrary,
  },
});
