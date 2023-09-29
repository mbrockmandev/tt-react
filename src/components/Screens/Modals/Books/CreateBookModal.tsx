import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useRecoilState } from "recoil";

import { modalAtom } from "../../../../recoil/atoms/modalAtom";
import { alertQueueAtom } from "../../../../recoil/atoms/alertAtom";

import Book, { emptyBook } from "../../../../utils/models/Book";

const CreateBookModal = () => {
  const [activeModal, setActiveModal] = useRecoilState(modalAtom);
  const [, setAlert] = useRecoilState(alertQueueAtom);
  const [newBook, setNewBook] = useState<Book>(emptyBook);

  const handleCancelModal = (e: any) => {
    if (e && e.target.classList.contains("modal-overlay")) {
      setNewBook(emptyBook);
      setActiveModal(null);
    }

    if (e && e.target.classList.contains("cancel-button")) {
      setNewBook(emptyBook);
      setActiveModal(null);
    }
  };

  const handleModalChange = () => {
    setActiveModal("CreateBookModal");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setNewBook({
      ...newBook,
      title,
    });

    if (title === "") {
      setAlert((prev) => [
        ...prev,
        {
          message: "Title cannot be blank",
          type: "error",
        },
      ]);

      if (title.length < 3 || title.length > 255) {
        setAlert((prev) => [
          ...prev,
          {
            message: "Title must be between 3 and 255 characters long.",
            type: "error",
          },
        ]);
      }
    }
  };

  const handleIsbnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isbn = e.target.value;
    setNewBook({
      ...newBook,
      isbn,
    });

    if (isbn.length !== 13) {
      setAlert((prev) => [
        ...prev,
        {
          message: "ISBN must be 13 digits.",
          type: "error",
        },
      ]);
    }
  };

  const handleAuthorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const author = e.target.value;
    setNewBook({
      ...newBook,
      author,
    });

    if (author === "") {
      setAlert((prev) => [
        ...prev,
        {
          message: "Author cannot be blank",
          type: "error",
        },
      ]);

      if (author.length < 3 || author.length > 255) {
        setAlert((prev) => [
          ...prev,
          {
            message: "Author must be between 3 and 255 characters long.",
            type: "error",
          },
        ]);
      }
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const thumbnail = e.target.value;
    setNewBook({
      ...newBook,
      thumbnail,
    });

    if (thumbnail === "") {
      setAlert((prev) => [
        ...prev,
        {
          message: "Title cannot be blank",
          type: "error",
        },
      ]);

      if (thumbnail.length < 3 || thumbnail.length > 255) {
        setAlert((prev) => [
          ...prev,
          {
            message: "Title must be between 3 and 255 characters long.",
            type: "error",
          },
        ]);
      }
    }
  };

  const handleSummaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const summary = e.target.value;

    setNewBook({
      ...newBook,
      summary,
    });

    if (summary === "") {
      setAlert((prev) => [
        ...prev,
        {
          message: "Summary cannot be blank",
          type: "error",
        },
      ]);

      if (summary.length < 3 || summary.length > 2048) {
        setAlert((prev) => [
          ...prev,
          {
            message: "Title must be between 3 and 2048 characters long.",
            type: "error",
          },
        ]);
      }
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      // ISO string without milliseconds
      const currentDateISOString = new Date().toISOString().slice(0, 19) + "Z";

      const reqOptions: RequestInit = {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newBook.title,
          author: newBook.author,
          isbn: newBook.isbn,
          published_at: currentDateISOString,
          summary: newBook.summary,
          thumbnail: newBook.thumbnail,
        }),
      };

      const url = `${process.env.REACT_APP_BACKEND}/admin/books`;
      const res = await fetch(url, reqOptions);

      if (!res.ok && res.status === 409) {
        setAlert((prev) => [
          ...prev,
          {
            message: "This book already exists in the database.",
            type: "error",
          },
        ]);
      } else if (!res.ok) {
        throw new Error("HTTP status code: " + res.status);
      }

      const data = await res.json();

      setAlert((prev) => [...prev, { message: data.message, type: "success" }]);
      setActiveModal(null);
    } catch (err) {
      setAlert((prev) => [...prev, { message: err.message, type: "error" }]);
    }
  };

  const modal =
    activeModal === "CreateBookModal" &&
    ReactDOM.createPortal(
      <div className="modal-overlay" onClick={handleCancelModal}>
        <form
          className="mx-auto mb-0 mt-6 space-y-4 rounded-lg p-4 bg-gray-50 shadow-lg shadow-gray-300/50 sm:mt-8 sm:p-6 lg:p-8"
          onSubmit={handleSubmit}
        >
          <p className="text-center text-lg font-medium">Register a new book</p>

          <div>
            <label htmlFor="title" className="sr-only">
              Title
            </label>

            <div className="relative">
              <input
                id="title"
                type="text"
                onChange={handleTitleChange}
                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm focus:ring-gray-200 focus:border-gray-400 active:border-gray-200"
                placeholder="Title"
                autoComplete="title"
              />
            </div>
          </div>

          <div>
            <label htmlFor="isbn" className="sr-only">
              ISBN
            </label>

            <div className="relative">
              <input
                id="isbn"
                type="text"
                onChange={handleIsbnChange}
                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm focus:ring-gray-200 focus:border-gray-400 active:border-gray-200"
                placeholder="ISBN"
                autoComplete="isbn"
              />
            </div>
          </div>

          <div>
            <label htmlFor="title" className="sr-only">
              Author
            </label>

            <div className="relative">
              <input
                id="author"
                type="text"
                onChange={handleAuthorChange}
                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm focus:ring-gray-200 focus:border-gray-400 active:border-gray-200"
                placeholder="Author"
                autoComplete="author"
              />
            </div>
          </div>

          <div>
            <label htmlFor="thumbnail" className="sr-only">
              Thumbnail URL
            </label>

            <div className="relative">
              <input
                id="thumbnail"
                type="text"
                onChange={handleThumbnailChange}
                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm focus:ring-gray-200 focus:border-gray-400 active:border-gray-200"
                placeholder="Thumbnail URL"
                autoComplete="thumbnail"
              />
            </div>
          </div>

          <div>
            <label htmlFor="summary" className="sr-only">
              Summary
            </label>

            <div className="relative">
              <textarea
                id="summary"
                onChange={handleSummaryChange}
                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm focus:ring-gray-200 focus:border-gray-400 active:border-gray-200"
                placeholder="Summary"
                autoComplete="summary"
              />
            </div>
          </div>

          <div className="flex">
            <button
              type="submit"
              className="cancel-button block w-[35%] bg-red-300 rounded-lg bg-secondary py-3 text-sm font-medium text-black mx-auto"
              onClick={handleCancelModal}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="block w-[35%] bg-green-300 rounded-lg bg-secondary py-3 text-sm font-medium text-black mx-auto"
            >
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
        onClick={handleModalChange}
      >
        Create Book
      </div>
      {modal}
    </div>
  );
};

export default CreateBookModal;
