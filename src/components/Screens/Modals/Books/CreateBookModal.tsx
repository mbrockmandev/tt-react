import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useRecoilState } from "recoil";

import { modalAtom } from "../../../../recoil/atoms/modalAtom";
import { alertAtom } from "../../../../recoil/atoms/alertAtom";

import Book, { emptyBook } from "../../../../utils/models/Book";
import { formatUTCDate } from "../../../../utils/formatDate";

const CreateBookModal = () => {
  const [activeModal, setActiveModal] = useRecoilState(modalAtom);
  const [, setAlert] = useRecoilState(alertAtom);
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
    if (!e) {
      setAlert({
        message: "uh oh, something went wrong",
        type: "error",
      });
      return;
    }

    const title = e.target.value;
    if (title === "") {
      setAlert({
        message: "Title cannot be blank",
        type: "error",
      });

      if (title.length < 3 || title.length > 255) {
        setAlert({
          message: "Title must be between 3 and 255 characters long.",
          type: "error",
        });
      }
      setNewBook({
        ...newBook,
        title,
      });
    }
  };

  const handleIsbnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e) {
      setAlert({
        message: "uh oh, something went wrong",
        type: "error",
      });
      return;
    }
    const isbn = e.target.value;

    if (isbn.length !== 13) {
      setAlert({
        message: "ISBN must be 13 digits.",
        type: "error",
      });
    }
    setNewBook({
      ...newBook,
      isbn,
    });
  };

  const handleAuthorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e) {
      setAlert({
        message: "uh oh, something went wrong",
        type: "error",
      });
      return;
    }
    const author = e.target.value;
    if (author === "") {
      setAlert({
        message: "Author cannot be blank",
        type: "error",
      });

      if (author.length < 3 || author.length > 255) {
        setAlert({
          message: "Author must be between 3 and 255 characters long.",
          type: "error",
        });
      }
      setNewBook({
        ...newBook,
        author,
      });
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e) {
      setAlert({
        message: "uh oh, something went wrong",
        type: "error",
      });
      return;
    }
    const thumbnail = e.target.value;

    if (thumbnail === "") {
      setAlert({
        message: "Title cannot be blank",
        type: "error",
      });

      if (thumbnail.length < 3 || thumbnail.length > 255) {
        setAlert({
          message: "Title must be between 3 and 255 characters long.",
          type: "error",
        });
      }
      setNewBook({
        ...newBook,
        thumbnail,
      });
    }
  };

  const handlePublishedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e) {
      setAlert({
        message: "uh oh, something went wrong",
        type: "error",
      });
      return;
    }
    const publishedAt = formatUTCDate(e.target.value);

    if (publishedAt === "") {
      setAlert({
        message: "Title cannot be blank",
        type: "error",
      });

      if (publishedAt.length < 3 || publishedAt.length > 255) {
        setAlert({
          message: "Title must be between 3 and 255 characters long.",
          type: "error",
        });
      }
      setNewBook({
        ...newBook,
        publishedAt,
      });
    }
  };
  const handleSummaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!e) {
      setAlert({
        message: "uh oh, something went wrong",
        type: "error",
      });
      return;
    }
    const summary = e.target.value;
    if (summary === "") {
      setAlert({
        message: "Summary cannot be blank",
        type: "error",
      });

      if (summary.length < 3 || summary.length > 2048) {
        setAlert({
          message: "Title must be between 3 and 2048 characters long.",
          type: "error",
        });
      }
      setNewBook({
        ...newBook,
        summary,
      });
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const reqOptions: RequestInit = {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newBook,
        }),
      };

      const res = await fetch(
        `${process.env.REACT_APP_BACKEND}/register`,
        reqOptions,
      );

      if (!res.ok && res.status === 409) {
        setAlert({
          message: "This book already exists in the database.",
          type: "error",
        });
      } else if (!res.ok) {
        throw new Error("HTTP status code: " + res.status);
      }

      const data = await res.json();

      setAlert({ message: data.message, type: "success" });
      setActiveModal(null);
    } catch (err) {
      setAlert({ message: err.message, type: "error" });
      console.error(err);
      if (err !== "") {
        return;
      }
    }
  };

  const modal =
    activeModal === "CreateBookModal" &&
    ReactDOM.createPortal(
      <div
        className="modal-overlay"
        onClick={handleCancelModal}>
        <form className="mx-auto mb-0 mt-6 space-y-4 rounded-lg p-4 bg-gray-50 shadow-lg shadow-gray-300/50 sm:mt-8 sm:p-6 lg:p-8">
          <p className="text-center text-lg font-medium">Register a new book</p>

          <div>
            <label
              htmlFor="title"
              className="sr-only">
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
            <label
              htmlFor="isbn"
              className="sr-only">
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
            <label
              htmlFor="title"
              className="sr-only">
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
            <label
              htmlFor="thumbnail"
              className="sr-only">
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
            <label
              htmlFor="published"
              className="sr-only">
              Published
            </label>

            <div className="relative">
              <input
                id="published"
                type="text"
                onChange={handlePublishedChange}
                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm focus:ring-gray-200 focus:border-gray-400 active:border-gray-200"
                placeholder="Published"
                autoComplete="published"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="summary"
              className="sr-only">
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
              className="cancel-button block w-[35%] bg-red-300 rounded-lg bg-secondary px-5 py-3 text-sm font-medium text-black mx-auto"
              onClick={handleCancelModal}>
              Cancel
            </button>

            <button
              type="submit"
              className="block w-[35%] bg-green-300 rounded-lg bg-secondary px-5 py-3 text-sm font-medium text-black mx-auto"
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
        Create Book
      </div>
      {modal}
    </div>
  );
};

export default CreateBookModal;
