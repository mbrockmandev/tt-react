import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useRecoilState, useRecoilValue } from "recoil";

import { modalAtom } from "../../../../recoil/atoms/modalAtom";
import { alertAtom } from "../../../../recoil/atoms/alertAtom";
import { selectedBookAtom } from "../../../../recoil/atoms/selectedBookAtom";
import { userAtom } from "../../../../recoil/atoms/userAtom";

import Book from "../../../../utils/models/Book";
import { formatUTCDate } from "../../../../utils/formatDate";

const UpdateBookModal = () => {
  const user = useRecoilValue(userAtom);
  const [, setAlert] = useRecoilState(alertAtom);
  const [activeModal, setActiveModal] = useRecoilState(modalAtom);
  const [selectedBook, setSelectedBook] = useRecoilState(selectedBookAtom);

  const [bookToModify, setBookToModify] = useState<Book>({
    ...selectedBook,
  });

  const handleModalChange = () => {
    setActiveModal("UpdateBookModal");
  };

  const handleIdChange = (e: any) => {
    if (e && e.target.value) {
      setBookToModify({
        ...bookToModify,
        id: e.target.value,
      });
    }
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
      setSelectedBook({
        ...selectedBook,
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
    setSelectedBook({
      ...selectedBook,
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
      setSelectedBook({
        ...selectedBook,
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
      setSelectedBook({
        ...selectedBook,
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
      setSelectedBook({
        ...selectedBook,
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
      setSelectedBook({
        ...selectedBook,
        summary,
      });
    }
  };

  const handleCancel = (e: any) => {
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
    if (!selectedBook.id && !selectedBook.isbn) {
      return;
    }

    const searchById = selectedBook.id !== 0;
    const searchByIsbn = selectedBook.isbn !== "";

    if (searchById && searchByIsbn) {
      setAlert({
        message: "Please use either ID or ISBN and leave the other blank",
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
        url = `${process.env.REACT_APP_BACKEND}/books/${selectedBook.id}`;
      } else if (searchByIsbn) {
        url = `${process.env.REACT_APP_BACKEND}/users/isbn/{isbn}${selectedBook.isbn}`;
      }
      const res = await fetch(url, reqOptions);

      if (res.ok) {
        setAlert({
          message: "Found user!",
          type: "success",
        });
      } else if (!res.ok) {
        throw new Error(
          `${selectedBook.id} -- HTTP status code: ` + res.status,
        );
      }

      const data = await res.json();

      setSelectedBook({
        ...data,
        publishedAt: formatUTCDate(data.published_at),
      });
    } catch (err) {
      setAlert({ message: err.message, type: "error" });
    }
  };

  const handleUpdate = async (e: any) => {
    e.preventDefault();
    if (!bookToModify.id) {
      return;
    }

    try {
      const reqOptions: RequestInit = {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookToModify),
      };

      const res = await fetch(
        `${process.env.REACT_APP_BACKEND}/${user.role}/books/${bookToModify.id}`,
        reqOptions,
      );

      if (res.ok) {
        setAlert({
          message: "Found user!",
          type: "success",
        });
      } else if (!res.ok) {
        throw new Error("HTTP status code: " + res.status);
      }

      const data = await res.json();

      setSelectedBook({
        ...data,
      });
    } catch (err) {
      setAlert({ message: err.message, type: "error" });
      console.error(err);
    }
  };

  const modal =
    activeModal === "UpdateBookModal" &&
    ReactDOM.createPortal(
      <div
        className="modal-overlay"
        onClick={handleOutsideClick}>
        <form className="mx-auto mb-0 mt-6 space-y-4 rounded-lg p-4 bg-gray-50 shadow-lg shadow-gray-300/50 sm:mt-8 sm:p-6 lg:p-8">
          {selectedBook.id === 0 && (
            <>
              <p className="text-center text-lg font-medium">
                Lookup User By ID
              </p>
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
                  Isbn
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
              </div>{" "}
            </>
          )}

          {selectedBook.id !== 0 && (
            <>
              <p className="text-center text-lg font-medium">Book info:</p>

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
                    value={selectedBook.title}
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
                    value={selectedBook.isbn}
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
                    value={selectedBook.author}
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
                    value={selectedBook.thumbnail}
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
                    type="datetime-local"
                    onChange={handlePublishedChange}
                    value={selectedBook.publishedAt}
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
                    value={selectedBook.summary}
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
                  onClick={handleCancel}>
                  Cancel
                </button>

                <button
                  type="submit"
                  className="block w-[35%] bg-green-300 rounded-lg bg-secondary px-5 py-3 text-sm font-medium text-black mx-auto"
                  onClick={handleUpdate}>
                  Register
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
        Update Book
      </div>
      {modal}
    </div>
  );
};

export default UpdateBookModal;
