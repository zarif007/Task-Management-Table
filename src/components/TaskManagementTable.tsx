"use client";

import React from "react";
import Table from "./ui/table/Table";
import { Edit, Pickaxe, Plus } from "lucide-react";
import DialogForm from "./ui/Dialog.form";
import { useTaskManager } from "@/hooks/useTaskManager";
import { fieldMappingForDialog } from "./FieldMappings";

const TaskManagementTable = () => {
  const {
    tasks,
    newTask,
    editingIndex,
    setEditingIndex,
    updateNewTask,
    updateTask,
    deleteTask,
    addTask,
    fieldSchema,
    setFieldSchema,
  } = useTaskManager();

  const schemaForDialog = (type: "create" | "update") => {
    return {
      title: `${type === "create" ? "Create" : "Edit"} a Task`,
      handleOnSave: type === "create" ? addTask : () => {},
      fields: fieldSchema.map((field) =>
        fieldMappingForDialog({
          field,
          type,
          newItem: newTask,
          items: tasks,
          editingIndex,
          updateNewItem: updateNewTask,
          updateItem: updateTask,
        })
      ),
    };
  };

  const editingDialog = (index: number) => (
    <DialogForm schema={schemaForDialog("update")}>
      <button
        className="flex items-center justify-center gap-1 text-gray-400 bg-gray-900 text-sm opacity-0 group-hover:opacity-100 cursor-pointer m-1"
        onClick={() => setEditingIndex(index)}
      >
        <p>Open</p>
        <Edit className="w-4 h-4" />
      </button>
    </DialogForm>
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
      <Table
        items={tasks}
        fieldSchema={fieldSchema}
        setFieldSchema={setFieldSchema}
        handleDelete={deleteTask}
        handleUpdate={updateTask}
        editingDialog={editingDialog}
      />
    </div>
  );
};

export default TaskManagementTable;
