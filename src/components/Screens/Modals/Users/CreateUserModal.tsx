import React, { useState } from "react";
import ReactDOM from "react-dom";

import { useRecoilState } from "recoil";

import {
  doPasswordsMatch,
  isValidEmail,
  isValidName,
  isValidPassword,
} from "../../../../utils/validators";

import { modalAtom } from "../../../../recoil/atoms/modalAtom";
import { alertAtom } from "../../../../recoil/atoms/alertAtom";
import { LoginUser, emptyLoginUser } from "../../../Public/RegisterForm";

const CreateUserModal = () => {
  const [activeModal, setActiveModal] = useRecoilState(modalAtom);
  const [, setAlert] = useRecoilState(alertAtom);
  const [newUser, setNewUser] = useState<LoginUser>(emptyLoginUser);

  const handleCancelModal = (e: any) => {
    if (e && e.target.classList.contains("modal-overlay")) {
      setNewUser(emptyLoginUser);
      setActiveModal(null);
    }
  };
  const handleModalChange = () => {
    setActiveModal("CreateUserModal");
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "user") {
      setNewUser({
        ...newUser,
        role: e.target.value,
      });
    } else if (e.target.value === "staff") {
      setNewUser({
        ...newUser,
        role: e.target.value,
      });
    } else if (e.target.value === "admin") {
      setNewUser({
        ...newUser,
        role: e.target.value,
      });
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewUser({
      ...newUser,
      email: e.target.value,
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewUser({
      ...newUser,
      password: e.target.value,
    });
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNewUser({
      ...newUser,
      confirmPassword: e.target.value,
    });
  };

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewUser({
      ...newUser,
      firstName: e.target.value,
    });
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewUser({
      ...newUser,
      lastName: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      if (!isValidEmail(newUser.email)) {
        throw new Error("Invalid email");
      }

      if (!isValidName(newUser.firstName)) {
        throw new Error("Invalid first name");
      }

      if (!isValidName(newUser.lastName)) {
        throw new Error("Invalid last name");
      }

      if (!isValidPassword(newUser.password)) {
        throw new Error("Invalid password");
      }

      if (!doPasswordsMatch(newUser.password, newUser.confirmPassword)) {
        throw new Error("Passwords do not match");
      }

      const reqOptions: RequestInit = {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: newUser.email,
          first_name: newUser.firstName,
          last_name: newUser.lastName,
          password: newUser.password,
          confirm_password: newUser.confirmPassword,
          role: newUser.role,
        }),
      };

      const res = await fetch(
        `${process.env.REACT_APP_BACKEND}/register`,
        reqOptions,
      );

      if (!res.ok && res.status === 409) {
        setAlert({
          message: "This user already exists in the database.",
          type: "error",
        });
        handleCancelModal(null);
      } else if (!res.ok) {
        throw new Error("HTTP status code: " + res.status);
      }

      const data = await res.json();

      setAlert({ message: data.message, type: "success" });
      handleCancelModal(null);
    } catch (err) {
      setAlert({ message: err.message, type: "error" });
      handleCancelModal(null);
      console.error(err);
      if (err !== "") {
        return;
      }
    }
  };

  const modal =
    activeModal === "CreateUserModal" &&
    ReactDOM.createPortal(
      <div
        className="modal-overlay"
        onClick={handleCancelModal}>
        <form className="mx-auto mb-0 mt-6 space-y-4 rounded-lg p-4 bg-gray-50 shadow-lg shadow-gray-300/50 sm:mt-8 sm:p-6 lg:p-8">
          <p className="text-center text-lg font-medium">
            Register a new account
          </p>

          <div>
            <label
              htmlFor="email"
              className="sr-only">
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

          <div>
            <label
              htmlFor="password"
              className="sr-only">
              Password
            </label>

            <div className="relative">
              <input
                id="password"
                type={"text"}
                onChange={handlePasswordChange}
                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm shadow-gray-300 focus:ring-gray-200 focus:border-gray-400 active:border-gray-200"
                placeholder="Password"
              />
            </div>
            <label
              htmlFor="confirmPassword"
              className="sr-only">
              Password
            </label>

            <div className="relative pt-4">
              <input
                id="confirmPassword"
                type={"text"}
                onChange={handleConfirmPasswordChange}
                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm shadow-gray-300 focus:ring-gray-200 focus:border-gray-400 active:border-gray-200"
                placeholder="Confirm Password"
              />
            </div>
            <label
              htmlFor="firstname"
              className="sr-only">
              First Name
            </label>

            <div className="relative my-4">
              <input
                id="firstname"
                type="text"
                onChange={handleFirstNameChange}
                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm shadow-gray-300 focus:ring-gray-200 focus:border-gray-400 active:border-gray-200"
                placeholder="First Name"
                pattern="[a-zA-Z]*"
              />
            </div>

            <label
              htmlFor="lastname"
              className="sr-only">
              Last Name
            </label>

            <div className="relative">
              <input
                id="lastname"
                type="text"
                onChange={handleLastNameChange}
                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm shadow-gray-300 focus:ring-gray-200 focus:border-gray-400 active:border-gray-200"
                placeholder="Last Name"
                pattern="[a-zA-Z]*"
              />
            </div>

            <div className="py-4 flex justify-end items-center gap-4">
              <label htmlFor="role">Role:</label>
              <select
                id="role"
                className="rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm shadow-gray-300 focus:ring-gray-200 focus:border-gray-400 active:border-gray-200"
                onChange={handleRoleChange}>
                <option
                  value="user"
                  placeholder="Role"
                  defaultChecked>
                  User
                </option>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="flex">
            <button
              type="submit"
              className="block w-[35%] bg-red-300 rounded-lg bg-secondary px-5 py-3 text-sm font-medium text-black mx-auto"
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
        Create User
      </div>
      {modal}
    </div>
  );
};

export default CreateUserModal;
