import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useRecoilState } from "recoil";

import { modalAtom } from "../../../../recoil/atoms/modalAtom";
import { alertAtom } from "../../../../recoil/atoms/alertAtom";
import { selectedLibraryAtom } from "../../../../recoil/atoms/selectedLibraryAtom";

import Library, { emptyLibrary } from "../../../../utils/models/Library";

import { isValidName } from "../../../../utils/validators";

const CreateLibraryModal = () => {
  const [activeModal, setActiveModal] = useRecoilState(modalAtom);
  const [, setAlert] = useRecoilState(alertAtom);
  const [newLibrary, setNewLibrary] = useState<Library>(emptyLibrary);
  const [, setLibraryToModify] = useRecoilState(selectedLibraryAtom);

  const handleCancelModal = (e: any) => {
    if (e && e.target.classList.contains("modal-overlay")) {
      setNewLibrary(emptyLibrary);
      setActiveModal(null);
    }
  };

  const handleModalChange = () => {
    setActiveModal("CreateLibraryModal");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewLibrary({
      ...newLibrary,
      name: e.target.value,
    });
    setLibraryToModify({
      ...newLibrary,
      name: e.target.value,
    });
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewLibrary({
      ...newLibrary,
      city: e.target.value,
    });
    setLibraryToModify({
      ...newLibrary,
      city: e.target.value,
    });
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewLibrary({
      ...newLibrary,
      streetAddress: e.target.value,
    });
    setLibraryToModify({
      ...newLibrary,
      streetAddress: e.target.value,
    });
  };

  const handlePostalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewLibrary({
      ...newLibrary,
      postalCode: e.target.value,
    });
    setLibraryToModify({
      ...newLibrary,
      postalCode: e.target.value,
    });
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewLibrary({
      ...newLibrary,
      country: e.target.value,
    });
    setLibraryToModify({
      ...newLibrary,
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

    setNewLibrary({
      ...newLibrary,
      phone: formattedPhone,
    });
    setLibraryToModify({
      ...newLibrary,
      phone: formattedPhone,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      if (!isValidName(newLibrary.name)) throw new Error("Invalid name");
      if (!isValidName(newLibrary.city)) throw new Error("Invalid city");
      if (!isValidName(newLibrary.streetAddress)) {
        throw new Error("Invalid streetAddress");
      }
      if (!isValidName(newLibrary.postalCode)) {
        throw new Error("Invalid postalCode");
      }
      if (!isValidName(newLibrary.country)) throw new Error("Invalid country");

      const reqOptions: RequestInit = {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newLibrary.name,
          city: newLibrary.city,
          street_address: newLibrary.streetAddress,
          postal_code: newLibrary.postalCode,
          country: newLibrary.country,
          phone: newLibrary.phone,
        }),
      };

      const url = `${process.env.REACT_APP_BACKEND}/admin/libraries`;
      const res = await fetch(url, reqOptions);

      if (!res.ok && res.status === 409) {
        setAlert({
          message: "This user already exists in the database.",
          type: "error",
        });
      } else if (!res.ok) {
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
    activeModal === "CreateLibraryModal" &&
    ReactDOM.createPortal(
      <div
        className="modal-overlay"
        onClick={handleCancelModal}>
        <form className="mx-auto mb-0 mt-6 space-y-4 rounded-lg p-4 bg-gray-50 shadow-lg shadow-gray-300/50 sm:mt-8 sm:p-6 lg:p-8">
          <p className="text-center text-lg font-medium">
            Create a new Library
          </p>

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
              className="block w-[35%] bg-red-300 rounded-lg bg-secondary py-3 text-sm font-medium text-black mx-auto"
              onClick={handleCancelModal}>
              Cancel
            </button>

            <button
              type="submit"
              className="block w-[35%] bg-green-300 rounded-lg bg-secondary py-3 text-sm font-medium text-black mx-auto"
              onClick={handleSubmit}>
              Register
            </button>
          </div>
        </form>
      </div>,
      document.getElementById("modal-root"),
    );

  return (
    <div>
      <div
        className="flex text-sm px-4 py-2 hover:text-blue-500 hover:underline cursor-pointer"
        onClick={handleModalChange}>
        Create Library
      </div>
      {modal}
    </div>
  );
};

export default CreateLibraryModal;
