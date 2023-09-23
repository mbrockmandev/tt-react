import { atom } from "recoil";

export const libraryAtom = atom<ResponseLibrary>({
  key: "libraryState",
  default: {
    id: 0,
    name: "",
    city: "",
    streetAddress: "",
    postalCode: "",
    phone: "",
  },
});

export type ResponseLibrary = {
  id: number;
  name: string;
  city: string;
  streetAddress: string;
  postalCode: string;
  phone: string;
};
