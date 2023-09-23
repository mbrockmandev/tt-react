import React from "react";
import { Link } from "react-router-dom";
import { useRecoilState } from "recoil";
import { libraryAtom, ResponseLibrary } from "../../recoil/atoms/libraryAtom";

type LibraryCardProps = {
  library: ResponseLibrary;
};

const LibraryCard: React.FC<LibraryCardProps> = ({ library }) => {
  const { id, name, city, streetAddress } = library;
  const [libraryData, setLibraryData] = useRecoilState(libraryAtom);

  const handleClick = () => {
    const fetchLibraryDetails = async () => {
      if (libraryData && libraryData.id === id) {
        return;
      }
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND}/libraries/${id}`,
      );
      if (!res.ok) {
        throw new Error("something went wrong with the request");
      }
      const data = await res.json();

      setLibraryData({
        id: data.id,
        name: data.name,
        city: data.city,
        streetAddress: data.street_address,
        postalCode: data.postal_code,
        phone: data.phone,
      });
    };
    fetchLibraryDetails().catch((err) => console.error(err.message));
  };

  const grabLibraryImage = () => {
    switch (library.name) {
      case "Central Library":
        return libraryImages[0];
      case "Eastside Library":
        return libraryImages[1];
      case "Westside Library":
        return libraryImages[2];
      default:
        return libraryImages[3];
    }
  };

  return (
    <div
      style={{ aspectRatio: "9/6" }}
      className="mx-auto w-fit z-10 relative py-8">
      <Link
        to={`/libraries/${id}`}
        onClick={handleClick}
        className="group relative block h-80 w-60 transition hover:drop-shadow">
        <span className="absolute inset-0 drop-shadow"></span>

        <div className="relative flex h-full transform items-end drop-shadow-md bg-white transition-transform">
          <img
            src={grabLibraryImage()}
            alt=""
            className="absolute top-0 left-0 w-full h-full p-2 object-cover rounded"
            width={320}
            object-fit="cover"
          />

          <div
            className="absolute w-full mx-auto
          opacity-0
          transition-opacity
          bg-opacity-80
          group-hover:opacity-100
          bg-blue-50
          sm:p-6 lg:p-8">
            <h3 className="text-xl font-medium sm:text-2xl">{city}</h3>
            <h5 className="text-sm font-small sm:text-xl">{streetAddress}</h5>
          </div>
        </div>
        <h3 className="text-xl font-medium sm:text-2xl">{name}</h3>
      </Link>
    </div>
  );
};

export default LibraryCard;

const libraryImages = [
  "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  "https://images.unsplash.com/photo-1568667256549-094345857637?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2030&q=80",
  "https://images.unsplash.com/photo-1585779034823-7e9ac8faec70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDF8fHxlbnwwfHx8fHw%3D&auto=format&fit=crop&w=1000&q=60",
  "https://images.unsplash.com/photo-1600431521340-491eca880813?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
];
