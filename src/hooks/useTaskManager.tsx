import { useState, useEffect } from "react";
import { IComponentConfig, ITask } from "@/interfaces/table";
import { getCurrentDate } from "@/utils/getCurrentDate";
import { mockData, taskPriority, taskStatus } from "@/constants/table";

const getTasksFromLocalStorage = (): ITask[] => {
  const storedTasks = localStorage.getItem("tasks");
  return storedTasks ? JSON.parse(storedTasks) : null;
};

const saveTasksToLocalStorage = (tasks: ITask[]) => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

const getFieldSchemaFromLocalStorage = () => {
  const storedFieldSchema = localStorage.getItem("fieldSchema");
  return storedFieldSchema ? JSON.parse(storedFieldSchema) : null;
};

const saveFieldSchemaToLocalStorage = (fieldSchema: IComponentConfig[]) => {
  localStorage.setItem("fieldSchema", JSON.stringify(fieldSchema));
};

export const useTaskManager = () => {
  const [tasks, setTasks] = useState<ITask[]>(() => {
    const storedTasks = getTasksFromLocalStorage();
    return storedTasks || mockData;
  });

  const [fieldSchema, setFieldSchema] = useState<IComponentConfig[]>(() => {
    const storedFieldSchema = getFieldSchemaFromLocalStorage();
    return (
      storedFieldSchema || [
        {
          header: "Title",
          component: "Input",
          type: "text",
          name: "title",
          isDialogOpener: true,
          isSortAble: true,
          isDeletAble: false,
        },
        {
          header: "Priority",
          component: "Select",
          options: taskPriority,
          name: "priority",
          isDialogOpener: false,
          isSortAble: false,
          isDeletAble: false,
        },
        {
          header: "Status",
          component: "Select",
          options: taskStatus,
          name: "status",
          isDialogOpener: false,
          isSortAble: false,
          isDeletAble: false,
        },
      ]
    );
  });

  useEffect(() => {
    saveTasksToLocalStorage(tasks);
  }, [tasks]);

  useEffect(() => {
    saveFieldSchemaToLocalStorage(fieldSchema);
  }, [fieldSchema]);

  const [newTask, setNewTask] = useState<ITask>({
    id: 0,
    title: "",
    priority: "none",
    status: "not_started",
    createdAt: "",
  });

  const [editingIndex, setEditingIndex] = useState<number>(0);

  const updateNewTask = (field: string, value: string | number | boolean) => {
    setNewTask((prev) => ({ ...prev, [field]: value }));
  };

  const updateTask = (
    id: number,
    field: string,
    value: string | boolean | number
  ) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, [field]: value } : task))
    );
  };

  const deleteTask = (selectedRows: number[]) => {
    setTasks((prev) =>
      prev.filter((_, index) => !selectedRows.includes(index))
    );
  };

  const addTask = () => {
    if (newTask.title) {
      setTasks((prev) => [
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

  return {
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
  };
};
