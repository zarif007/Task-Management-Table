import React from "react";
import { Checkbox } from "../Checkbox";
import { Settings } from "lucide-react";
import TableFieldsDialog from "./TableFields.dialog";
import { IComponentConfig } from "@/interfaces/task";

interface TableHeaderProps {
  fieldSchema: IComponentConfig[];
  setFieldSchema: (fieldSchema: IComponentConfig[]) => void;
  allSelected: boolean;
  toggleAll: (checked: boolean) => void;
  handleSort: (fieldName: string) => void;
  sortField: string | null;
  sortDirection: "asc" | "desc";
}

const TableHeader: React.FC<TableHeaderProps> = ({
  fieldSchema,
  setFieldSchema,
  allSelected,
  toggleAll,
  handleSort,
  sortField,
  sortDirection,
}) => {
  return (
    <thead>
      <tr className="w-full">
        <th className="text-primary font-semibold text-sm border-b border-gray-800 w-1/12">
          <div className="flex items-center justify-center">
            <Checkbox checked={allSelected} onCheckedChange={toggleAll} />
          </div>
        </th>
        {fieldSchema.map((field, index) => (
          <th
            key={index}
            className="text-primary font-semibold py-3.5 px-4 text-sm border-b border-gray-800"
          >
            <div className="flex ite justify-between">
              <div className="flex items-center justify-start gap-2">
                {field.header}
                {field.isSortAble && (
                  <button
                    onClick={() => handleSort(field.name)}
                    className="font-bold text-md"
                  >
                    {sortField === field.name
                      ? sortDirection === "asc"
                        ? "↑"
                        : "↓"
                      : "↑↓"}
                  </button>
                )}
              </div>
              {index === fieldSchema.length - 1 && (
                <TableFieldsDialog
                  fieldSchema={fieldSchema}
                  setFieldSchema={setFieldSchema}
                >
                  <button>
                    <Settings />
                  </button>
                </TableFieldsDialog>
              )}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;
