import React from "react";
import { Checkbox } from "../Checkbox";
import { fieldMappingForTable } from "../../FieldMappings";
import { IItem } from "@/interfaces/store";
import { IComponentConfig } from "@/interfaces/task";

interface TableRowProps {
  item: IItem;
  index: number;
  fieldSchema: IComponentConfig[];
  selectedRows: number[];
  toggleRow: (rowIndex: number) => void;
  handleUpdate: (
    id: number,
    field: string,
    value: string | boolean | number
  ) => void;
  editingDialog: (id: number) => React.JSX.Element;
}

const TableRow: React.FC<TableRowProps> = ({
  item,
  index,
  fieldSchema,
  selectedRows,
  toggleRow,
  handleUpdate,
  editingDialog,
}) => {
  return (
    <tr className={`${selectedRows.includes(item.id) && "bg-gray-900"}`}>
      <td className="text-md font-semibold text-primary border-b border-gray-800 w-1/12">
        <div className="flex items-center justify-center py-4">
          <Checkbox
            checked={selectedRows.includes(item.id)}
            onCheckedChange={() => toggleRow(item.id)}
          />
        </div>
      </td>
      {fieldSchema.map((field, colIndex) => (
        <td
          key={colIndex}
          className="text-md font-semibold text-primary border-b border-gray-800"
        >
          <div
            className={`flex items-center justify-start ${
              colIndex > -1 && "border-l border-gray-800"
            }`}
          >
            <div className="flex items-center justify-between group w-full">
              {fieldMappingForTable({
                item,
                index,
                field,
                handleUpdate,
              })}
              {field.isDialogOpener && editingDialog(item.id)}
            </div>
          </div>
        </td>
      ))}
    </tr>
  );
};

export default TableRow;
