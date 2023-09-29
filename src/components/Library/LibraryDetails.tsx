import React, { useEffect, useState } from "react";
import LibraryCard from "./LibraryCard";
import { useRecoilState } from "recoil";
import { Button } from "@material-tailwind/react";
import { userAtom } from "../../recoil/atoms/userAtom";
import { libraryAtom } from "../../recoil/atoms/libraryAtom";
import { UpdateCurrentUrl } from "../../utils/urlStorage";
import { alertQueueAtom } from "../../recoil/atoms/alertAtom";
import { useNavigate } from "react-router-dom";

const LibraryDetails: React.FC = () => {
  const [library, setLibrary] = useRecoilState(libraryAtom);
  const [user, setUser] = useRecoilState(userAtom);
  const [, setAlert] = useRecoilState(alertQueueAtom);
  const navigate = useNavigate();
  const [homeLibraryId, setHomeLibraryId] = useState(0);

  const fetchLibraryData = async () => {
    try {
      const reqOptions: RequestInit = {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      };
      const urlString = window.location.href;
      const urlPathname = new URL(urlString).pathname;
      const urlPathnameParts = urlPathname.split("/");
      const libraryId = urlPathnameParts[urlPathnameParts.length - 1];
      if (typeof +libraryId !== "number") {
        navigate("/user/dashboard");
        return;
      }

      const url = `${process.env.REACT_APP_BACKEND}/libraries/${libraryId}`;
      const res = await fetch(url, reqOptions);

      const data = await res.json();
      setLibrary({
        id: data.id,
        name: data.name,
        city: data.city,
        streetAddress: data.street_address,
        postalCode: data.postal_code,
        phone: data.phone,
      });
    } catch (err) {
      setAlert((prev) => [
        ...prev,
        {
          message: "Unable to get library info.",
          type: "error",
        },
      ]);
      console.error(err);
    }
  };

  useEffect(() => {
    UpdateCurrentUrl();
    fetchLibraryData();
  }, []);

  const handleSetHomeLibrary = (e: any) => {
    e.preventDefault();

    const setHomeLocation = async () => {
      try {
        const reqOptions: RequestInit = {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            libraryId: library.id,
          }),
        };

        const { id } = JSON.parse(localStorage.getItem("user"));
        const url = `${process.env.REACT_APP_BACKEND}/users/libraries/${library.id}/setHomeLocation?userId=${id}`;
        const res = await fetch(url, reqOptions);
        if (!res.ok && res.status === 409) {
          setAlert((prev) => [
            ...prev,
            {
              message: "Home Library already set",
              type: "error",
            },
          ]);
          return;
        }
        if (!res.ok) {
          throw new Error(
            `something went wrong with the request: ${res.status}`,
          );
        }
        // update user's home library and commit to memory/local storage
        setHomeLibraryId(library.id);
        setAlert((prev) => [
          {
            message: "Home Library Updated!",
            type: "success",
          },
        ]);
      } catch (err) {
        setAlert((prev) => [
          ...prev,
          {
            message: "Home library changed!",
            type: "error",
          },
        ]);
        console.error(err);
      }
    };

    setHomeLocation();
  };

  useEffect(() => {
    if (homeLibraryId === 0) return;
    const updatedUser = { ...user, homeLibraryId: homeLibraryId };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  }, [homeLibraryId]);

  if (!library)
    return (
      <>
        <div className="flex w-screen items-center justify-center">
          <div className="book m-4">
            <h3 className="font-black">Library Details</h3>
            <div className="flex">Loading...</div>
          </div>
        </div>
        <div className="mx-8">
          <p>Loading...</p>
        </div>
      </>
    );

  return (
    <>
      <div className="flex w-screen items-center justify-center">
        <div className="book m-4">
          <h3 className="text-3xl font-black">Library Details</h3>
          <div className="flex gap-4">
            <LibraryCard library={library} />
            {user.homeLibraryId !== library.id && (
              <>
                <Button
                  className="w-36 h-16 bg-gray-400 ml-20 mt-10 hover:bg-gray-500 transition-colors duration-300"
                  onClick={handleSetHomeLibrary}
                >
                  Set as My Library
                </Button>
              </>
            )}
          </div>
          <div className="">
            <p className="my-2">
              <span className="font-semibold">Place: </span> {library.name}
            </p>
            <p className="my-2">
              <span className="font-semibold">City: </span> {library.city}
            </p>
            <p className="my-2">
              <span className="font-semibold">Address: </span>
              {library.streetAddress}
            </p>
            {user.homeLibraryId === library.id && (
              <>
                <h4 className="text-xl font-bold">
                  This is your home library.
                </h4>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default LibraryDetails;
