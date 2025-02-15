"use client";

import { ITableHeaders } from "@/interfaces/table";
import React, { JSX, useEffect, useState } from "react";
import { Checkbox } from "./Checkbox";

const Table = ({
  headers,
  formattedFields,
}: {
  headers: ITableHeaders[];
  formattedFields: JSX.Element[][];
}) => {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [fields, setFields] = useState(formattedFields);

  useEffect(() => {
    setFields(formattedFields);
  }, [formattedFields]);

  const allSelected =
    fields.length > 0 && selectedRows.length === fields.length;

  const toggleAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(fields.map((_, index) => index));
    } else {
      setSelectedRows([]);
    }
  };

  const toggleRow = (rowIndex: number) => {
    setSelectedRows((prevSelected) =>
      prevSelected.includes(rowIndex)
        ? prevSelected.filter((index) => index !== rowIndex)
        : [...prevSelected, rowIndex]
    );
  };

  const handleDeleteRows = () => {
    setFields((prevFields) =>
      prevFields.filter((_, index) => !selectedRows.includes(index))
    );
    setSelectedRows([]);
  };

  return (
    <div className="w-full overflow-x-auto h-screen">
      <div className="min-w-[800px]">
        <table className="w-full">
          <thead>
            <tr className="w-full">
              <th className="text-primary font-semibold text-sm border-b border-gray-800 w-1/12">
                <div className="flex items-center justify-center">
                  <Checkbox checked={allSelected} onCheckedChange={toggleAll} />
                </div>
              </th>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="text-primary font-semibold py-3.5 px-4 text-sm border-b border-gray-800"
                >
                  <div className="flex items-center justify-start gap-2">
                    {header.icon}
                    {header.label}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fields.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`${
                  selectedRows.includes(rowIndex) && "bg-gray-900"
                }`}
              >
                <td className="text-md font-semibold text-primary border-b border-gray-800 w-1/12">
                  <div className="flex items-center justify-center">
                    <Checkbox
                      checked={selectedRows.includes(rowIndex)}
                      onCheckedChange={() => toggleRow(rowIndex)}
                    />
                  </div>
                </td>
                {row.map((component, colIndex) => (
                  <td
                    key={colIndex}
                    className="text-md font-semibold text-primary border-b border-gray-800"
                  >
                    <div
                      className={`flex items-center justify-start ${
                        colIndex > -1 && "border-l border-gray-800"
                      }`}
                    >
                      {component}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
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
      </div>
    </div>
  );
};

export default Table;
