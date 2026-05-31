import { readFileSync } from "fs";
import type { Task } from "./types.js";

const TASK_PATTERN = /^[-*]\s+\[(x| )\]\s+(.+)$/im;
const TASKS_GLOBAL = /^[-*]\s+\[(x| )\]\s+(.+)$/gim;

export function parseTasks(filePath: string): Task[] {
  let content: string;
  try {
    content = readFileSync(filePath, "utf-8");
  } catch {
    return [];
  }

  const matches = content.matchAll(TASKS_GLOBAL);
  const tasks: Task[] = [];
  let index = 0;

  for (const match of matches) {
    tasks.push({
      id: String(index++),
      completed: match[1] === "x",
      label: match[2].trim(),
    });
  }

  return tasks;
}

export { TASK_PATTERN };
