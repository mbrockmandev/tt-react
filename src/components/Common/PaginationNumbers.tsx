import React from "react";

type PaginationNumbersProps = {
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
};

const PaginationNumbers: React.FC<PaginationNumbersProps> = ({
  page,
  totalPages,
  onPageChange,
}) => {
  return (
    <div>
      <div className="flex items-center justify-center gap-3 pt-4">
        <button
          onClick={(e) => {
            e.preventDefault();
            page > 1 && onPageChange(page - 1);
          }}
          className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180">
          <span className="sr-only">Next Page</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3"
            viewBox="0 0 20 20"
            fill="currentColor">
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        <p className="text-xs text-gray-900">
          {page}
          <span className="mx-0.25">/</span>
          {totalPages}
        </p>

        <button
          onClick={(e) => {
            e.preventDefault();
            page < totalPages && onPageChange(page + 1);
          }}
          className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180">
          <span className="sr-only">Next Page</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3"
            viewBox="0 0 20 20"
            fill="currentColor">
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default PaginationNumbers;
