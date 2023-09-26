import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useRecoilState } from "recoil";

import { modalAtom } from "../../../../recoil/atoms/modalAtom";
import { alertAtom } from "../../../../recoil/atoms/alertAtom";
import { selectedBookAtom } from "../../../../recoil/atoms/selectedBookAtom";
import { formatUTCDate } from "../../../../utils/formatDate";

const LookupBookModal = () => {
  const [, setAlert] = useRecoilState(alertAtom);
  const [activeModal, setActiveModal] = useRecoilState(modalAtom);
  const [, setBookToModify] = useRecoilState(selectedBookAtom);

  const [id, setId] = useState<number>(0);
  const [isbn, setIsbn] = useState<string>("");

  const handleModalChange = () => {
    setActiveModal("LookupBookModal");
  };

  const handleIdChange = (e: any) => {
    if (e && e.target.value) {
      setId(e.target.value);
    }
  };

  const handleIsbnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e && e.target.value) {
      setIsbn(e.target.value);
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
    // console.log("e:", e);
    if (e && e.target.classList.contains("submit-button")) {
      return;
    }
    if (e && e.target.classList.contains("modal-overlay")) {
      setActiveModal(null);
    }
  };

  const handleLookup = async (e: any) => {
    console.log("handleLookup? ", id, isbn);
    e.preventDefault();
    if (!id && !isbn) {
      return;
    }

    const searchById = id !== 0;
    const searchByIsbn = isbn !== "";

    if (!searchById && !searchByIsbn) {
      setAlert({
        message: "Enter an ID or ISBN",
        type: "error",
      });
    }

    try {
      const reqOptions: RequestInit = {
        method: "GET",
        credentials: "include",
      };

      var url = "";
      if (searchById) {
        url = `${process.env.REACT_APP_BACKEND}/books/${id}`;
      } else if (searchByIsbn) {
        url = `${process.env.REACT_APP_BACKEND}/books/isbn/${isbn}`;
      }

      const res = await fetch(url, reqOptions);
      setId(0);
      setIsbn("");

      if (res.ok) {
        setAlert({
          message: "Found book!",
          type: "success",
        });
      } else if (!res.ok) {
        console.log("!res.ok:", id, isbn, searchById, searchByIsbn);
        throw new Error(`HTTP status code: ` + res.status);
      }

      const data = await res.json();

      setBookToModify({
        id: data.book.id,
        title: data.book.title,
        isbn: data.book.isbn,
        author: data.book.author,
        summary: data.book.summary,
        thumbnail: data.book.thumbnail,
        publishedAt: formatUTCDate(data.book.published_at),
        createdAt: formatUTCDate(data.book.created_at),
        updatedAt: formatUTCDate(data.book.updated_at),
        metadata: data.metadata,
      });
    } catch (err) {
      setAlert({ message: err.message, type: "error" });
      console.error(err);
      if (err !== "") {
        return;
      }
    }
  };

  const modal =
    activeModal === "LookupBookModal" &&
    ReactDOM.createPortal(
      <div
        className="modal-overlay"
        onClick={handleOutsideClick}>
        <form className="mx-auto mb-0 mt-6 space-y-4 rounded-lg p-4 bg-gray-50 shadow-lg shadow-gray-300/50 sm:mt-8 sm:p-6 lg:p-8">
          <p className="text-center text-lg font-medium">Lookup Book By ID</p>

          <div className="flex items-center gap-x-2">
            <label
              htmlFor="id"
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
              htmlFor="isbn"
              className="mr-auto">
              ISBN
            </label>

            <div className="relative">
              <input
                id="isbn"
                type="text"
                onChange={handleIsbnChange}
                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm focus:ring-gray-200 focus:border-gray-400 active:border-gray-200"
                placeholder="1234567890123"
                autoComplete="isbn"
              />
            </div>
          </div>
          <div className="flex">
            <button
              type="submit"
              className="cancel-button block w-[35%] bg-gray-300 rounded-lg bg-secondary px-5 py-3 text-sm font-medium text-black mx-auto"
              onClick={handleCancel}>
              Cancel
            </button>

            <button
              type="submit"
              className="submit-button block w-[35%] bg-green-300 rounded-lg bg-secondary px-5 py-3 text-sm font-medium text-black mx-auto"
              onClick={handleLookup}>
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
        onClick={handleModalChange}>
        Lookup Book
      </div>
      {modal}
    </div>
  );
};

export default LookupBookModal;
