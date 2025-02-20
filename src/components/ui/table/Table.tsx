"use client";

import React, { useState, useCallback, useEffect, useMemo } from "react";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import TableFooter from "./TableFooter";
import { IItem, ItemStore } from "@/interfaces/store";

interface TableProps {
  store: ItemStore;
  editingDialog: (index: number) => React.JSX.Element;
}

const Table: React.FC<TableProps> = ({ store, editingDialog }) => {
  const {
    items,
    fieldSchema,
    setFieldSchema,
    deleteItem: handleDelete,
    updateItem: handleUpdate,
  } = store;

  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [sortedItems, setSortedItems] = useState<any[]>(items);

  useEffect(() => {
    setSortedItems(items);
  }, [items]);

  const allSelected = useMemo(() => {
    return items.length > 0 && selectedRows.length === items.length;
  }, [items.length, selectedRows.length]);

  const toggleAll = useCallback(
    (checked: boolean) => {
      setSelectedRows(
        checked ? items.map((_: IItem, index: number) => index) : []
      );
    },
    [items]
  );

  const toggleRow = useCallback((rowIndex: number) => {
    setSelectedRows((prevSelected) =>
      prevSelected.includes(rowIndex)
        ? prevSelected.filter((index) => index !== rowIndex)
        : [...prevSelected, rowIndex]
    );
  }, []);

  const handleDeleteRows = useCallback(() => {
    handleDelete(selectedRows);
    setSelectedRows([]);
  }, [handleDelete, selectedRows]);

  const totalPages = useMemo(
    () => Math.ceil(sortedItems.length / itemsPerPage),
    [sortedItems.length, itemsPerPage]
  );

  const paginatedFields = useMemo(() => {
    return sortedItems.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [sortedItems, currentPage, itemsPerPage]);

  const handleSort = useCallback(
    (fieldName: string) => {
      let direction: "asc" | "desc" = "asc";

      if (sortField === fieldName) {
        direction = sortDirection === "asc" ? "desc" : "asc";
      }

      const sorted = [...items].sort((a, b) => {
        if (a[fieldName] < b[fieldName]) return direction === "asc" ? -1 : 1;
        if (a[fieldName] > b[fieldName]) return direction === "asc" ? 1 : -1;
        return 0;
      });

      setSortedItems(sorted);
      setSortField(fieldName);
      setSortDirection(direction);
    },
    [items, sortField, sortDirection]
  );

  return (
    <div className="w-full overflow-x-auto h-screen">
      <div className="min-w-[800px]">
        <table className="w-full mt-4">
          <TableHeader
            fieldSchema={fieldSchema}
            setFieldSchema={setFieldSchema}
            allSelected={allSelected}
            toggleAll={toggleAll}
            handleSort={handleSort}
            sortField={sortField}
            sortDirection={sortDirection}
          />
          <tbody>
            {paginatedFields.map((item, index) => (
              <TableRow
                key={index}
                item={item}
                index={index}
                fieldSchema={fieldSchema}
                selectedRows={selectedRows}
                toggleRow={toggleRow}
                handleUpdate={handleUpdate}
                editingDialog={editingDialog}
              />
            ))}
          </tbody>
        </table>
        <TableFooter
          selectedRows={selectedRows}
          handleDeleteRows={handleDeleteRows}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default Table;
