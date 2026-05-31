import { readdirSync, existsSync, statSync } from "fs";
import { join, resolve } from "path";
import { parseTasks } from "./parser.js";
import { classifyStatus } from "./classifier.js";
import type { Change, Config } from "./types.js";

function buildLeafChange(
  entry: string,
  fullPath: string,
  archivePath: string,
  config: Config,
  isChild = false
): Change {
  const tasksPath = join(fullPath, config.tasksFile);
  const proposalPath = join(fullPath, config.proposalFile);
  const designPath = join(fullPath, config.designFile);

  const tasks = parseTasks(tasksPath);
  const completed = tasks.filter((t) => t.completed).length;
  const status = classifyStatus(fullPath, archivePath, tasks);

  return {
    id: isChild ? `${entry}__child` : entry,
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
    ...(isChild ? { isChild: true } : {}),
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

function buildParentChange(
  entry: string,
  fullPath: string,
  archivePath: string,
  config: Config
): Change {
  const proposalPath = join(fullPath, config.proposalFile);
  const designPath = join(fullPath, config.designFile);

  const childDirs = listDirs(fullPath).filter((child) =>
    existsSync(join(fullPath, child, config.tasksFile))
  );

  const children: Change[] = childDirs.map((child) =>
    buildLeafChange(child, join(fullPath, child), archivePath, config, true)
  );

  const totalTasks = children.reduce((sum, c) => sum + c.totalTasks, 0);
  const completedTasks = children.reduce((sum, c) => sum + c.completedTasks, 0);
  const syntheticTasks = children.flatMap((c) => c.tasks);
  const status = classifyStatus(fullPath, archivePath, syntheticTasks);

  return {
    id: entry,
    name: entry,
    path: fullPath,
    status,
    tasks: [],
    totalTasks,
    completedTasks,
    progress: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
    hasProposal: existsSync(proposalPath),
    hasDesign: existsSync(designPath),
    hasTasks: false,
    children,
  };
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
      for (const archivedEntry of listDirs(fullPath)) {
        changes.push(
          buildLeafChange(archivedEntry, join(fullPath, archivedEntry), archivePath, config)
        );
      }
      continue;
    }

    const hasOwnTasks = existsSync(join(fullPath, config.tasksFile));
    const childrenWithTasks = listDirs(fullPath).filter((child) =>
      existsSync(join(fullPath, child, config.tasksFile))
    );

    if (!hasOwnTasks && childrenWithTasks.length > 0) {
      changes.push(buildParentChange(entry, fullPath, archivePath, config));
    } else {
      changes.push(buildLeafChange(entry, fullPath, archivePath, config));
    }
  }

  return changes;
}
