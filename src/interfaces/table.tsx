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
  type: string;
  name: string;
  isDialogOpener?: boolean;
  isSortAble?: boolean;
  isDeletAble?: boolean;
}
