import React, { useEffect, useState, useRef } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { NavList } from "./Header";

const Dropdown = ({ items }) => {
  const dropDownRef = useRef(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [icon, setIcon] = useState("bars");

  useEffect(() => {
    const handleMouseDownOutsideMenu = (e: MouseEvent) => {
      if (isMenuOpen && !dropDownRef.current?.contains(e.target as Node)) {
        setIsMenuOpen(false);
        setIcon("bars");
      }
    };

    document.addEventListener("mousedown", handleMouseDownOutsideMenu);

    return () => {
      document.removeEventListener("mousedown", handleMouseDownOutsideMenu);
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen((cur) => !cur);
    setIcon((cur) => (cur === "bars" ? "xmark" : "bars"));
  };

  return (
    <div
      ref={dropDownRef}
      className="flex items-center gap-2 rounded hover:bg-gray-500/10 focus:bg-gray-500/10 active:bg-gray-500/10
">
      <div className="relative mr-2 lg:hidden">
        <div className="inline-flex items-center overflow-hidden rounded-md border bg-white">
          <button
            className="border-e px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-700 focus:outline-none"
            onClick={toggleMenu}>
            <span className={`myicon`}>
              {icon === "xmark" && (
                <XMarkIcon className={`h-5 w-5 rotate-fade`} />
              )}
              {icon === "bars" && (
                <Bars3Icon className={`h-5 w-5 rotate-fade-in `} />
              )}
            </span>
          </button>
        </div>

        <div
          className={`overflow-hidden end-0 mt-2 w-auto rounded-md border text-black border-gray-100 bg-gray-50 shadow-lg fade-in z-50 !fixed top-8 right-0 ${isMenuOpen ? "" : "hidden"
            }`}
          role="menu">
          <div className="p-1">
            <NavList items={items} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dropdown;
