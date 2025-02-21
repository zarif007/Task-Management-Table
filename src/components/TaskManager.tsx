"use client";

import React, { useCallback } from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import Table from "./ui/table/Table";
import {
  Edit,
  Kanban as KanbanIcon,
  Pickaxe,
  Plus,
  Table2,
} from "lucide-react";
import DialogForm from "./ui/Dialog.form";
import { fieldMappingForDialog } from "./FieldMappings";
import { useItemStore } from "@/store/taskManagement";
import Kanban from "./ui/Kanban";
import { taskPriority } from "@/constants/table";

const TaskManager = () => {
  const store = useItemStore();
  const schemaForDialog = useCallback(
    (type: "create" | "update", id?: number) => {
      return {
        title: `${type === "create" ? "Create" : "Edit"} a Task`,
        handleOnSave:
          type === "create"
            ? store.addItem
            : () => store.updateItem(id!, "", ""),
        fields: store.fieldSchema.map((field) =>
          fieldMappingForDialog({
            field,
            type,
            newItem: store.newItem,
            items: store.items,
            editingId: store.editingId,
            updateNewItem: store.updateNewItem,
            updateItem: store.updateItem,
          })
        ),
      };
    },
    [store]
  );

  const editingDialog = useCallback(
    (id: number) => (
      <DialogForm schema={schemaForDialog("update", id)}>
        <button
          className="flex items-center justify-center gap-1 text-gray-400 bg-gray-900 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer m-1"
          onClick={() => store.setEditingId(id)}
        >
          <p>Open</p>
          <Edit className="w-4 h-4" />
        </button>
      </DialogForm>
    ),
    [store, schemaForDialog]
  );

  return (
    <div className="h-screen max-w-7xl mx-auto flex flex-col justify-center px-4 my-12 md:my-24">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-300 flex items-center gap-2 my-4">
          <Pickaxe className="w-8 h-8 text-secondary" /> Tasks
        </h1>
        <DialogForm schema={schemaForDialog("create")}>
          <button className="bg-secondary px-3 py-1 text-black font-semibold rounded-md flex items-center gap-2">
            <Plus className="w-4 h-4" /> Create Task
          </button>
        </DialogForm>
      </div>

      <TabGroup>
        <TabList className="flex space-x-1 rounded-xl p-1">
          {[
            { name: "Table", icon: <Table2 /> },
            { name: "Kanban", icon: <KanbanIcon /> },
          ].map((item) => (
            <Tab
              key={item.name}
              className={({ selected }) =>
                `flex items-center justify-center rounded-md py-2 px-4 text-md font-bold
               ${
                 selected
                   ? "bg-secondary text-black shadow"
                   : "bg-gray-900 text-white"
               }`
              }
            >
              {item.icon}
              <p>{item.name}</p>
            </Tab>
          ))}
        </TabList>
        <TabPanels className="mt-2">
          <TabPanel className={`rounded-xl`}>
            <Table store={store} editingDialog={editingDialog} />
          </TabPanel>
          <TabPanel className={`rounded-xl`}>
            <Kanban
              basedOn="priority"
              columns={taskPriority}
              store={store}
              editingDialog={editingDialog}
              schemaForDialog={schemaForDialog}
            />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
};

export default TaskManager;
