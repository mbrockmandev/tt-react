import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useRecoilState } from "recoil";

import { modalAtom } from "../../../../recoil/atoms/modalAtom";
import { alertAtom } from "../../../../recoil/atoms/alertAtom";

import { selectedBookAtom } from "../../../../recoil/atoms/selectedBookAtom";
import { emptyBook } from "../../../../utils/models/Book";

const DeleteBookModal = () => {
  const [id, setId] = useState(0);
  const [activeModal, setActiveModal] = useRecoilState(modalAtom);
  const [, setAlert] = useRecoilState(alertAtom);
  const [, setBookToModify] = useRecoilState(selectedBookAtom);

  const handleIdChange = (e: any) => {
    if (e.target.value) {
      setId(+e.target.value);
    }
  };

  const handleCancel = (e: any) => {
    if (e && e.target.classList.contains("modal-overlay")) {
      setActiveModal(null);
    }

    if (e && e.target.classList.contains("cancel-button")) {
      setActiveModal(null);
    }
  };

  const handleModalChange = () => {
    setActiveModal("DeleteBookModal");
  };

  const handleDelete = async (e: any) => {
    e.preventDefault();

    try {
      if (typeof id !== "number") {
        setAlert({
          message: "invalid id",
          type: "error",
        });
        return;
      }

      const reqOptions: RequestInit = {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      };

      const res = await fetch(
        `${process.env.REACT_APP_BACKEND}/admin/books/${id}`,
        reqOptions,
      );

      if (!res.ok) {
        throw new Error("HTTP status code: " + res.status);
      }

      const data = await res.json();

      setAlert({ message: data.message, type: "success" });
      setBookToModify(emptyBook);
      setActiveModal(null);
    } catch (err) {
      setAlert({ message: err.message, type: "error" });
      setActiveModal(null);

      console.error(err);
      if (err !== "") {
        return;
      }
    }
  };

  const modal =
    activeModal === "DeleteBookModal" &&
    ReactDOM.createPortal(
      <div
        className="modal-overlay"
        onClick={handleCancel}>
        <form className="mx-auto mb-0 mt-6 space-y-4 rounded-lg p-4 bg-gray-50 shadow-lg shadow-gray-300/50 sm:mt-8 sm:p-6 lg:p-8">
          <p className="text-center text-lg font-medium">Delete Book By ID</p>

          <div>
            <label
              htmlFor="id"
              className="sr-only">
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
              onClick={handleCancel}>
              Cancel
            </button>

            <button
              type="button"
              className="block w-[35%] bg-red-300 rounded-lg bg-secondary px-5 py-3 text-sm font-medium text-black mx-auto"
              onClick={handleDelete}>
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
        onClick={handleModalChange}>
        Delete Book
      </div>
      {modal}
    </div>
  );
};

export default DeleteBookModal;