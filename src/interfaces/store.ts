import { IComponentConfig } from "./task";

export interface IItem {
  id: number;
  [key: string]: string | boolean | number;
}

export interface ItemStore {
  items: IItem[];
  fieldSchema: IComponentConfig[];
  newItem: IItem;
  editingIndex: number;
  setEditingIndex: (index: number) => void;
  updateNewItem: (field: keyof IItem, value: string | boolean | number) => void;
  updateItem: (
    id: number,
    field: keyof IItem,
    value: string | boolean | number
  ) => void;
  deleteItem: (selectedRows: number[]) => void;
  addItem: () => void;
  setFieldSchema: (fieldSchema: IComponentConfig[]) => void;
  _hasHydrated: boolean;
  setHasHydrated: (hasHydrated: boolean) => void;
}
