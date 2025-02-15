import { FileText, AlertTriangle, Clock, Calendar } from "lucide-react";

export const taskPriority = ["none", "low", "medium", "high", "urgent"];
export const taskStatus = ["not_started", "in_progress", "completed"];

export const tableHeaders = [
  { label: "Title", icon: <FileText className="w-4 h-4" /> },
  { label: "Priority", icon: <AlertTriangle className="w-4 h-4" /> },
  { label: "Status", icon: <Clock className="w-4 h-4" /> },
  { label: "Created At", icon: <Calendar className="w-4 h-4" /> },
];

export const mockData = [
  {
    id: 1,
    title: "Write project proposal",
    status: "in_progress",
    priority: "high",
  },
  {
    id: 2,
    title: "Fix login page bug",
    status: "not_started",
    priority: "none",
  },
  {
    id: 3,
    title: "Design homepage layout",
    status: "in_progress",
    priority: "medium",
  },
  {
    id: 4,
    title: "Update API documentation",
    status: "completed",
    priority: "medium",
  },
  {
    id: 5,
    title: "Refactor user authentication",
    status: "in_progress",
    priority: "medium",
  },
  {
    id: 6,
    title: "Optimize database queries",
    status: "not_started",
    priority: "low",
  },
  {
    id: 7,
    title: "Review PR #345",
    status: "completed",
    priority: "urgent",
  },
  {
    id: 8,
    title: "Implement dark mode",
    status: "completed",
    priority: "urgent",
  },
  {
    id: 9,
    title: "Schedule team meeting",
    status: "completed",
    priority: "low",
  },
  {
    id: 10,
    title: "Prepare monthly report",
    status: "in_progress",
    priority: "none",
  },
];
