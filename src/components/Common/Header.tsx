import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";

import {
  Navbar,
  Collapse,
  Typography,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import {
  CubeTransparentIcon,
  UserCircleIcon,
  CodeBracketSquareIcon,
  ChevronDownIcon,
  PowerIcon,
} from "@heroicons/react/24/outline";

import Dropdown from "./Dropdown";
import SearchBar from "./SearchBar";
import { BookOpenIcon } from "./Footer";

import { ResetCurrentUrl, UpdateCurrentUrl } from "../../utils/urlStorage";

import { userAtom } from "../../recoil/atoms/userAtom";
import { alertAtom } from "../../recoil/atoms/alertAtom";

import { emptyUser } from "../../utils/models/User";

function NavMenu() {
  const [user, setUser] = useRecoilState(userAtom);
  const [, setAlert] = useRecoilState(alertAtom);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const menuItemClick = (e: any) => {
    const target = e.target as HTMLElement;
    const label = target.innerText;

    if (label === "My Dashboard") {
      navigate(`/${user.role}/dashboard`);
      UpdateCurrentUrl();
      return;
    }

    if (label === "Logout") {
      logout();
      localStorage.clear();
      setUser(emptyUser);
      navigate("/login");
    }
  };

  const logout = async () => {
    const requestOptions: RequestInit = {
      method: "GET",
      credentials: "include",
    };
    const url = `${process.env.REACT_APP_BACKEND}/logout`;
    try {
      const res = await fetch(url, requestOptions);
      if (res.status === 202) {
        setUser(emptyUser);
        setAlert({
          message: "Logged Out!",
          type: "success",
        });
        ResetCurrentUrl();
      }
    } catch (err) {
      setAlert({
        message: `error logging out: ${err.message}`,
        type: "error",
      });
    }
  };

  return (
    <Menu
      open={isMenuOpen}
      handler={setIsMenuOpen}
      placement="bottom-end">
      <MenuHandler>
        <Button
          variant="text"
          color="gray"
          className="flex items-center gap-1 py-3 px-2 lg:ml-auto bg-gray-200">
          Menu
          <ChevronDownIcon
            strokeWidth={2.5}
            className={`h-3 w-3 transition-transform ${
              isMenuOpen ? "rotate-180" : ""
            }`}
          />
        </Button>
      </MenuHandler>
      <MenuList className="p-1">
        {/* user dashboard item */}
        <MenuItem
          onClick={menuItemClick}
          className={`flex items-center gap-2 rounded hover:bg-gray-500/10 focus:bg-gray-500/10 active:bg-gray-500/10`}>
          {React.createElement(UserCircleIcon, {
            className: `h-4 w-4`,
            strokeWidth: 2,
          })}
          <Typography
            as="span"
            variant="lead"
            className="text-md py-2"
            color="inherit">
            My Dashboard
          </Typography>
        </MenuItem>
        {/* login */}
        {!user.isLoggedIn && (
          <MenuItem
            onClick={menuItemClick}
            className={`flex items-center gap-2 rounded hover:bg-gray-500/10 focus:bg-gray-500/10 active:bg-gray-500/10
          `}>
            {React.createElement(PowerIcon, {
              className: `h-4 w-4`,
              strokeWidth: 2,
            })}
            <Typography
              as="span"
              variant="lead"
              className="text-md py-2"
              color="inherit">
              Login
            </Typography>
          </MenuItem>
        )}
        {/* logout */}
        {user.isLoggedIn && (
          <MenuItem
            onClick={menuItemClick}
            className={`flex items-center gap-2 rounded hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/100
            }`}>
            {React.createElement(PowerIcon, {
              className: `h-4 w-4 text-red-500`,
              strokeWidth: 2,
            })}
            <Typography
              as="span"
              variant="lead"
              className="text-md py-2"
              color="red">
              Logout
            </Typography>
          </MenuItem>
        )}
      </MenuList>
    </Menu>
  );
}

// nav list component
const navListItems = [
  {
    label: "Books",
    icon: BookOpenIcon,
    link: "/books/popular",
  },
  {
    label: "Libraries",
    icon: CubeTransparentIcon,
    link: "/libraries",
  },
  {
    label: "FAQ",
    icon: CodeBracketSquareIcon,
    link: "/faq",
  },
];

export function NavList({ items }) {
  return (
    <ul className="z-50 mb-4 mt-2 lg:flex gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center">
      {items.map(({ label, icon, link }) => (
        <Link
          to={link}
          key={`${label}-${link}`}
          color="gray-gray"
          className="font-normal hover:bg-gray-200 focus:bg-gray-200/10 active:bg-gray-500/10 hover:text-gray-800">
          <MenuItem className="flex items-center gap-2 md:rounded-full">
            {React.createElement(icon, { className: "h-[18px] w-[18px]" })}{" "}
            {label}
          </MenuItem>
        </Link>
      ))}
    </ul>
  );
}

export default function Header() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const user = useRecoilValue(userAtom);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsNavOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Navbar
      className="mx-auto max-w-screen-xl p-2 lg:pl-6
       bg-gray-800 bg-gradient-to-r from-gray-600 to-gray-400 text-white drop-shadow">
      <div className="relative flex items-center justify-between">
        <Typography
          as="a"
          href="/"
          className="font-serif font-bold tracking-wider
          text-2xl mr-4 ml-2 text-zinc-100 cursor-pointer py-1.5
          hover:shimmer-text
          hover:text-transparent
          hover:bg-gradient-to-r
          hover:from-transparent
          hover:via-white
          hover:to-transparent
          hover:background-clip-text">
          TomeTracker
        </Typography>

        {user.isLoggedIn && (
          <div className="relative items-center ml-auto gap-x-4 flex">
            <SearchBar />
            <div className="hidden lg:flex">
              <NavList items={navListItems} />
            </div>
            <div className="flex items-center ">
              <Dropdown items={navListItems} />
              <NavMenu />
            </div>
          </div>
        )}
      </div>
      <Collapse
        open={isNavOpen}
        className="overflow-scroll text-gray-500">
        <NavList items={navListItems} />
      </Collapse>
    </Navbar>
  );
}
