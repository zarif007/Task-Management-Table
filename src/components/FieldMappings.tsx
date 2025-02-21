import { CheckedState } from "@radix-ui/react-checkbox";
import { Checkbox } from "./ui/Checkbox";
import Select from "./ui/Select";
import React from "react";
import { IComponentConfig } from "@/interfaces/task";

interface Item {
  id: number;
  [key: string]: string | number | boolean;
}

interface FieldMappingProps {
  item: Item;
  index: number;
  field: IComponentConfig;
  handleUpdate: (
    id: number,
    fieldName: string,
    value: string | number | boolean
  ) => void;
}

interface DialogFieldMappingProps {
  field: IComponentConfig;
  type: "create" | "update";
  newItem: Item;
  items: Item[] | [];
  editingId: number;
  updateNewItem: (field: string, value: string | number | boolean) => void;
  updateItem: (
    id: number,
    field: string,
    value: string | boolean | number
  ) => void;
}

const styles = {
  input:
    "w-full text-primary bg-gray-900 rounded-md border-none h-full focus:outline-none p-4 font-semibold",
  label: "text-primary font-semibold text-sm",
};

const getCurrentValue = (
  fieldName: string,
  type: "create" | "update",
  newTask: Item,
  tasks: Item[],
  editingId: number
) => {
  if (type === "create") {
    return newTask[fieldName];
  } else {
    const task = tasks.find((task) => task.id === editingId);
    return task ? task[fieldName] ?? "" : "";
  }
};

const handleUpdate = (
  fieldName: string,
  value: string | number | boolean,
  type: "create" | "update",
  updateNewItem: (field: string, value: string | number | boolean) => void,
  updateItem: (
    id: number,
    field: string,
    value: string | boolean | number
  ) => void,
  tasks: Item[],
  editingId: number
) => {
  type === "create"
    ? updateNewItem(fieldName, value)
    : updateItem(editingId, fieldName, value);
};

export const fieldMappingForTable = ({
  item,
  field,
  handleUpdate,
}: FieldMappingProps) => {
  const renderField = () => {
    switch (field.component) {
      case "Input":
        return (
          <input
            type={field.type}
            value={(item[field.name] ?? "") as string}
            onChange={(e) => handleUpdate(item.id, field.name, e.target.value)}
            className="w-full text-primary bg-transparent border-none h-full focus:outline-none p-4"
          />
        );

      case "Select":
        return (
          <Select
            value={item[field.name] as string}
            onSelect={(value) => handleUpdate(item.id, field.name, value)}
            options={field.options || []}
          />
        );

      case "Checkbox":
        return (
          <div className="p-4">
            <Checkbox
              className="items-center justify-center"
              checked={item[field.name] as boolean}
              onCheckedChange={(value) =>
                handleUpdate(item.id, field.name, value)
              }
            />
          </div>
        );

      default:
        return null;
    }
  };

  return renderField();
};

export const fieldMappingForDialog = ({
  field,
  type,
  newItem,
  items,
  editingId,
  updateNewItem,
  updateItem,
}: DialogFieldMappingProps) => {
  const currentValue = getCurrentValue(
    field.name,
    type,
    newItem,
    items,
    editingId
  );

  const renderField = () => {
    switch (field.component) {
      case "Input":
        return (
          <input
            id={field.name ?? ""}
            type={field.type}
            value={typeof currentValue === "boolean" ? "" : currentValue}
            className={styles.input}
            onChange={(e) =>
              handleUpdate(
                field.name,
                e.target.value,
                type,
                updateNewItem,
                updateItem,
                items,
                editingId
              )
            }
          />
        );

      case "Select":
        return (
          <div className={`${styles.input} py-0 px-1`}>
            <Select
              value={String(currentValue)}
              options={field.options || []}
              onSelect={(value) =>
                handleUpdate(
                  field.name,
                  value,
                  type,
                  updateNewItem,
                  updateItem,
                  items,
                  editingId
                )
              }
            />
          </div>
        );

      case "Checkbox":
        return (
          <Checkbox
            checked={currentValue as CheckedState}
            onCheckedChange={(value) =>
              handleUpdate(
                field.name,
                value,
                type,
                updateNewItem,
                updateItem,
                items,
                editingId
              )
            }
          />
        );

      default:
        return null;
    }
  };

  return (
    <div
      key={field.name}
      className="flex flex-col items-start justify-center gap-2"
    >
      <label className={styles.label} htmlFor={field.name}>
        {field.header}
      </label>
      {renderField()}
    </div>
  );
};
