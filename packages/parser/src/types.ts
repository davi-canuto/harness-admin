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

export interface ProjectEntry {
  name: string;
  path: string;
  changesDir?: string;
  archiveDir?: string;
  tasksFile?: string;
  proposalFile?: string;
  designFile?: string;
}

export interface Config {
  changesDir: string;
  archiveDir: string;
  tasksFile: string;
  proposalFile: string;
  designFile: string;
  port: number;
  projects?: ProjectEntry[];
}

export type WatcherEvent =
  | { type: "change_added"; change: Change }
  | { type: "change_updated"; change: Change }
  | { type: "change_removed"; id: string };
