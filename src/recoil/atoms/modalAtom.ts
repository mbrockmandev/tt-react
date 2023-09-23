import { atom } from "recoil";

export const modalAtom = atom<string | null>({
  key: "modalAtom",
  default: null,
});
