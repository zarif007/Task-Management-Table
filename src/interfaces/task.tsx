import { IItem } from "./store";

export interface IComponentConfig {
  header: string;
  component: string;
  type?: string;
  name: string;
  options?: string[];
  isDialogOpener?: boolean;
  isSortAble?: boolean;
  isDeletAble?: boolean;
}

export type TaskStore = {
  items: IItem[];
  fieldSchema: string[];
  setFieldSchema: (schema: IComponentConfig[]) => void;
  addItem: (item: IItem) => void;
  updateItem: (
    id: number,
    field: string,
    value: string | boolean | number
  ) => void;
  deleteItems: (ids: number[]) => void;
};
