import { atom } from "recoil";
import {
  UserResponse,
  emptyUserResponse,
} from "../../utils/models/UserResponse";

export const selectedUserAtom = atom<UserResponse>({
  key: "selectedUserState",
  default: {
    ...emptyUserResponse,
  },
});
