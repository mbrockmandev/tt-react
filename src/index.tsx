import * as React from "react";
import ReactDOM from "react-dom/client";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {RecoilRoot} from "recoil";

import App from "./App";
import "./styles/tailwind.css";

// screens
import RegisterForm from "./components/Public/RegisterForm";
import LoginForm from "./components/Public/LoginForm";
import UserDashboard from "./components/Screens/User/UserDashboard";
import AdminDashboard from "./components/Screens/Admin/AdminDashboard";
import StaffDashboard from "./components/Screens/Staff/StaffDashboard";
import BrowseBooks from "./components/Screens/User/BrowseBooks";
import BookDetails from "./components/Book/BookDetails";
import BrowseLibraries from "./components/Screens/User/BrowseLibraries";
import LibraryDetails from "./components/Library/LibraryDetails";
import SearchResults from "./components/Screens/User/SearchResults";
import NotFound from "./components/Public/NotFound";
import BooksByLibraryReport
  from "./components/Screens/Staff/BooksByLibraryReport";
import FAQ from "./components/Public/FAQ";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    errorElement: <NotFound/>,
    children: [
      {
        path: "login",
        element: <LoginForm/>,
      },
      {
        path: "register",
        element: <RegisterForm/>,
      },
      {
        path: "books/popular",
        element: <BrowseBooks/>,
      },
      {
        path: "books/:bookId",
        element: <BookDetails/>,
      },
      {
        path: "books/search",
        element: <SearchResults/>,
      },
      {
        path: "admin/dashboard",
        element: <AdminDashboard/>,
      },
      {
        path: "staff/dashboard",
        element: <StaffDashboard/>,
      },
      {
        path: "user/dashboard",
        element: <UserDashboard/>,
      },
      {
        path: "libraries",
        element: <BrowseLibraries/>,
      },
      {
        path: "libraries/:id",
        element: <LibraryDetails/>,
      },
      {
        path: "reports/booksByLibrary",
        element: <BooksByLibraryReport/>,
      },
      {
        path: "faq",
        element: <FAQ/>,
      }
    ],
  },
]);

root.render(
  <React.StrictMode>
    <RecoilRoot>
      <RouterProvider router={router}/>
    </RecoilRoot>
  </React.StrictMode>,
);
