import { readdirSync, existsSync, statSync } from "fs";
import { join, resolve } from "path";
import { parseTasks } from "./parser.js";
import { classifyStatus } from "./classifier.js";
import type { Change, Config } from "./types.js";

function buildChange(
  entry: string,
  fullPath: string,
  archivePath: string,
  config: Config
): Change {
  const tasksPath = join(fullPath, config.tasksFile);
  const proposalPath = join(fullPath, config.proposalFile);
  const designPath = join(fullPath, config.designFile);

  const tasks = parseTasks(tasksPath);
  const completed = tasks.filter((t) => t.completed).length;
  const status = classifyStatus(fullPath, archivePath, tasks);

  return {
    id: entry,
    name: entry,
    path: fullPath,
    status,
    tasks,
    totalTasks: tasks.length,
    completedTasks: completed,
    progress: tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0,
    hasProposal: existsSync(proposalPath),
    hasDesign: existsSync(designPath),
    hasTasks: existsSync(tasksPath),
  };
}

function listDirs(dir: string): string[] {
  try {
    return readdirSync(dir).filter((entry) => {
      try {
        return statSync(join(dir, entry)).isDirectory();
      } catch {
        return false;
      }
    });
  } catch {
    return [];
  }
}

export function readChanges(rootDir: string, config: Config): Change[] {
  const changesPath = join(rootDir, config.changesDir);
  const archivePath = resolve(join(rootDir, config.archiveDir));

  if (!existsSync(changesPath)) {
    return [];
  }

  const changes: Change[] = [];

  for (const entry of listDirs(changesPath)) {
    const fullPath = join(changesPath, entry);

    if (resolve(fullPath) === archivePath) {
      // this entry IS the archive dir — scan one level inside it
      for (const archivedEntry of listDirs(fullPath)) {
        changes.push(buildChange(archivedEntry, join(fullPath, archivedEntry), archivePath, config));
      }
    } else {
      changes.push(buildChange(entry, fullPath, archivePath, config));
    }
  }

  return changes;
}
