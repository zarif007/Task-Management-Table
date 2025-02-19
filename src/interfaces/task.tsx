export interface ITask {
  id: number;
  title: string;
  priority: string;
  status: string;
  [key: string]: string | number | boolean;
}

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
  items: ITask[];
  fieldSchema: string[];
  setFieldSchema: (schema: string[]) => void;
  addItem: (item: ITask) => void;
  updateItem: (id: number, field: string, value: any) => void;
  deleteItems: (ids: number[]) => void;
};
