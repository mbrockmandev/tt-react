import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useRecoilState, useRecoilValue } from "recoil";

import { modalAtom } from "../../../../recoil/atoms/modalAtom";
import { alertAtom } from "../../../../recoil/atoms/alertAtom";
import { selectedBookAtom } from "../../../../recoil/atoms/selectedBookAtom";
import { userAtom } from "../../../../recoil/atoms/userAtom";

import Book, { emptyBook } from "../../../../utils/models/Book";
import { formatUTCDate } from "../../../../utils/formatDate";

const UpdateBookModal = () => {
  const user = useRecoilValue(userAtom);
  const [selectedBook, setSelectedBook] = useRecoilState(selectedBookAtom);

  const [, setAlert] = useRecoilState(alertAtom);
  const [activeModal, setActiveModal] = useRecoilState(modalAtom);

  const [bookToModify, setBookToModify] = useState<Book>(emptyBook);

  const getDiffPayload = () => {
    let payload = {
      title: undefined,
      author: undefined,
      isbn: undefined,
      summary: undefined,
      thumbnail: undefined,
      published_at: undefined,
    };

    if (bookToModify.title !== selectedBook.title) {
      payload.title = bookToModify.title;
    }
    if (bookToModify.author !== selectedBook.author) {
      payload.author = bookToModify.author;
    }
    if (bookToModify.isbn !== selectedBook.isbn) {
      payload.isbn = bookToModify.isbn;
    }
    if (bookToModify.summary !== selectedBook.summary) {
      payload.summary = bookToModify.summary;
    }
    if (bookToModify.thumbnail !== selectedBook.thumbnail) {
      payload.thumbnail = bookToModify.thumbnail;
    }
    if (bookToModify.publishedAt !== selectedBook.publishedAt) {
      payload.published_at = bookToModify.publishedAt;
    }

    return Object.fromEntries(
      Object.entries(payload).filter(([k, v]) => v !== undefined),
    );
  };

  const updateSelectedBookAfterSuccessfulUpdate = (payload: any) => {
    let updatedBook = { ...selectedBook };
    for (let key in payload) {
      if (payload[key] && payload[key] !== "") {
        let newKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
        updatedBook[newKey] = payload[key];
      }
    }
    setSelectedBook(updatedBook);
  };

  useEffect(() => {
    setBookToModify(selectedBook);
  }, [selectedBook]);

  const handleModalChange = () => {
    if (selectedBook.id !== 0) setActiveModal("UpdateBookModal");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;

    setBookToModify({
      ...bookToModify,
      title,
    });

    if (title === "") {
      setAlert({
        message: "Title cannot be blank",
        type: "error",
      });
    } else if (title.length < 3 || title.length > 255) {
      setAlert({
        message: "Title must be between 3 and 255 characters long.",
        type: "error",
      });
    }
  };

  const handleIsbnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isbn = e.target.value;
    setBookToModify({
      ...bookToModify,
      isbn,
    });

    if (isbn.length !== 13) {
      setAlert({
        message: "ISBN must be 13 digits.",
        type: "error",
      });
    }
  };

  const handleAuthorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const author = e.target.value;
    setBookToModify({
      ...bookToModify,
      author,
    });

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
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const thumbnail = e.target.value;
    setBookToModify({
      ...bookToModify,
      thumbnail,
    });

    if (thumbnail === "") {
      setAlert({
        message: "Thumbnail cannot be blank",
        type: "error",
      });

      if (thumbnail.length < 3 || thumbnail.length > 255) {
        setAlert({
          message: "Thumbnail must be between 3 and 255 characters long.",
          type: "error",
        });
      }
    }
  };

  const handlePublishedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const publishedAt = e.target.value
      ? formatUTCDate(e.target.value)
      : undefined;
    setBookToModify({
      ...bookToModify,
      publishedAt,
    });

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
    }
  };
  const handleSummaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const summary = e.target.value;
    setBookToModify({
      ...bookToModify,
      summary,
    });

    if (summary === "") {
      setAlert({
        message: "Summary cannot be blank",
        type: "error",
      });

      if (summary.length < 3 || summary.length > 2048) {
        setAlert({
          message: "Summary must be between 3 and 2048 characters long.",
          type: "error",
        });
      }
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

  const handleUpdate = async (e: any) => {
    e.preventDefault();

    try {
      const payload = getDiffPayload();

      if (Object.keys(payload).length === 0) {
        setAlert({ message: "No changes made", type: "info" });
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

      const url = `${process.env.REACT_APP_BACKEND}/${user.role}/books/${selectedBook.id}`;
      const res = await fetch(url, reqOptions);

      if (!res.ok) {
        throw new Error("HTTP status code: " + res.status);
      }

      const data = await res.json();

      setAlert({ message: data.message, type: "success" });
      updateSelectedBookAfterSuccessfulUpdate(payload);
      setActiveModal(null);
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
        <form
          className="mx-auto mb-0 mt-6 space-y-4 rounded-lg p-4 bg-gray-50 shadow-lg shadow-gray-300/50 sm:mt-8 sm:p-6 lg:p-8"
          onSubmit={handleUpdate}>
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
                    value={bookToModify.title}
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
                    value={bookToModify.isbn}
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
                    value={bookToModify.author}
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
                    value={bookToModify.thumbnail}
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
                    value={bookToModify.publishedAt}
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
                    value={bookToModify.summary}
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
                  className="block w-[35%] bg-green-300 rounded-lg bg-secondary px-5 py-3 mx-2 text-sm font-medium text-black mx-auto">
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
        onClick={selectedBook ? handleModalChange : undefined}>
        Update Book
      </div>
      {modal}
    </div>
  );
};

export default UpdateBookModal;
