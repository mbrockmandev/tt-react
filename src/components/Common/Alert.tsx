import React, { useState } from "react";
import { useRecoilState } from "recoil";
import { alertAtom } from "../../recoil/atoms/alertAtom";

function XMarkIcon(props) {
  return (
    <svg
      fill="none"
      stroke="red"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}

const Alert = () => {
  const [visible, setVisible] = useState(true);
  const [alert, setAlert] = useRecoilState(alertAtom);

  const handleDismissButtonClick = (e) => {
    e.preventDefault();
    setVisible(false);
    setAlert({
      message: "",
      type: "success",
    });
  };

  if (!visible) {
    return null;
  }

  return (
    <div className="!z-50 absolute top-24 right-8">
      {alert.type === "success" && (
        <div
          role="alert"
          className="rounded-xl border border-gray-100 bg-green-200 p-4">
          <div className="flex items-start gap-4">
            <span className="text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-6 w-6">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </span>

            <div className="flex-1">
              <p className="mt-1 text-sm text-green-700">{alert.message}</p>
            </div>

            <button
              className="text-green-500 transition hover:text-green-600"
              onClick={handleDismissButtonClick}>
              <span className="sr-only">Dismiss popup</span>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-6 w-6">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
      {alert.type === "error" && (
        <div
          role="alert"
          className="rounded-xl border border-gray-100 bg-red-200 p-4">
          <div className="flex items-start gap-4">
            <span className="text-gray-600">
              <XMarkIcon />
            </span>

            <div className="flex-1">
              <strong className="block font-medium text-red-900">
                {" "}
                Uh oh, something went wrong{" "}
              </strong>

              <p className="mt-1 text-sm text-red-900">{alert.message}</p>
            </div>

            <button
              className="text-red-500 transition hover:text-red-600"
              onClick={handleDismissButtonClick}>
              <span className="sr-only">Dismiss popup</span>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-6 w-6">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Alert;
