import React from "react";
import Pagination from "../Pagination";
import Select from "../Select";

interface TableFooterProps {
  selectedRows: number[];
  handleDeleteRows: () => void;
  itemsPerPage: number;
  setItemsPerPage: (value: number) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const TableFooter: React.FC<TableFooterProps> = ({
  selectedRows,
  handleDeleteRows,
  itemsPerPage,
  setItemsPerPage,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <>
      {selectedRows.length > 0 && (
        <div className="flex items-center space-x-2 justify-end">
          <button
            className="bg-red-500 px-2 py-1 text-white rounded-md mt-4 font-semibold"
            onClick={handleDeleteRows}
          >
            Delete
          </button>
        </div>
      )}
      <div className="flex items-center justify-center mt-4">
        <div className="flex items-center justify-center space-x-4">
          <Select
            value={String(itemsPerPage)}
            options={["5", "10", "15", "20"]}
            onSelect={(value) => setItemsPerPage(Number(value))}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      </div>
    </>
  );
};

export default TableFooter;
