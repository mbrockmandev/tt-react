import * as React from "react";
import { Button } from "@material-tailwind/react";

const ButtonComponent = ({ children }) => {
  return (
    <Button className="rounded-md py-2 text-sm font-medium text-white bg-gray-500 py-2 px-3 hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-2 focus:ring-gray-300">
      {children}
    </Button>
  );
};

export default ButtonComponent;
