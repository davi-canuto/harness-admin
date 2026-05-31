export type Status = "backlog" | "in_progress" | "done" | "archived";

export interface Task {
  id: string;
  label: string;
  completed: boolean;
}

export interface Change {
  id: string;
  name: string;
  path: string;
  status: Status;
  tasks: Task[];
  totalTasks: number;
  completedTasks: number;
  progress: number;
  hasProposal: boolean;
  hasDesign: boolean;
  hasTasks: boolean;
  children?: Change[];
  isChild?: boolean;
  project?: string;
}
