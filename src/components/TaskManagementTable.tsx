"use client";

import React, { useState } from "react";
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

  const [fieldSchema, setFieldSchema] = useState([
    {
      header: "Title",
      component: "Input",
      type: "text",
      name: "title",
      style:
        "w-full text-primary bg-transparent border-none h-full focus:outline-none p-4",
      isDialogOpener: true,
      isSortAble: true,
    },
    {
      header: "Priority",
      component: "Select",
      options: taskPriority,
      name: "priority",
      isDialogOpener: true,
    },
    {
      header: "Status",
      component: "Select",
      options: taskStatus,
      name: "status",
    },
  ]);

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

  // const editingDialog = (
  //   <DialogForm schema={schemaForDialog("update")}>
  //     <button
  //       className="flex items-center justify-center gap-1 text-gray-400 bg-gray-900 text-sm opacity-0 group-hover:opacity-100 cursor-pointer m-1"
  //       onClick={() => setEditingIndex(index)}
  //     >
  //       <p>Open</p>
  //       <Edit className="w-4 h-4" />
  //     </button>
  //   </DialogForm>
  // );

  const renderInputForTable = (item: any, index: number, field: any) => {
    switch (field.component) {
      case "Input":
        return (
          <div className="flex items-center justify-between group w-full">
            <input
              type={field.type}
              value={item[field.name]}
              onChange={(e) => updateTask(item.id, field.name, e.target.value)}
              className={field.style}
            />
          </div>
        );

      case "Select":
        return (
          <div className="flex items-center justify-between group w-full">
            <Select
              value={item[field.name]}
              onSelect={(value) => updateTask(item.id, field.name, value)}
              options={field.options}
            />
          </div>
        );

      case "Checkbox":
        return (
          <div className="flex items-center justify-between group w-full">
            <input
              type="checkbox"
              checked={item[field.name]}
              onChange={(e) =>
                updateTask(item.id, field.name, e.target.checked)
              }
              className={field.style}
            />
          </div>
        );

      default:
        return <div className={styles.input} />;
    }
  };

  const formattedFieldsForTable = tasks.map((item: ITask, index: number) =>
    fieldSchema.map((field) => renderInputForTable(item, index, field))
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
        headers={tableHeaders}
        formattedFields={formattedFieldsForTable}
        handleDelete={deleteTask}
      />
    </div>
  );
};

export default TaskManagementTable;
