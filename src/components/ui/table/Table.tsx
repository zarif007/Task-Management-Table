"use client";

import React, { useState, useCallback, useEffect, useMemo } from "react";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import TableFooter from "./TableFooter";
import { IItem, IItemStore } from "@/interfaces/store";
import TableSearchFilter from "./TableSearchFilter";

interface TableProps {
  store: IItemStore;
  editingDialog: (id: number) => React.JSX.Element;
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
  const [sortedItems, setSortedItems] = useState<IItem[]>(items);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [filters, setFilters] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    let filteredItems = items;

    if (searchKeyword) {
      filteredItems = filteredItems.filter((item) =>
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(searchKeyword.toLowerCase())
        )
      );
    }

    fieldSchema.forEach((field) => {
      if (field.component === "Select" && filters[field.name]) {
        filteredItems = filteredItems.filter(
          (item) => item[field.name] === filters[field.name]
        );
      }
    });

    setSortedItems(filteredItems);
  }, [items, searchKeyword, filters, fieldSchema]);

  const paginatedItems = useMemo(() => {
    return sortedItems.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [sortedItems, currentPage, itemsPerPage]);

  const allSelected = useMemo(() => {
    return (
      paginatedItems.length > 0 && selectedRows.length === paginatedItems.length
    );
  }, [paginatedItems.length, selectedRows.length]);

  const toggleAll = useCallback(
    (checked: boolean) => {
      setSelectedRows(
        checked ? paginatedItems.map((item: IItem) => item.id) : []
      );
    },
    [paginatedItems]
  );

  const toggleRow = useCallback((rowIndex: number) => {
    setSelectedRows((prevSelected) =>
      prevSelected.includes(rowIndex)
        ? prevSelected.filter((index) => index !== rowIndex)
        : [...prevSelected, rowIndex]
    );
  }, []);

  const totalPages = useMemo(
    () => Math.ceil(sortedItems.length / itemsPerPage),
    [sortedItems.length, itemsPerPage]
  );

  const handleDeleteRows = useCallback(() => {
    handleDelete(selectedRows);
    setSelectedRows([]);
  }, [handleDelete, selectedRows, paginatedItems]);

  const handleSort = useCallback(
    (fieldName: string) => {
      let direction: "asc" | "desc" = "asc";

      if (sortField === fieldName) {
        direction = sortDirection === "asc" ? "desc" : "asc";
      }

      const sorted = [...sortedItems].sort((a, b) => {
        if (a[fieldName] < b[fieldName]) return direction === "asc" ? -1 : 1;
        if (a[fieldName] > b[fieldName]) return direction === "asc" ? 1 : -1;
        return 0;
      });

      setSortedItems(sorted);
      setSortField(fieldName);
      setSortDirection(direction);
    },
    [sortedItems, sortField, sortDirection]
  );

  const handleFilterChange = useCallback((fieldName: string, value: string) => {
    setFilters((prevFilters) => {
      if (value === "All") {
        const { [fieldName]: _, ...rest } = prevFilters;
        return rest;
      } else {
        return {
          ...prevFilters,
          [fieldName]: value,
        };
      }
    });
  }, []);

  return (
    <div className="w-full overflow-x-auto h-screen">
      <div className="min-w-[800px]">
        <TableSearchFilter
          searchKeyword={searchKeyword}
          setSearchKeyword={setSearchKeyword}
          fieldSchema={fieldSchema}
          filters={filters}
          handleFilterChange={handleFilterChange}
        />
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
            {paginatedItems.map((item, index) => (
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
