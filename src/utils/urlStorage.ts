const urlKey = "relativeUrl";

export const GetLastUrl = (): string => {
  return localStorage.getItem(urlKey);
};

export const UpdateCurrentUrl = () => {
  const urlString = window.location.href;
  const url = new URL(urlString);
  const relativeUrl = url.pathname + url.search + url.hash;
  localStorage.setItem(urlKey, relativeUrl);
  return relativeUrl;
};

export const ResetCurrentUrl = () => {
  localStorage.setItem(urlKey, "login");
};
