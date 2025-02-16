"use client";

import React from "react";
import Table from "./ui/Table";
import { Edit, Pickaxe, Plus } from "lucide-react";
import { ITask } from "@/interfaces/table";
import { tableHeaders, taskPriority, taskStatus } from "@/constants/table";
import Select from "./ui/Select";
import DialogForm from "./ui/Dialog.form";
import { useTaskManager } from "@/hooks/useTaskManager";
import { getCurrentDate } from "@/utils/getCurrentDate";

const styles = {
  input:
    "w-full text-primary bg-gray-900 rounded-md border-none h-full focus:outline-none p-4 font-semibold",
  label: "text-primary font-semibold text-sm",
};

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
  } = useTaskManager();

  const fields = {
    title: {
      dialog: (type: "create" | "update") => (
        <div key="title">
          <label className={styles.label} htmlFor="title">
            Title
          </label>
          <input
            value={
              type === "create" ? newTask.title : tasks[editingIndex].title
            }
            className={styles.input}
            onChange={(event) =>
              type === "create"
                ? updateNewTask("title", event.target.value)
                : updateTask(
                    tasks[editingIndex].id,
                    "title",
                    event.target.value
                  )
            }
          />
        </div>
      ),
      table: (item: ITask, index: number) => (
        <div className="flex items-center justify-between group w-full">
          <input
            value={item.title}
            onChange={(e) => updateTask(item.id, "title", e.target.value)}
            className="w-full text-primary bg-transparent border-none h-full focus:outline-none p-4"
          />
          <DialogForm schema={schemaForDialog("update")}>
            <button
              className="flex items-center justify-center gap-1 text-gray-400 bg-gray-900 text-sm opacity-0 group-hover:opacity-100 cursor-pointer m-1"
              onClick={() => setEditingIndex(index)}
            >
              <p>Open</p>
              <Edit className="w-4 h-4" />
            </button>
          </DialogForm>
        </div>
      ),
    },
    priority: {
      dialog: (type: "create" | "update") => (
        <div key="priority">
          <label className={styles.label} htmlFor="priority">
            Priority
          </label>
          <div className={`${styles.input} py-0 px-1`}>
            <Select
              value={
                type === "create"
                  ? newTask.priority
                  : tasks[editingIndex].priority
              }
              options={taskPriority}
              onSelect={(value) =>
                type === "create"
                  ? updateNewTask("priority", value)
                  : updateTask(tasks[editingIndex].id, "priority", value)
              }
            />
          </div>
        </div>
      ),
      table: (item: ITask, index: number) => (
        <Select
          value={item.priority}
          options={taskPriority}
          onSelect={(value) => updateTask(item.id, "priority", value)}
        />
      ),
    },
    status: {
      dialog: (type: "create" | "update") => (
        <div key="status">
          <label className={styles.label} htmlFor="status">
            Status
          </label>
          <div className={`${styles.input} py-0 px-1`}>
            <Select
              value={
                type === "create" ? newTask.status : tasks[editingIndex].status
              }
              options={taskStatus}
              onSelect={(value) =>
                type === "create"
                  ? updateNewTask("status", value)
                  : updateTask(tasks[editingIndex].id, "status", value)
              }
            />
          </div>
        </div>
      ),
      table: (item: ITask, index: number) => (
        <Select
          value={item.status}
          options={taskStatus}
          onSelect={(value) => updateTask(item.id, "status", value)}
        />
      ),
    },
    createdAt: {
      table: (item: ITask) => (
        <div className="p-3.5">{item.createdAt ?? getCurrentDate()}</div>
      ),
    },
  };

  const schemaForDialog = (type: "create" | "update") => {
    return {
      title: `${type === "create" ? "Create" : "Edit"} a Task`,
      handleOnSave: type === "create" ? addTask : () => {},
      fields: [
        fields.title.dialog(type),
        fields.priority.dialog(type),
        fields.status.dialog(type),
      ],
    };
  };

  const formattedFieldsForTable = tasks.map((item: ITask, index: number) => [
    fields.title.table(item, index),
    fields.priority.table(item, index),
    fields.status.table(item, index),
    fields.createdAt.table(item),
  ]);

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
        headers={tableHeaders}
        formattedFields={formattedFieldsForTable}
        handleDelete={deleteTask}
      />
    </div>
  );
};

export default TaskManagementTable;
