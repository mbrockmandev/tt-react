import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useRecoilState, useRecoilValue } from "recoil";

import { alertQueueAtom } from "../../../../recoil/atoms/alertAtom";
import { selectedLibraryAtom } from "../../../../recoil/atoms/selectedLibraryAtom";
import { modalAtom } from "../../../../recoil/atoms/modalAtom";
import { userAtom } from "../../../../recoil/atoms/userAtom";

import Library, { emptyLibrary } from "../../../../utils/models/Library";

import { isValidName } from "../../../../utils/validators";

const UpdateLibraryModal = () => {
  const user = useRecoilValue(userAtom);
  const [selectedLibrary, setSelectedLibrary] =
    useRecoilState(selectedLibraryAtom);

  const [activeModal, setActiveModal] = useRecoilState(modalAtom);
  const [, setAlert] = useRecoilState(alertQueueAtom);

  const [libraryToModify, setLibraryToModify] = useState<Library>(emptyLibrary);

  const getDiffPayload = () => {
    let payload = {
      name: undefined,
      city: undefined,
      street_address: undefined,
      postal_code: undefined,
      country: undefined,
      phone: undefined,
    };

    if (libraryToModify.name !== selectedLibrary.name && libraryToModify.name) {
      payload.name = libraryToModify.name;
    }
    if (libraryToModify.city !== selectedLibrary.city && libraryToModify.city) {
      payload.city = libraryToModify.city;
    }
    if (
      libraryToModify.streetAddress !== selectedLibrary.streetAddress &&
      libraryToModify.streetAddress
    ) {
      payload.street_address = libraryToModify.streetAddress;
    }
    if (
      libraryToModify.postalCode !== selectedLibrary.postalCode &&
      libraryToModify.postalCode
    ) {
      payload.postal_code = libraryToModify.postalCode;
    }
    if (
      libraryToModify.country !== selectedLibrary.country &&
      libraryToModify.country
    ) {
      payload.country = libraryToModify.country;
    }
    if (
      libraryToModify.phone !== selectedLibrary.phone &&
      libraryToModify.phone
    ) {
      payload.phone = libraryToModify.phone;
    }

    return payload;
  };

  const updateSelectedBookAfterSuccessfulUpdate = (payload: any) => {
    let updatedLibrary = { ...selectedLibrary };
    for (let key in payload) {
      if (payload[key] && payload[key] !== "") {
        let newKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
        updatedLibrary[newKey] = payload[key];
      }
    }
    setSelectedLibrary(updatedLibrary);
  };

  useEffect(() => {
    setLibraryToModify(selectedLibrary);
  }, [selectedLibrary]);

  const handleCancelModal = (e: any) => {
    if (e && e.target.classList.contains("modal-overlay")) {
      setActiveModal(null);
    }

    if (e && e.target.classList.contains("cancel-button")) {
      setActiveModal(null);
    }
  };

  const handleModalChange = () => {
    if (selectedLibrary.id !== 0) setActiveModal("UpdateLibraryModal");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLibraryToModify({
      ...libraryToModify,
      name: e.target.value,
    });
    if (!isValidName(libraryToModify.name) && libraryToModify.name.length > 0)
      setAlert((prev) => [
        ...prev,
        {
          message:
            "Invalid Name. Name must be between 3 and 255 characters long.",
          type: "error",
        },
      ]);
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLibraryToModify({
      ...libraryToModify,
      city: e.target.value,
    });
    if (!isValidName(libraryToModify.city)) {
      setAlert((prev) => [
        ...prev,
        {
          message:
            "Invalid City. City must be between 3 and 255 characters long.",
          type: "error",
        },
      ]);
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLibraryToModify({
      ...libraryToModify,
      streetAddress: e.target.value,
    });
    if (!isValidName(libraryToModify.streetAddress)) {
      setAlert((prev) => [
        ...prev,
        {
          message:
            "Invalid Street Address. Street Address must be between 3 and 255 characters long.",
          type: "error",
        },
      ]);
    }
  };

  const handlePostalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLibraryToModify({
      ...libraryToModify,
      postalCode: e.target.value,
    });
    if (!isValidName(libraryToModify.postalCode)) {
      setAlert((prev) => [
        ...prev,
        {
          message:
            "Invalid Postal Code. Postal Code must be between 3 and 255 characters long.",
          type: "error",
        },
      ]);
    }
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLibraryToModify({
      ...libraryToModify,
      country: e.target.value,
    });
    if (!isValidName(libraryToModify.country)) {
      setAlert((prev) => [
        ...prev,
        {
          message:
            "Invalid Country. Country must be between 3 and 255 characters long.",
          type: "error",
        },
      ]);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericPhone = e.target.value.replace(/\D/g, "");

    const formattedPhone = numericPhone.startsWith("+")
      ? numericPhone
      : "+" + numericPhone;
    setLibraryToModify({
      ...libraryToModify,
      phone: formattedPhone,
    });

    if (formattedPhone.length !== 11) {
      setAlert((prev) => [
        ...prev,
        {
          message:
            "Invalid phone number. Phone numbers must be 10 digits long.",
          type: "error",
        },
      ]);
    }
  };

  const handleUpdate = async (e: any) => {
    e.preventDefault();

    try {
      const payload = getDiffPayload();

      if (Object.keys(payload).length === 0) {
        setAlert((prev) => [
          ...prev,
          { message: "No changes made", type: "info" },
        ]);
        return;
      }

      const reqOptions: RequestInit = {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      };

      const url = `${process.env.REACT_APP_BACKEND}/${user.role}/libraries/${selectedLibrary.id}`;
      const res = await fetch(url, reqOptions);

      if (!res.ok) {
        throw new Error("HTTP status code: " + res.status);
      }

      const data = await res.json();

      setAlert((prev) => [...prev, { message: data.message, type: "success" }]);
      updateSelectedBookAfterSuccessfulUpdate(payload);
      setActiveModal(null);
    } catch (err) {
      setAlert((prev) => [...prev, { message: err.message, type: "error" }]);
    }
  };

  const modal =
    activeModal === "UpdateLibraryModal" &&
    ReactDOM.createPortal(
      <div className="modal-overlay" onClick={handleCancelModal}>
        <form
          className="mx-auto mb-0 mt-6 space-y-4 rounded-lg p-4 bg-gray-50 shadow-lg shadow-gray-300/50 sm:mt-8 sm:p-6 lg:p-8"
          onSubmit={handleUpdate}
        >
          {selectedLibrary.id !== 0 && (
            <>
              <p className="text-center text-lg font-medium">Update Library</p>

              {/* Name */}
              <div>
                <label htmlFor="name" className="mr-auto">
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
                <label htmlFor="city" className="mr-auto">
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
                <label htmlFor="streetAddress" className="mr-auto">
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
                <label htmlFor="postalCode" className="mr-auto">
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
                <label htmlFor="country" className="mr-auto">
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
                <label htmlFor="phone" className="mr-auto">
                  Phone
                </label>

                <div className="relative">
                  <input
                    id="phone"
                    type="tel"
                    pattern="\+?[0-9]{10}"
                    onChange={handlePhoneChange}
                    value={libraryToModify.phone}
                    className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm focus:ring-gray-200 focus:border-gray-400 active:border-gray-200"
                    placeholder="+1234567890"
                    autoComplete="phone"
                    required
                  />
                </div>
              </div>

              <div className="flex">
                <button
                  type="submit"
                  className="cancel-button block w-[35%] bg-red-300 rounded-lg bg-secondary px-5 py-3 text-sm font-medium text-black mx-auto"
                  onClick={handleCancelModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="block w-[35%] bg-green-300 rounded-lg bg-secondary px-5 py-3 text-sm font-medium text-black mx-auto"
                >
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
        onClick={selectedLibrary ? handleModalChange : undefined}
      >
        Update Library
      </div>
      {modal}
    </div>
  );
};

export default UpdateLibraryModal;
