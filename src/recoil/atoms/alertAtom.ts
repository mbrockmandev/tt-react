import { atom } from "recoil";

type AlertAtomState = {
  message: string;
  type: string;
  duration?: number;
};

export const alertAtom = atom<AlertAtomState>({
  key: "alertState",
  default: {
    message: "",
    type: "",
    duration: 3000,
  },
});
