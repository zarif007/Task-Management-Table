import { taskStatus } from "@/constants/table";
import { IItemStore } from "@/interfaces/store";
import React from "react";

interface KanbanProps {
  store: IItemStore;
}

const Kanban: React.FC<KanbanProps> = ({ store }) => {
  const { items, updateItem } = store;

  const statusColumns = taskStatus;

  const handleDragStart = (e: any, id: number) => {
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDrop = (e: any, newStatus: string) => {
    e.preventDefault();
    const itemId = Number(e.dataTransfer.getData("text/plain"));
    updateItem(itemId, "status", newStatus);
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
  };

  return (
    <div className="overflow-x-auto whitespace-nowrap py-4">
      <div className="inline-flex gap-8 items-start">
        {statusColumns.map((status) => (
          <div
            key={status}
            onDrop={(e) => handleDrop(e, status)}
            onDragOver={handleDragOver}
            className="w-[280px] min-w-[280px] p-4 border-2 border-gray-800 rounded-md"
          >
            <h2 className="text-lg font-bold mb-4">{status}</h2>
            {items
              .filter((item) => item.status === status)
              .map((item) => (
                <div
                  key={item.id}
                  className="text-white bg-gray-800  font-semibold text-sm p-3 my-2 cursor-move rounded-md"
                  draggable
                  onDragStart={(e) => handleDragStart(e, item.id)}
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
