import React, { useState } from "react";
import { taskPriority } from "@/constants/table";
import { IItemStore } from "@/interfaces/store";

interface KanbanProps {
  basedOn: string;
  columns: string[];
  store: IItemStore;
}

const Kanban: React.FC<KanbanProps> = ({ basedOn, columns, store }) => {
  const { items, updateItem } = store;
  const [draggedItemId, setDraggedItemId] = useState<number | null>(null);
  const [dragOverColumnId, setDragOverColumnId] = useState<string | null>(null);
  const [dragOverItemId, setDragOverItemId] = useState<number | null>(null);

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
              dragOverColumnId === cell ? "border-blue-950" : "border-gray-800"
            }`}
          >
            <h2 className="text-lg font-bold mb-4">{cell}</h2>
            {items
              .filter((item) => item[basedOn] === cell)
              .map((item) => (
                <div
                  key={item.id}
                  data-item-id={item.id}
                  className={`text-white bg-gray-800 font-semibold text-sm p-3 my-2 cursor-move rounded-md transform transition-all duration-200 ease-in-out ${
                    draggedItemId === item.id
                      ? "opacity-50 scale-95"
                      : dragOverItemId === item.id
                      ? "border-2 border-blue-500 translate-y-1"
                      : ""
                  }`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item.id)}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, cell)}
                >
                  <h3 className="font-bold">{item.title}</h3>
                  <p>Priority: {item.priority}</p>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Kanban;
