import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { alertAtom } from "../../recoil/atoms/alertAtom";
import { searchResultsAtom } from "../../recoil/atoms/searchResultsAtom";
import { userAtom } from "../../recoil/atoms/userAtom";
import SearchModal from "../Screens/Modals/SearchModal";

const SearchBar = () => {
  const user = useRecoilValue(userAtom);
  const [, setAlert] = useRecoilState(alertAtom);
  const [, setSearchResults] = useRecoilState(searchResultsAtom);
  const searchEl = useRef<HTMLInputElement>(null);
  const [queryType, setQueryType] = useState("author");
  const navigate = useNavigate();

  useEffect(() => {
    if (searchEl.current) {
      searchEl.current.value = "";
    }
  }, [searchEl, user.lastUrl]);

  const handleSearch = async () => {
    if (searchEl.current && searchEl.current.value.trim() !== "") {
      const queryText = searchEl.current.value.trim().replace(" ", "%20");

      const reqOptions: RequestInit = {
        method: "GET",
        credentials: "include",
      };

      try {
        const url = `${process.env.REACT_APP_BACKEND}/books/search?q=${queryText}&type=${queryType}&page=1&limit=10`;
        const res = await fetch(url, reqOptions);
        const data = await res.json();

        if (res.ok && data) {
          if (Array.isArray(data)) {
            setSearchResults({
              books: data,
            });
          }
        }
      } catch (error) {
        setAlert({
          message: "no results found",
          type: "error",
        });
      }

      navigate(
        `/books/search?q=${queryText}&type=${queryType}&page=1&limit=10`,
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Enter") {
      handleSearch();
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQueryType(e.target.value);
  };

  return (
    <div>
      <div className="hidden relative sm:flex">
        <label
          htmlFor="search-type"
          className="sr-only">
          Search
        </label>

        <select
          className="text-black mx-1 rounded-md border-gray-200 py-2.5 pe-10 shadow-sm sm:text-sm active:border-gray-500 focus:placeholder-transparent"
          name="search-type"
          id="search-type"
          value={queryType}
          onChange={handleSelectChange}>
          <option value="author">Author</option>
          <option value="title">Title</option>
          <option value="isbn">ISBN</option>
        </select>

        <input
          type="text"
          id="Search"
          ref={searchEl}
          placeholder="Search..."
          onKeyDown={handleKeyDown}
          className="w-full rounded-md text-black border-gray-200 py-2.5 pe-10 shadow-sm sm:text-sm active:border-gray-500 focus:placeholder-transparent"
        />

        <span className="absolute inset-y-0 end-0 grid w-10 place-content-center">
          <button
            type="button"
            className="text-gray-600 hover:text-gray-700">
            <span className="sr-only">Search</span>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              onClick={handleSearch}
              viewBox="0 0 24 24"
              strokeWidth="3"
              stroke="currentColor"
              className="h-4 w-4">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </button>
        </span>
      </div>
      <SearchModal />
    </div>
  );
};

export default SearchBar;
