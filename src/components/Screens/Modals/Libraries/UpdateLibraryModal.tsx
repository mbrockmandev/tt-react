import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useRecoilState, useRecoilValue } from "recoil";

import { alertAtom } from "../../../../recoil/atoms/alertAtom";
import { selectedLibraryAtom } from "../../../../recoil/atoms/selectedLibraryAtom";
import { modalAtom } from "../../../../recoil/atoms/modalAtom";
import { userAtom } from "../../../../recoil/atoms/userAtom";

import Library, { emptyLibrary } from "../../../../utils/models/Library";

import { isValidName } from "../../../../utils/validators";

const UpdateLibraryModal = () => {
  const user = useRecoilValue(userAtom);
  const selectedLibrary = useRecoilValue(selectedLibraryAtom);

  const [activeModal, setActiveModal] = useRecoilState(modalAtom);
  const [, setAlert] = useRecoilState(alertAtom);

  const [libraryToModify, setLibraryToModify] = useState<Library>(emptyLibrary);

  useEffect(() => {
    setLibraryToModify(selectedLibrary);
  }, []);

  const handleCancelModal = (e: any) => {
    if (e && e.target.classList.contains("modal-overlay")) {
      setActiveModal(null);
    }

    if (e && e.target.classList.contains("cancel-button")) {
      setActiveModal(null);
    }
  };

  const handleModalChange = () => {
    setActiveModal("UpdateLibraryModal");
  };

  const handleIdChange = (e: any) => {
    if (e && e.target.value) {
      setLibraryToModify({
        ...libraryToModify,
        id: e.target.value,
      });
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLibraryToModify({
      ...libraryToModify,
      name: e.target.value,
    });
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLibraryToModify({
      ...libraryToModify,
      city: e.target.value,
    });
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLibraryToModify({
      ...libraryToModify,
      streetAddress: e.target.value,
    });
  };

  const handlePostalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLibraryToModify({
      ...libraryToModify,
      postalCode: e.target.value,
    });
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLibraryToModify({
      ...libraryToModify,
      country: e.target.value,
    });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let tempPhone = e.target.value;
    const numericPhone = tempPhone.replace(/\D/g, "");

    if (numericPhone.length > 10) {
      setAlert({
        message: "invalid phone number",
        type: "error",
      });
      return;
    }
    const formattedPhone = "+" + numericPhone;

    setLibraryToModify({
      ...libraryToModify,
      phone: formattedPhone,
    });
  };

  const handleLookup = async (e: any) => {
    e.preventDefault();

    if (!libraryToModify.id && !libraryToModify.name) {
      return;
    }

    const searchById = libraryToModify.id !== null;
    const searchByName = libraryToModify.name !== "";

    if (searchById && searchByName) {
      setAlert({
        message: "Choose either ID or Email and leave the other blank",
        type: "error",
      });
      return;
    }

    try {
      const reqOptions: RequestInit = {
        method: "GET",
        credentials: "include",
      };

      let url = "";
      if (searchById) {
        url = `${process.env.REACT_APP_BACKEND}/${user.role}/libraries/${libraryToModify.id}`;
      } else if (searchByName) {
        url = `${process.env.REACT_APP_BACKEND}/${user.role}/libraries?name=${libraryToModify.name}`;
      }
      const res = await fetch(url, reqOptions);

      if (res.ok) {
        setAlert({
          message: "Found library!",
          type: "success",
        });
      } else if (!res.ok) {
        throw new Error(`HTTP status code: ` + res.status);
      }

      const data = await res.json();

      setLibraryToModify({
        id: data.id,
        name: data.name,
        city: data.city,
        streetAddress: data.street_address,
        postalCode: data.postal_code,
        country: data.country,
        phone: data.phone,
      });
    } catch (err) {
      setAlert({ message: err.message, type: "error" });
      console.error(err);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      if (!isValidName(libraryToModify.name)) throw new Error("Invalid name");
      if (!isValidName(libraryToModify.city)) throw new Error("Invalid city");
      if (!isValidName(libraryToModify.streetAddress)) {
        throw new Error("Invalid streetAddress");
      }
      if (!isValidName(libraryToModify.postalCode)) {
        throw new Error("Invalid postalCode");
      }
      if (!isValidName(libraryToModify.country))
        throw new Error("Invalid country");

      const reqOptions: RequestInit = {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: libraryToModify.name,
          city: libraryToModify.city,
          street_address: libraryToModify.streetAddress,
          postal_code: libraryToModify.postalCode,
          country: libraryToModify.country,
          phone: libraryToModify.phone,
        }),
      };

      const url = `${process.env.REACT_APP_BACKEND}/${user.role}/libraries/${libraryToModify.id}`;
      const res = await fetch(url, reqOptions);

      if (!res.ok) {
        throw new Error("HTTP status code: " + res.status);
      }

      const data = await res.json();

      setAlert({ message: data.message, type: "success" });
    } catch (err) {
      setAlert({ message: err.message, type: "error" });
      console.error(err);
      if (err !== "") {
        return;
      }
    }
  };

  const modal =
    activeModal === "UpdateLibraryModal" &&
    ReactDOM.createPortal(
      <div
        className="modal-overlay"
        onClick={handleCancelModal}>
        <form className="mx-auto mb-0 mt-6 space-y-4 rounded-lg p-4 bg-gray-50 shadow-lg shadow-gray-300/50 sm:mt-8 sm:p-6 lg:p-8">
          {selectedLibrary.id === 0 && (
            <>
              <p className="text-center text-lg font-medium">Update Library</p>

              <div className="flex items-center">
                <label
                  htmlFor="email"
                  className="mr-auto">
                  ID
                </label>

                <div className="relative">
                  <input
                    id="id"
                    type="text"
                    onChange={handleIdChange}
                    className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm focus:ring-gray-200 focus:border-gray-400 active:border-gray-200"
                    placeholder="id"
                  />
                </div>
              </div>
              <div className="flex items-center gap-x-2">
                <label
                  htmlFor="email"
                  className="mr-auto">
                  Name
                </label>

                <div className="relative">
                  <input
                    id="name"
                    type="text"
                    onChange={handleNameChange}
                    className="search-name w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm focus:ring-gray-200 focus:border-gray-400 active:border-gray-200"
                    placeholder="Name"
                    autoComplete="name"
                  />

                  <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  </span>
                </div>
              </div>
              <div className="flex">
                <button
                  type="submit"
                  className="submit-button block w-[35%] bg-green-300 rounded-lg bg-secondary px-5 py-3 text-sm font-medium text-black mx-auto"
                  onClick={handleLookup}>
                  Lookup
                </button>
              </div>
            </>
          )}

          {selectedLibrary.id !== 0 && (
            <>
              <p className="text-center text-lg font-medium">Update Library</p>

              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mr-auto">
                  Name
                </label>

                <div className="relative">
                  <input
                    id="name"
                    type="text"
                    onChange={handleNameChange}
                    value={libraryToModify.name}
                    className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm focus:ring-gray-200 focus:border-gray-400 active:border-gray-200"
                    placeholder="Name"
                    autoComplete="name"
                    required
                  />
                </div>
              </div>

              {/* City */}
              <div>
                <label
                  htmlFor="city"
                  className="mr-auto">
                  City
                </label>

                <div className="relative">
                  <input
                    id="city"
                    type="text"
                    onChange={handleCityChange}
                    value={libraryToModify.city}
                    className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm focus:ring-gray-200 focus:border-gray-400 active:border-gray-200"
                    placeholder="City"
                    autoComplete="city"
                    required
                  />
                </div>
              </div>

              {/* Street Address */}
              <div>
                <label
                  htmlFor="streetAddress"
                  className="mr-auto">
                  Street Address
                </label>

                <div className="relative">
                  <input
                    id="streetAddress"
                    type="text"
                    onChange={handleAddressChange}
                    value={libraryToModify.streetAddress}
                    className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm focus:ring-gray-200 focus:border-gray-400 active:border-gray-200"
                    placeholder="Street Address"
                    autoComplete="streetAddress"
                    required
                  />
                </div>
              </div>

              {/* Postal Code */}
              <div>
                <label
                  htmlFor="postalCode"
                  className="mr-auto">
                  Postal Code
                </label>

                <div className="relative">
                  <input
                    id="postalCode"
                    type="text"
                    onChange={handlePostalChange}
                    value={libraryToModify.postalCode}
                    className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm focus:ring-gray-200 focus:border-gray-400 active:border-gray-200"
                    placeholder="Postal Code"
                    autoComplete="postalCode"
                    required
                  />
                </div>
              </div>

              {/* Country */}
              <div>
                <label
                  htmlFor="country"
                  className="mr-auto">
                  Country
                </label>

                <div className="relative">
                  <input
                    id="country"
                    type="text"
                    onChange={handleCountryChange}
                    value={libraryToModify.country}
                    className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm focus:ring-gray-200 focus:border-gray-400 active:border-gray-200"
                    placeholder="Country"
                    autoComplete="country"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="mr-auto">
                  Phone
                </label>

                <div className="relative">
                  <input
                    id="phone"
                    type="tel"
                    pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                    onChange={handlePhoneChange}
                    value={libraryToModify.phone}
                    className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm focus:ring-gray-200 focus:border-gray-400 active:border-gray-200"
                    placeholder="(123)-456-7890"
                    autoComplete="phone"
                    required
                  />
                </div>
              </div>

              <div className="flex">
                <button
                  type="submit"
                  className="cancel-button block w-[35%] bg-red-300 rounded-lg bg-secondary px-5 py-3 text-sm font-medium text-black mx-auto"
                  onClick={handleCancelModal}>
                  Cancel
                </button>

                <button
                  type="submit"
                  className="block w-[35%] bg-green-300 rounded-lg bg-secondary px-5 py-3 text-sm font-medium text-black mx-auto"
                  onClick={handleSubmit}>
                  Update
                </button>
              </div>
            </>
          )}
        </form>
      </div>,
      document.getElementById("modal-root"),
    );

  return (
    <div>
      <div
        className="flex text-sm px-4 py-2 hover:text-blue-500 hover:underline cursor-pointer"
        onClick={handleModalChange}>
        Update Library
      </div>
      {modal}
    </div>
  );
};

export default UpdateLibraryModal;
