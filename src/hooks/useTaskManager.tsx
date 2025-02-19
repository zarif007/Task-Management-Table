import { useState, useEffect } from "react";
import { ITask } from "@/interfaces/table";
import { getCurrentDate } from "@/utils/getCurrentDate";
import { mockData } from "@/constants/table";

const getTasksFromLocalStorage = (): ITask[] => {
  const storedTasks = localStorage.getItem("tasks");
  return storedTasks ? JSON.parse(storedTasks) : null;
};

const saveTasksToLocalStorage = (tasks: ITask[]) => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

export const useTaskManager = () => {
  const [tasks, setTasks] = useState<ITask[]>(() => {
    const storedTasks = getTasksFromLocalStorage();
    return storedTasks || mockData;
  });

  useEffect(() => {
    saveTasksToLocalStorage(tasks);
  }, [tasks]);

  const [newTask, setNewTask] = useState<ITask>({
    id: 0,
    title: "",
    priority: "none",
    status: "not_started",
    createdAt: "",
  });

  const [editingIndex, setEditingIndex] = useState<number>(0);

  const updateNewTask = (field: keyof ITask, value: string) => {
    setNewTask((prev) => ({ ...prev, [field]: value }));
  };

  const updateTask = (
    id: number,
    field: keyof ITask,
    value: string | boolean
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
  };
};
