"use client";

import React from "react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const getPageNumbers = () => {
    if (totalPages <= 3)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 2) return [1, 2, 3, "..."];
    if (currentPage >= totalPages - 1)
      return ["...", totalPages - 2, totalPages - 1, totalPages];
    return ["...", currentPage - 1, currentPage, currentPage + 1, "..."];
  };

  return (
    <div className="flex items-center justify-center space-x-2">
      <button
        className="px-3 py-1 rounded-md font-semibold bg-white text-black disabled:bg-gray-400"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Prev
      </button>
      {getPageNumbers().map((page, index) => (
        <button
          key={index}
          className={`px-3 py-1 rounded-md font-semibold ${
            currentPage === page
              ? "bg-secondary text-black"
              : "bg-white text-black"
          } ${page === "..." ? "cursor-default" : ""}`}
          onClick={() => typeof page === "number" && onPageChange(page)}
          disabled={page === "..."}
        >
          {page}
        </button>
      ))}
      <button
        className="px-3 py-1 rounded-md font-semibold bg-white text-black disabled:bg-gray-400"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
