import React, { useEffect, useState } from "react";
import PaginationNumbers from "../../Common/PaginationNumbers";
import { ResponseLibrary } from "../../../recoil/atoms/libraryAtom";
import LibraryCard from "../../Library/LibraryCard";
import { UpdateCurrentUrl } from "../../../utils/urlStorage";

const BrowseLibraries = () => {
  const [libraries, setLibraries] = useState<ResponseLibrary[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const fetchLibraries = async () => {
      const reqOptions: RequestInit = {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      };
      const url = `${process.env.REACT_APP_BACKEND}/libraries?page=${page}&limit=${limit}`;
      const res = await fetch(url, reqOptions);
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      if (res.ok && res.status === 204) {
        setLibraries([]);
      }
      const data = await res.json();

      setTotalPages(data.metadata.totalPages);

      if (Array.isArray(data.libraries)) {
        const newLibraries: ResponseLibrary[] = [];
        for (const library of data.libraries) {
          let newLibrary: ResponseLibrary = {
            id: library.id,
            name: library.name,
            city: library.city,
            streetAddress: library.street_address,
            postalCode: library.postal_code,
            phone: library.phone,
          };
          newLibraries.push(newLibrary);
        }
        UpdateCurrentUrl();
        setLibraries(newLibraries);
      }
    };

    fetchLibraries().catch((err) => {
      console.error("error fetching books: ", err);
      console.error(err.message);
    });
  }, [page, limit]);

  return (
    <>
      <div className="flex items-center justify-center w-screen gap-3 pt-4">
        <div className="main-section flex-1 p-4 space-y-4">
          <h1 className="font-black text-3xl">Libraries</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {libraries.map((l) => (
              <LibraryCard key={`${l.id}`} library={l} />
            ))}
          </div>
        </div>
      </div>
      {totalPages > 1 && (
        <PaginationNumbers
          page={page}
          totalPages={totalPages}
          onPageChange={(newPage) => setPage(newPage)}
        />
      )}
    </>
  );
};

export default BrowseLibraries;
