import React from "react";
import Select from "../Select";
import { IComponentConfig } from "@/interfaces/task";

interface TableSearchFilterProps {
  searchKeyword: string;
  setSearchKeyword: (value: string) => void;
  fieldSchema: IComponentConfig[];
  filters: { [key: string]: string };
  handleFilterChange: (fieldName: string, value: string) => void;
}

const TableSearchFilter: React.FC<TableSearchFilterProps> = ({
  searchKeyword,
  setSearchKeyword,
  fieldSchema,
  filters,
  handleFilterChange,
}) => {
  return (
    <div className="flex gap-2 mb-4">
      <input
        type="text"
        placeholder="Search..."
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
        className="text-primary bg-gray-900 rounded-md border-none h-full focus:outline-none px-6 py-4 font-semibold"
      />

      <div className="flex gap-2">
        {fieldSchema
          .filter((field) => field.component === "Select")
          .map((field) => (
            <div
              key={field.name}
              className="flex items-center text-primary bg-gray-900 rounded-md border-none h-full focus:outline-none py-0 pl-2 font-semibold"
            >
              <p>{field.header}</p>
              <Select
                value={filters[field.name] || `All`}
                onSelect={(value) => handleFilterChange(field.name, value)}
                options={["All", ...(field.options ?? [])]}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default TableSearchFilter;
