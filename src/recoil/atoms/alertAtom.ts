import { atom, selector } from "recoil";

type AlertType = {
  message: string;
  type: string;
  duration?: number;
};

export const alertQueueAtom = atom<AlertType[]>({
  key: "alertQueueState",
  default: [],
});

export const currentAlertSelector = selector<AlertType | null>({
  key: "currentAlertSelector",
  get: ({ get }) => {
    const queue = get(alertQueueAtom);
    return queue.length > 0 ? queue[0] : null;
  },
});
