import { rename, existsSync } from "fs";
import { join, resolve } from "path";
import { promisify } from "util";
import type { FastifyInstance } from "fastify";
import type { createWatcher, Config, ProjectEntry } from "@harness/parser";

type Watcher = ReturnType<typeof createWatcher>;
type Watchers = Map<string, Watcher>;

const renameAsync = promisify(rename);

function getAllChanges(watchers: Watchers, projects: ProjectEntry[]) {
  const multi = projects.length > 1;
  return [...watchers.entries()].flatMap(([projectName, w]) =>
    w.getAll().map((c) => (multi ? { ...c, project: projectName } : c))
  );
}

function findChange(watchers: Watchers, id: string) {
  for (const watcher of watchers.values()) {
    const all = watcher.getAll();
    const found =
      all.find((c) => c.id === id) ??
      all.flatMap((c) => c.children ?? []).find((c) => c.id === id);
    if (found) return found;
  }
  return undefined;
}

export function registerRoutes(
  app: FastifyInstance,
  watchers: Watchers,
  rootDir: string,
  config: Config,
  projects: ProjectEntry[]
) {
  // GET /api/changes?project=name — single project (or default)
  app.get<{ Querystring: { project?: string } }>("/api/changes", async (request) => {
    const projectName = request.query.project;
    if (projectName) {
      const watcher = watchers.get(projectName);
      if (!watcher) return [];
      return watcher.getAll().map((c) => ({ ...c, project: projectName }));
    }
    // default: return first project (backwards compatible)
    const [firstProject, firstWatcher] = [...watchers.entries()][0];
    return firstWatcher.getAll().map((c) =>
      projects.length > 1 ? { ...c, project: firstProject } : c
    );
  });

  // GET /api/changes/all — all projects merged
  app.get("/api/changes/all", async () => {
    return getAllChanges(watchers, projects);
  });

  // GET /api/projects — list configured projects
  app.get("/api/projects", async () => {
    return projects.map((p) => p.name);
  });

  app.get<{ Params: { id: string } }>("/api/changes/:id", async (request, reply) => {
    const change = findChange(watchers, request.params.id);
    if (!change) return reply.status(404).send({ error: "Change not found" });
    return change;
  });

  app.post<{ Params: { id: string } }>("/api/changes/:id/archive", async (request, reply) => {
    const change = findChange(watchers, request.params.id);
    if (!change) return reply.status(404).send({ error: "Change not found" });
    if (change.status === "archived") return reply.status(400).send({ error: "Already archived" });

    const archivePath = resolve(join(rootDir, config.archiveDir));
    const targetPath = join(archivePath, change.name);

    if (existsSync(targetPath)) {
      return reply.status(409).send({ error: `A change named "${change.name}" already exists in archive` });
    }

    try {
      await renameAsync(change.path, targetPath);
    } catch {
      return reply.status(500).send({ error: "Failed to move change to archive" });
    }

    return { ok: true };
  });
}
