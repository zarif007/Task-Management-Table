import { useState } from "react";
import { ITask } from "@/interfaces/table";
import { getCurrentDate } from "@/utils/getCurrentDate";

export const useTaskManager = (initialTasks: ITask[]) => {
  const [tasks, setTasks] = useState<ITask[]>(initialTasks);
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

  const updateTask = (id: number, field: keyof ITask, value: string) => {
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
