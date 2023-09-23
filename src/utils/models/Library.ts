export interface Library {
  id: number;
  name: string;
  city: string;
  streetAddress: string;
  postalCode: string;
  country: string;
  phone: string;
}

export const emptyLibrary: Library = {
  id: 0,
  name: "",
  city: "",
  streetAddress: "",
  postalCode: "",
  country: "",
  phone: "",
};

export default Library;
