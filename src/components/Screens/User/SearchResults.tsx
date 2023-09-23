import React, {useEffect, useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useRecoilState} from "recoil";

// components
import Book from "../../../utils/models/Book";
import BookCard from "../../Book/BookCard";

// atoms
import {alertAtom} from "../../../recoil/atoms/alertAtom";
import {searchResultsAtom} from "../../../recoil/atoms/searchResultsAtom";

// misc utils
import {UpdateCurrentUrl} from "../../../utils/urlStorage";
import PaginationNumbers from "../../Common/PaginationNumbers";

const SearchResults = () => {
  const [searchResults, setSearchResults] = useRecoilState(searchResultsAtom);
  const [, setAlert] = useRecoilState(alertAtom);
  const [searchParams] = useSearchParams();

  const query = searchParams.get("q") || "";
  const type = searchParams.get("type") || "";
  const navigate = useNavigate();

  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "10";

  const [currentPage, setCurrentPage] = useState<number>(parseInt(page));
  const [totalPages, setTotalPages] = useState<number>(1);

  const getSearchResults = async () => {
    const url = `${process.env.REACT_APP_BACKEND}/books/search?q=${query}&type=${type}&page=${currentPage}&limit=${limit}`;

    const reqOptions: RequestInit = {
      method: "GET",
      credentials: "include",
    };

    try {
      const res = await fetch(url, reqOptions);
      const data = await res.json();
      if (res.ok && data) {
        setSearchResults({
          books: data.books,
        });
        setTotalPages(data.metadata.totalPages);
      }
    } catch (error) {
      if (error.message.includes("JSON.parse")) {
        return;
      }
      setAlert({
        message: error.message,
        type: "error",
      });
    }
  };

  useEffect(() => {
    UpdateCurrentUrl();
    getSearchResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, type, currentPage, limit]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    navigate(
      `/books/search?q=${query}&type=${type}&page=${newPage}&limit=${limit}`,
    );
  };

  if (!searchResults) {
    return <div>No results found.</div>;
  }

  return (
    <>
      <h2 className="text-xl font-semibold pt-4 pl-4">Search Results:</h2>
      <div className="">
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {searchResults.books.map((b: Book) => (
            <BookCard
              book={b}
              key={b.id}
            />
          ))}
        </div>
      </div>
      <PaginationNumbers
        page={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
};

export default SearchResults;
