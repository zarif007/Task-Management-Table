import { JSX } from "react";

export interface ITask {
  id: number;
  title: string;
  priority: string;
  status: string;
  createdAt?: string;
}

export interface ITableHeaders {
  label: string;
  icon: JSX.Element;
}
