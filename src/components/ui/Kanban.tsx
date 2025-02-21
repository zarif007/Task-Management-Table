import React, { useState } from "react";
import { IItemStore } from "@/interfaces/store";
import DialogForm from "./Dialog.form";
import { Trash2 } from "lucide-react";

interface KanbanProps {
  basedOn: string;
  columns: string[];
  store: IItemStore;
  editingDialog: (id: number, opacity: number) => React.JSX.Element;
  schemaForDialog: (
    type: "create" | "update",
    id?: number
  ) => {
    title: string;
    handleOnSave: () => void;
    fields: React.JSX.Element[];
  };
}

const Kanban: React.FC<KanbanProps> = ({
  basedOn,
  columns,
  store,
  editingDialog,
  schemaForDialog,
}) => {
  const { items, updateItem, deleteItem, updateNewItem } = store;
  const [draggedItemId, setDraggedItemId] = useState<number | null>(null);
  const [dragOverColumnId, setDragOverColumnId] = useState<string | null>(null);
  const [dragOverItemId, setDragOverItemId] = useState<number | null>(null);
  const [hoveredItemId, setHoveredItemId] = useState<number | null>(null); // Track hovered item

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: number) => {
    e.dataTransfer.setData("text/plain", String(id));
    setDraggedItemId(id);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, newValue: string) => {
    e.preventDefault();
    const itemId = Number(e.dataTransfer.getData("text/plain"));
    const targetItemId = e.currentTarget.dataset.itemId;

    if (targetItemId) {
      const updatedItems = reorderItems(items, itemId, Number(targetItemId));
      store.items = updatedItems;
    } else {
      updateItem(itemId, basedOn, newValue);
    }

    setDraggedItemId(null);
    setDragOverColumnId(null);
    setDragOverItemId(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const itemId = e.currentTarget.dataset.itemId;
    if (itemId) {
      setDragOverItemId(Number(itemId));
    }
  };

  const handleColumnDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    cell: string
  ) => {
    e.preventDefault();
    setDragOverColumnId(cell);
  };

  const handleDragLeave = () => {
    setDragOverItemId(null);
  };

  const handleColumnDragLeave = () => {
    setDragOverColumnId(null);
  };

  const reorderItems = (
    items: typeof store.items,
    draggedId: number,
    targetId: number
  ) => {
    const draggedItem = items.find((item) => item.id === draggedId);
    const targetItem = items.find((item) => item.id === targetId);

    if (
      !draggedItem ||
      !targetItem ||
      draggedItem[basedOn] !== targetItem[basedOn]
    ) {
      return items;
    }

    const newItems = items.filter((item) => item.id !== draggedId);
    const targetIndex = newItems.findIndex((item) => item.id === targetId);
    newItems.splice(targetIndex, 0, draggedItem);
    return newItems;
  };

  return (
    <div className="overflow-x-auto whitespace-nowrap py-4">
      <div className="inline-flex gap-2 items-start">
        {columns.map((cell) => (
          <div
            key={cell}
            onDrop={(e) => handleDrop(e, cell)}
            onDragOver={(e) => handleColumnDragOver(e, cell)}
            onDragLeave={handleColumnDragLeave}
            className={`w-[280px] min-w-[280px] p-4 border-2 rounded-md transition-all duration-200 ease-in-out ${
              dragOverColumnId === cell ? "border-secondary" : "border-gray-800"
            }`}
          >
            <h2 className="text-lg font-bold mb-4">{cell}</h2>
            {items
              .filter((item) => item[basedOn] === cell)
              .map((item) => (
                <div
                  key={item.id}
                  data-item-id={item.id}
                  className={`relative text-white bg-gray-800 font-semibold text-sm p-3 my-2 cursor-move rounded-md transform transition-all duration-200 ease-in-out ${
                    draggedItemId === item.id
                      ? "opacity-50"
                      : dragOverItemId === item.id
                      ? "border-2 border-secondary translate-y-1"
                      : ""
                  }`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item.id)}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, cell)}
                  onMouseEnter={() => setHoveredItemId(item.id)}
                  onMouseLeave={() => setHoveredItemId(null)}
                >
                  {Object.entries(item)
                    .slice(1, 4)
                    .map(([key, value]) => (
                      <div
                        key={key}
                        className="capitalize break-all overflow-wrap-break-word whitespace-normal w-full"
                      >
                        <span className="font-bold text-gray-500">{key}:</span>{" "}
                        {String(value)}
                      </div>
                    ))}
                  {hoveredItemId === item.id && (
                    <div className="absolute top-2 right-2 flex gap-2 bg-gray-800 p-1">
                      <button
                        onClick={() => deleteItem([item.id])}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                      {editingDialog(item.id, 100)}
                    </div>
                  )}
                </div>
              ))}
            <DialogForm schema={schemaForDialog("create")}>
              <button
                className="w-full items-center my-2 bg-secondary px-3 py-1 text-black font-semibold rounded-md"
                onClick={() => updateNewItem(basedOn, cell)}
              >
                Create Task
              </button>
            </DialogForm>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Kanban;
