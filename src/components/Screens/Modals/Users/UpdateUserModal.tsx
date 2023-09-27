import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

import { useRecoilState, useRecoilValue } from "recoil";

import { modalAtom } from "../../../../recoil/atoms/modalAtom";
import { alertAtom } from "../../../../recoil/atoms/alertAtom";
import { selectedUserAtom } from "../../../../recoil/atoms/selectedUserAtom";
import { userAtom } from "../../../../recoil/atoms/userAtom";
import {
  UserResponse,
  emptyUserResponse,
} from "../../../../utils/models/UserResponse";

const UpdateUserModal = () => {
  const user = useRecoilValue(userAtom);
  const selectedUser = useRecoilValue(selectedUserAtom);

  const [, setAlert] = useRecoilState(alertAtom);
  const [activeModal, setActiveModal] = useRecoilState(modalAtom);

  const [isBypassChecked, setIsBypassChecked] = useState(false);
  const [userToModify, setUserToModify] =
    useState<UserResponse>(emptyUserResponse);

  useEffect(() => {
    setUserToModify(selectedUser);
  }, []);

  const handleModalChange = () => {
    if (selectedUser.id !== 0) setActiveModal("UpdateUserModal");
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

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "user") {
      setUserToModify({
        ...userToModify,
        role: "user",
      });
    } else if (e.target.value === "staff") {
      setUserToModify({
        ...userToModify,
        role: "staff",
      });
    } else if (e.target.value === "admin") {
      setUserToModify({
        ...userToModify,
        role: "admin",
      });
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserToModify({
      ...userToModify,
      email: e.target.value,
    });
  };

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserToModify({
      ...userToModify,
      firstName: e.target.value,
    });
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserToModify({
      ...userToModify,
      lastName: e.target.value,
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserToModify({
      ...userToModify,
      password: e.target.value,
    });
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setUserToModify({
      ...userToModify,
      confirmPassword: e.target.value,
    });
  };

  const handleBypassChecked = () => {
    setIsBypassChecked(!isBypassChecked);
  };

  const handleUpdate = async (e: any) => {
    e.preventDefault();

    try {
      const userToUpdate = {
        ...userToModify,
        id: selectedUser.id,
      };

      const reqOptions: RequestInit = {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userToUpdate),
      };

      const url = `${process.env.REACT_APP_BACKEND}/${user.role}/users/${selectedUser.id}`;
      const res = await fetch(url, reqOptions);

      if (res.ok) {
        setAlert({
          message: "Found user!",
          type: "success",
        });
      } else if (!res.ok) {
        throw new Error("HTTP status code: " + res.status);
      }

      const data = await res.json();

      setAlert({ message: data.message, type: "success" });
    } catch (err) {
      setAlert({ message: err.message, type: "error" });
      console.error(err);
    }
  };

  const modal =
    activeModal === "UpdateUserModal" &&
    ReactDOM.createPortal(
      <div
        className="modal-overlay"
        onClick={handleOutsideClick}>
        <form className="mx-auto mb-0 mt-6 space-y-4 rounded-lg p-4 bg-gray-50 shadow-lg shadow-gray-300/50 sm:mt-8 sm:p-6 lg:p-8">
          {selectedUser.id !== 0 && (
            <>
              <p className="text-center text-lg font-medium">User info:</p>

              <div>
                <div className="flex items-center gap-x-2">
                  <label
                    htmlFor="email"
                    className="mr-auto">
                    Email
                  </label>

                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      onChange={handleEmailChange}
                      value={userToModify.email}
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
                        stroke="currentColor">
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

                <div className="flex items-center gap-x-2">
                  <label
                    htmlFor="password"
                    className="mr-auto">
                    Password
                  </label>

                  <div className="relative">
                    <input
                      id="password"
                      type="password"
                      disabled={isBypassChecked}
                      onChange={handlePasswordChange}
                      className={`w-full rounded-lg p-4 pe-12 text-sm shadow-sm shadow-gray-300 focus:ring-gray-200 focus:border-gray-400 active:border-gray-200 ${
                        isBypassChecked
                          ? "bg-gray-100 border-white"
                          : "border-gray-200"
                      }`}
                      placeholder={`${isBypassChecked ? "" : "Password"}`}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-x-2">
                  <label
                    htmlFor="confirmPassword"
                    className="mr-auto">
                    Confirm
                  </label>

                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type="password"
                      disabled={isBypassChecked}
                      onChange={handleConfirmPasswordChange}
                      className={`w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm shadow-gray-300 focus:ring-gray-200 focus:border-gray-400 active:border-gray-200 ${
                        isBypassChecked
                          ? "bg-gray-100 border-white"
                          : "border-gray-200"
                      }`}
                      placeholder={`${
                        isBypassChecked ? "" : "Confirm Password"
                      }`}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-x-2">
                    <label htmlFor="firstName">First Name</label>

                    <div className="relative ml-auto">
                      <input
                        id="firstName"
                        type="text"
                        onChange={handleFirstNameChange}
                        value={userToModify.firstName}
                        className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm shadow-gray-300 focus:ring-gray-200 focus:border-gray-400 active:border-gray-200"
                        placeholder="First Name"
                        pattern="[a-zA-Z]*"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-x-2">
                    <label htmlFor="lastName">Last Name</label>

                    <div className="relative ml-auto">
                      <input
                        id="lastName"
                        type="text"
                        onChange={handleLastNameChange}
                        value={userToModify.lastName}
                        className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm shadow-gray-300 focus:ring-gray-200 focus:border-gray-400 active:border-gray-200"
                        placeholder="Last Name"
                        pattern="[a-zA-Z]*"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-x-4">
                    <div className="">
                      <label
                        htmlFor="bypass"
                        className={`mr-2`}
                        onClick={handleBypassChecked}>
                        <span
                          className={`
                              cursor-pointer
                              ${
                                isBypassChecked
                                  ? "underline text-red-700 font-bold"
                                  : "underlien text-blue-500 font-bold"
                              }`}>
                          {isBypassChecked
                            ? "Bypass Password"
                            : "Require Password"}
                        </span>
                      </label>
                    </div>

                    <div className="py-4 flex justify-end items-center gap-4">
                      <label htmlFor="role">Role:</label>
                      <select
                        id="role"
                        className="rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm shadow-gray-300 focus:ring-gray-200 focus:border-gray-400 active:border-gray-200"
                        onChange={handleRoleChange}>
                        <option
                          value={userToModify.role}
                          placeholder="Role"
                          defaultChecked>
                          User
                        </option>
                        <option value="staff">Staff</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
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
                    className="submit-button block w-[35%] bg-green-300 rounded-lg bg-secondary px-5 py-3 text-sm font-medium text-black mx-auto"
                    onClick={handleUpdate}>
                    Update
                  </button>
                </div>
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
        onClick={selectedUser ? handleModalChange : undefined}>
        Update User
      </div>
      {modal}
    </div>
  );
};

export default UpdateUserModal;
