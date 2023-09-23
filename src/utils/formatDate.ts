export const formatFullUTCDate = (inputDate: string) => {
  const date = new Date(inputDate);
  const yyyy = date.getUTCFullYear();
  const MM = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");
  const hh = String(date.getUTCHours()).padStart(2, "0");
  const mm = String(date.getUTCMinutes()).padStart(2, "0");

  return `${yyyy}-${MM}-${dd}T${hh}:${mm}`;
};

export const formatUTCDate = (inputDate: string) => {
  const date = new Date(inputDate);
  const yyyy = date.getUTCFullYear();
  const MM = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");

  return `${yyyy}-${MM}-${dd}`;
};
