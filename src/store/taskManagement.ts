import { create } from "zustand";
import { persist } from "zustand/middleware";
import { IComponentConfig } from "@/interfaces/task";
import { getCurrentDate } from "@/utils/getCurrentDate";
import { mockData, taskPriority, taskStatus } from "@/constants/table";
import { IItemStore } from "@/interfaces/store";

const defaultFieldSchema: IComponentConfig[] = [
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
];

export const useItemStore = create<IItemStore>()(
  persist(
    (set) => ({
      items: [],
      fieldSchema: defaultFieldSchema,
      newItem: {
        id: 0,
        title: "",
        priority: "none",
        status: "not_started",
        createdAt: "",
      },
      editingId: 0,
      _hasHydrated: false,
      setEditingId: (index) => set({ editingId: index }),
      updateNewItem: (field, value) =>
        set((state) => ({
          newItem: { ...state.newItem, [field]: value },
        })),
      updateItem: (id, field, value) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, [field]: value } : item
          ),
        })),
      deleteItem: (selectedRows) =>
        set((state) => ({
          items: state.items.filter((item) => !selectedRows.includes(item.id)),
        })),
      addItem: () =>
        set((state) => {
          if (!state.newItem.title) return state;
          const newItem = {
            ...state.newItem,
            id: Date.now(),
            createdAt: getCurrentDate(),
          };
          return {
            items: [newItem, ...state.items],
            newItem: {
              id: 0,
              title: "",
              priority: "none",
              status: "not_started",
              createdAt: "",
            },
          };
        }),
      setFieldSchema: (fieldSchema) => set({ fieldSchema }),
      setHasHydrated: (hasHydrated) => set({ _hasHydrated: hasHydrated }),
    }),
    {
      name: "task-storage",
      partialize: (state) => ({
        items: state.items,
        fieldSchema: state.fieldSchema,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;

        if (state.items.length === 0) {
          state.items = mockData;
        }

        state.setHasHydrated(true);
      },
    }
  )
);
