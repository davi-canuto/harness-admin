import { readdirSync, existsSync, statSync } from "fs";
import { join, basename } from "path";
import { parseTasks } from "./parser.js";
import { classifyStatus } from "./classifier.js";
import type { Change, Config } from "./types.js";

export function readChanges(rootDir: string, config: Config): Change[] {
  const changesPath = join(rootDir, config.changesDir);
  const archivePath = join(rootDir, config.archiveDir);

  if (!existsSync(changesPath)) {
    return [];
  }

  const changes: Change[] = [];

  function scanDir(dir: string) {
    let entries: string[];
    try {
      entries = readdirSync(dir);
    } catch {
      return;
    }

    for (const entry of entries) {
      const fullPath = join(dir, entry);
      try {
        const stat = statSync(fullPath);
        if (!stat.isDirectory()) continue;
      } catch {
        continue;
      }

      const tasksPath = join(fullPath, config.tasksFile);
      const proposalPath = join(fullPath, config.proposalFile);
      const designPath = join(fullPath, config.designFile);

      const tasks = parseTasks(tasksPath);
      const completed = tasks.filter((t) => t.completed).length;
      const status = classifyStatus(fullPath, archivePath, tasks);

      changes.push({
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
      });

      // recurse into subdirectories (e.g. archive/)
      scanDir(fullPath);
    }
  }

  scanDir(changesPath);
  return changes;
}
