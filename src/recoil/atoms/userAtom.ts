import { atom } from "recoil";
import { emptyUser, User } from "../../utils/models/User";

export const userAtom = atom<User>({
  key: "userState",
  default: {
    ...emptyUser,
  },
});
