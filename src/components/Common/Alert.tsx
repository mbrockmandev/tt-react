import React, { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { alertQueueAtom } from "../../recoil/atoms/alertAtom";

function XMarkIcon(props: any) {
  return (
    <svg
      fill="none"
      stroke="red"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}

const Alert = () => {
  const [alertQueue, setAlertQueue] = useRecoilState(alertQueueAtom);
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);

  const currentAlert = alertQueue[0];

  useEffect(() => {
    if (currentAlert && currentAlert.message) {
      setProgress(0);

      const duration = currentAlert.duration || 5000;
      const intervalTime = 50;
      const increment = intervalTime / duration;

      timerRef.current = setTimeout(() => {
        setAlertQueue((prev) => prev.slice(1));
      }, duration);

      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev < 100) {
            return prev + increment;
          } else {
            clearInterval(progressInterval);
            return 100;
          }
        });
      }, intervalTime);

      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
        clearInterval(progressInterval);
      };
    }
  }, [currentAlert]);

  const dismissAlert = () => {
    setVisible(false);
    setAlertQueue((prevQueue) => prevQueue.slice(1));
  };

  const handleDismissButtonClick = (e: any) => {
    e.preventDefault();
    dismissAlert();
  };

  if (!visible || !currentAlert) {
    return null;
  }

  const renderAlertContent = (type: string, message: string) => {
    const alertTypes = {
      success: {
        bgColor: "bg-green-200",
        textColor: "text-green-700",
        icon: <XMarkIcon />,
      },
      error: {
        bgColor: "bg-red-200",
        textColor: "text-red-900",
        icon: <XMarkIcon />,
      },
      info: {
        bgColor: "bg-sky-300",
        textColor: "text-gray-800",
        icon: <XMarkIcon />,
      },
    };

    const alertConfig = alertTypes[type];
    return (
      <div
        role="alert"
        className={`rounded-xl border border-gray-100 ${alertConfig.bgColor} p-4`}
      >
        <div className="flex items-start gap-4">
          <span className="text-gray-600">{alertConfig.icon}</span>
          <div className="flex-1">
            <p className={`mt-1 text-sm ${alertConfig.textColor}`}>{message}</p>
          </div>
          <button
            className="text-black transition hover:text-white"
            onClick={handleDismissButtonClick}
          >
            <span className="sr-only">Dismiss popup</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="mt-2 bg-gray-200 rounded-full h-1.5">
          <div
            className="bg-blue-600 rounded-full h-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className="!z-50 absolute top-24 right-8">
      {renderAlertContent(currentAlert.type, currentAlert.message)}
    </div>
  );
};

export default Alert;
