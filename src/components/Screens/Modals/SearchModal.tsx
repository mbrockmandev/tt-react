import { Button } from "@material-tailwind/react";
import React, { useState } from "react";
import ReactDOM from "react-dom";

const SearchModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCriteria, setSearchCriteria] = useState("author");
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSearch = () => {
    // search here
    closeModal();
  };

  const modal =
    isModalOpen &&
    ReactDOM.createPortal(
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-4 rounded shadow-lg w-3/4 max-w-sm">
          <h2 className="text-lg mb-4 bg-gray-200">Search</h2>
          <input
            type="text"
            placeholder="Search..."
            className="border p-2 rounded mb-2 w-full"
          />
          <div className="flex flex-row gap-4">
            <div>
              <label>
                <input type="radio" name="type" value="author" /> Author
              </label>
            </div>
            <div>
              <label>
                <input type="radio" name="type" value="title" /> Title
              </label>
            </div>
            <div>
              <label>
                <input type="radio" name="type" value="isbn" /> ISBN
              </label>
            </div>
          </div>
          <div className="flex flex-row justify-around items-center my-2">
            <Button className="bg-blue-500 hover:bg-blue-400 text-white py-3 px-4">
              Submit
            </Button>

            <Button
              className="bg-gray-600 hover:bg-gray-500 py-3 px-4"
              onClick={closeModal}
            >
              Close
            </Button>
          </div>
        </div>
      </div>,
      document.getElementById("modal-root")
    );

  return (
    <div>
      <div className="sm:hidden flex" onClick={openModal}>
        Search
      </div>
      {modal}
    </div>
  );
};

export default SearchModal;
