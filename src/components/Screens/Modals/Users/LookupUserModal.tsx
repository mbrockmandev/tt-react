import React, { useState } from "react";
import ReactDOM from "react-dom";

import { useRecoilState } from "recoil";

import { modalAtom } from "../../../../recoil/atoms/modalAtom";
import { alertAtom } from "../../../../recoil/atoms/alertAtom";
import { selectedUserAtom } from "../../../../recoil/atoms/selectedUserAtom";
import { emptyUserResponse } from "../../../../utils/models/UserResponse";

const LookupUserModal = () => {
  const [, setAlert] = useRecoilState(alertAtom);
  const [activeModal, setActiveModal] = useRecoilState(modalAtom);
  const [, setSelectedUser] = useRecoilState(selectedUserAtom);
  const [id, setId] = useState<number>(0);
  const [email, setEmail] = useState<string>("");

  const handleModalChange = () => {
    setActiveModal("LookupUserModal");
  };

  const handleIdChange = (e: any) => {
    if (e && e.target.value) {
      setId(e.target.value);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e && e.target.value) {
      setEmail(e.target.value);
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
    if (!id && !email) {
      return;
    }

    const searchById = id !== 0;
    const searchByEmail = email !== "";

    if (searchById && searchByEmail) {
      setAlert({
        message: "Choose either ID or Email and leave the other blank",
        type: "error",
      });
    }

    try {
      const reqOptions: RequestInit = {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      };

      var url = "";
      if (searchById) {
        url = `${process.env.REACT_APP_BACKEND}/staff/users/${id}`;
      } else if (searchByEmail) {
        url = `${process.env.REACT_APP_BACKEND}/staff/users?email=${email}`;
      }
      setSelectedUser(emptyUserResponse);
      const res = await fetch(url, reqOptions);
      setId(0);
      setEmail("");

      if (res.ok) {
        setAlert({
          message: "Found user!",
          type: "success",
        });
      } else if (!res.ok && res.status === 400) {
        throw new Error(`Unable to find user with ID: ${id}`);
      }

      const data = await res.json();

      setSelectedUser({
        ...data,
        firstName: data.first_name,
        lastName: data.last_name,
      });
      setActiveModal(null);
    } catch (err) {
      setAlert({ message: err.message, type: "error" });
    }
  };

  const modal =
    activeModal === "LookupUserModal" &&
    ReactDOM.createPortal(
      <div className="modal-overlay" onClick={handleOutsideClick}>
        <form
          className="mx-auto mb-0 mt-6 space-y-4 rounded-lg p-4 bg-gray-50 shadow-lg shadow-gray-300/50 sm:mt-8 sm:p-6 lg:p-8"
          onSubmit={handleLookup}
        >
          <p className="text-center text-lg font-medium">Lookup User By ID</p>

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
            <label htmlFor="email" className="mr-auto">
              Email
            </label>

            <div className="relative">
              <input
                id="email"
                type="email"
                onChange={handleEmailChange}
                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm focus:ring-gray-200 focus:border-gray-400 active:border-gray-200"
                placeholder="Email"
                autoComplete="email"
              />

              <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
              </span>
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
        Lookup User
      </div>
      {modal}
    </div>
  );
};

export default LookupUserModal;
