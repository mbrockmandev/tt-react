import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useRecoilState } from "recoil";

import { modalAtom } from "../../../../recoil/atoms/modalAtom";
import { alertQueueAtom } from "../../../../recoil/atoms/alertAtom";
import { emptyLibrary } from "../../../../utils/models/Library";
import { selectedLibraryAtom } from "../../../../recoil/atoms/selectedLibraryAtom";

const DeleteLibraryModal = () => {
  const [id, setId] = useState(0);
  const [activeModal, setActiveModal] = useRecoilState(modalAtom);
  const [, setAlert] = useRecoilState(alertQueueAtom);
  const [, setSelectedLibrary] = useRecoilState(selectedLibraryAtom);

  const handleIdChange = (e: any) => {
    if (e.target.value) {
      setId(+e.target.value);
    }
  };

  const handleCancel = (e: any) => {
    if (e && e.target.classList.contains("modal-overlay")) {
      setId(0);
      setActiveModal(null);
    }

    if (e && e.target.classList.contains("cancel-button")) {
      setId(0);
      setActiveModal(null);
    }
  };

  const handleModalChange = () => {
    setActiveModal("DeleteLibraryModal");
  };

  const handleDelete = async (e: any) => {
    e.preventDefault();

    try {
      if (typeof id !== "number") {
        setAlert((prev) => [
          ...prev,
          {
            message: "invalid id",
            type: "error",
          },
        ]);
        return;
      }

      const reqOptions: RequestInit = {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      };

      const url = `${process.env.REACT_APP_BACKEND}/admin/libraries/${id}`;
      const res = await fetch(url, reqOptions);

      if (res.ok) {
        setActiveModal(null);

        setAlert((prev) => [
          ...prev,
          {
            message: "Deleted library from database.",
            type: "success",
          },
        ]);
        setActiveModal(null);
      } else if (!res.ok) {
        throw new Error("HTTP status code: " + res.status);
      }

      const data = await res.json();

      setAlert((prev) => [...prev, { message: data.message, type: "success" }]);
      setActiveModal(null);
      setSelectedLibrary(emptyLibrary);
    } catch (err) {
      setAlert((prev) => [...prev, { message: err.message, type: "error" }]);
      setActiveModal(null);
    }
  };

  const modal =
    activeModal === "DeleteLibraryModal" &&
    ReactDOM.createPortal(
      <div className="modal-overlay" onClick={handleCancel}>
        <form
          className="mx-auto mb-0 mt-6 space-y-4 rounded-lg p-4 bg-gray-50 shadow-lg shadow-gray-300/50 sm:mt-8 sm:p-6 lg:p-8"
          onSubmit={handleDelete}
        >
          <p className="text-center text-lg font-medium">
            Delete Library By ID
          </p>

          <div>
            <label htmlFor="email" className="sr-only">
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
          <div className="flex">
            <button
              type="button"
              className="cancel-button block w-[35%] bg-gray-300 rounded-lg bg-secondary px-5 py-3 text-sm font-medium text-black mx-auto"
              onClick={handleCancel}
            >
              Cancel
            </button>

            <button
              type="button"
              className="block w-[35%] bg-red-300 rounded-lg bg-secondary px-5 py-3 text-sm font-medium text-black mx-auto"
              onClick={handleDelete}
            >
              Delete
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
        Delete Library
      </div>
      {modal}
    </div>
  );
};

export default DeleteLibraryModal;
