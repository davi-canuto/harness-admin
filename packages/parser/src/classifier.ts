import { resolve } from "path";
import type { Status, Task } from "./types.js";

export function classifyStatus(
  changePath: string,
  archiveDir: string,
  tasks: Task[]
): Status {
  const absoluteArchive = resolve(archiveDir);
  const absoluteChange = resolve(changePath);

  if (absoluteChange.startsWith(absoluteArchive)) {
    return "archived";
  }

  if (tasks.length === 0) {
    return "backlog";
  }

  const completed = tasks.filter((t) => t.completed).length;

  if (completed === 0) {
    return "backlog";
  }

  if (completed === tasks.length) {
    return "done";
  }

  return "in_progress";
}
