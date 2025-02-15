"use client";

import React, { useState } from "react";
import Table from "./ui/Table";
import { Edit, Pickaxe, Plus } from "lucide-react";
import { ITask } from "@/interfaces/table";
import {
  mockData,
  tableHeaders,
  taskPriority,
  taskStatus,
} from "@/constants/table";
import Select from "./ui/Select";
import DialogForm from "./ui/Dialog.form";
import { getCurrentDate } from "@/utils/getCurrentDate";

const styles = {
  input:
    "w-full text-primary bg-gray-900 rounded-md border-none h-full focus:outline-none p-4 font-semibold",
  label: "text-primary font-semibold text-sm",
};

const TaskManagementTable = () => {
  const [data, setData] = useState<ITask[]>(mockData);
  const [newTask, setNewTask] = useState<ITask>({
    id: 0,
    title: "",
    priority: "none",
    status: "not_started",
    createdAt: "",
  });

  const handleUpdateNewTask = (field: keyof ITask, value: string) => {
    setNewTask((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdateDataFromModal = (
    index: number,
    field: keyof ITask,
    value: string
  ) => {
    setData((prev) =>
      prev.map((task, i) => (i === index ? { ...task, [field]: value } : task))
    );
  };

  const handleUpdateDataInline = (
    id: number,
    field: keyof ITask,
    value: string
  ) => {
    setData((prev) =>
      prev.map((task) => (task.id === id ? { ...task, [field]: value } : task))
    );
  };

  const handleAddNewTask = () => {
    if (newTask.title) {
      setData((prev) => [
        {
          ...newTask,
          id: prev.length + 1,
          createdAt: getCurrentDate(),
        },
        ...prev,
      ]);

      setNewTask({
        id: 0,
        title: "",
        priority: "none",
        status: "not_started",
        createdAt: "",
      });
    }
  };

  const schemaForDialog = {
    title: `Create a Task`,
    handleOnSave: handleAddNewTask,
    components: [
      <div key="title">
        <label className={styles.label} htmlFor="title">
          Title
        </label>
        <input
          value={newTask.title}
          className={styles.input}
          onChange={(event) => handleUpdateNewTask("title", event.target.value)}
        />
      </div>,
      <div key="priority">
        <label className={styles.label} htmlFor="priority">
          Priority
        </label>
        <div className={`${styles.input} py-0 px-1`}>
          <Select
            defaultValue={newTask.priority}
            options={taskPriority}
            onSelect={(value) => handleUpdateNewTask("priority", value)}
          />
        </div>
      </div>,
      <div key="status">
        <label className={styles.label} htmlFor="status">
          Status
        </label>
        <div className={`${styles.input} py-0 px-1`}>
          <Select
            defaultValue={newTask.status}
            options={taskStatus}
            onSelect={(value) => handleUpdateNewTask("status", value)}
          />
        </div>
      </div>,
    ],
  };

  const formattedFieldsForTable = data.map((item, index) => [
    <div className="flex items-center justify-between group w-full">
      <input
        value={item.title}
        onChange={(e) =>
          handleUpdateDataInline(item.id, "title", e.target.value)
        }
        className="w-full text-primary bg-transparent border-none h-full focus:outline-none p-4"
      />
      <button className="flex items-center justify-center gap-1 text-gray-400 bg-gray-900 text-sm opacity-0 group-hover:opacity-100 cursor-pointer m-1">
        <p>Open</p>
        <Edit className="w-4 h-4" />
      </button>
    </div>,
    <Select
      defaultValue={item.priority}
      options={taskPriority}
      onSelect={(value) => handleUpdateDataInline(item.id, "priority", value)}
    />,
    <Select
      defaultValue={item.status}
      options={taskStatus}
      onSelect={(value) => handleUpdateDataInline(item.id, "status", value)}
    />,
    <div className="p-3.5">{item.createdAt ?? "February 14, 2025"}</div>,
  ]);

  return (
    <div className="h-screen max-w-7xl mx-auto flex flex-col justify-center my-12 md:my-24">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-300 flex items-center gap-2 my-4">
          <Pickaxe className="w-8 h-8 text-secondary" /> Tasks
        </h1>
        <DialogForm schema={schemaForDialog}>
          <button className="bg-secondary px-3 py-1 text-black font-semibold rounded-md flex items-center gap-2">
            <Plus className="w-4 h-4" /> Create Task
          </button>
        </DialogForm>
      </div>
      <Table headers={tableHeaders} formattedFields={formattedFieldsForTable} />
    </div>
  );
};

export default TaskManagementTable;
