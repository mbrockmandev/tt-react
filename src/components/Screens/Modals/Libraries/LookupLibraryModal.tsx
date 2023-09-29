import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useRecoilState } from "recoil";

import { modalAtom } from "../../../../recoil/atoms/modalAtom";
import { alertQueueAtom } from "../../../../recoil/atoms/alertAtom";
import { selectedLibraryAtom } from "../../../../recoil/atoms/selectedLibraryAtom";
import { emptyLibrary } from "../../../../utils/models/Library";

const LookupLibraryModal = () => {
  const [, setAlert] = useRecoilState(alertQueueAtom);
  const [activeModal, setActiveModal] = useRecoilState(modalAtom);
  const [, setSelectedLibrary] = useRecoilState(selectedLibraryAtom);
  const [id, setId] = useState<number>(null);
  const [name, setName] = useState<string>("");

  const handleModalChange = () => {
    setActiveModal("LookupLibraryModal");
  };

  const handleIdChange = (e: any) => {
    if (e && e.target.value) {
      setId(e.target.value);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e && e.target.value) {
      setName(e.target.value);
    }
  };

  const handleCancel = (e: any) => {
    if (e && e.target.classList.contains("submit-button")) {
      return;
    }

    if (e && e.target.classList.contains("cancel-button")) {
      setActiveModal(null);
    }
  };

  const handleOutsideClick = (e: any) => {
    if (e && e.target.classList.contains("submit-button")) {
      return;
    }
    if (e && e.target.classList.contains("modal-overlay")) {
      setActiveModal(null);
    }
  };

  const handleLookup = async (e: any) => {
    e.preventDefault();
    console.error("id:", id, "name:", name);

    if (!id && !name) {
      return;
    }

    if (id === 0 && name === "") {
      setAlert((prev) => [
        ...prev,
        {
          message: "Please enter an ID or name",
          type: "error",
        },
      ]);
      return;
    } else if (id !== 0 && name !== "") {
      console.error("id:", id, "name:", name);
      setAlert((prev) => [
        ...prev,
        {
          message: "Please search by either ID or name",
          type: "error",
        },
      ]);
      return;
    }

    try {
      const reqOptions: RequestInit = {
        method: "GET",
        credentials: "include",
      };

      let url = "";
      if (id !== 0) {
        url = `${process.env.REACT_APP_BACKEND}/staff/libraries/${id}`;
      } else if (name !== "") {
        url = `${process.env.REACT_APP_BACKEND}/staff/libraries?name=${name}`;
      }

      setSelectedLibrary(emptyLibrary);
      const res = await fetch(url, reqOptions);

      if (res.ok) {
        setAlert((prev) => [
          ...prev,
          {
            message: "Found library!",
            type: "success",
          },
        ]);
      } else if (!res.ok) {
        throw new Error(`HTTP status code: ` + res.status);
      }

      const data = await res.json();

      setSelectedLibrary({
        ...data,
        streetAddress: data.street_address,
        postalCode: data.postal_code,
      });
      setActiveModal(null);
    } catch (err) {
      setAlert((prev) => [
        ...prev,
        { message: "Library not found", type: "error" },
      ]);
    }
  };

  const modal =
    activeModal === "LookupLibraryModal" &&
    ReactDOM.createPortal(
      <div className="modal-overlay" onClick={handleOutsideClick}>
        <form
          className="mx-auto mb-0 mt-6 space-y-4 rounded-lg p-4 bg-gray-50 shadow-lg shadow-gray-300/50 sm:mt-8 sm:p-6 lg:p-8"
          onSubmit={handleLookup}
        >
          <p className="text-center text-lg font-medium">
            Lookup Library (ID or Name)
          </p>

          <div className="flex items-center gap-x-2">
            <label htmlFor="email" className="mr-auto">
              ID
            </label>

            <div className="relative">
              <input
                id="id"
                type="number"
                onChange={handleIdChange}
                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm focus:ring-gray-200 focus:border-gray-400 active:border-gray-200"
                placeholder="id"
              />
            </div>
          </div>
          <div className="flex items-center gap-x-2">
            <label htmlFor="name" className="mr-auto">
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
              />
            </div>
          </div>
          <div className="flex">
            <button
              type="submit"
              className="cancel-button block w-[35%] bg-gray-300 rounded-lg bg-secondary px-5 py-3 text-sm font-medium text-black mx-auto"
              onClick={handleCancel}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="submit-button block w-[35%] bg-green-300 rounded-lg bg-secondary px-5 py-3 text-sm font-medium text-black mx-auto"
            >
              Lookup
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
        onClick={handleModalChange}
      >
        Lookup Library
      </div>
      {modal}
    </div>
  );
};

export default LookupLibraryModal;
