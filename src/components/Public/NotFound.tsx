import React from "react";
import Footer from "../Common/Footer";
import Header from "../Common/Header";

const NotFound = () => {
  return (
    <>
      <Header />
      <div className="grid h-96 px-4 bg-white place-content-center">
        <h1 className="tracking-widest text-gray-500 uppercase">
          404 | Not Found
        </h1>
      </div>
      <Footer />
    </>
  );
};

export default NotFound;
