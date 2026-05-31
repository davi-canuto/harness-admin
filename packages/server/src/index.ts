import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { existsSync } from "fs";
import Fastify from "fastify";
import FastifyStatic from "@fastify/static";
import FastifyWebSocket from "@fastify/websocket";
import { createWatcher } from "@harness/parser";
import type { Config, WatcherEvent, ProjectEntry } from "@harness/parser";
import { registerRoutes } from "./routes.js";
import { registerWebSocket } from "./ws.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

export type { Config };

export async function startServer(rootDir: string, config: Config, boardDistPath?: string) {
  const projects: ProjectEntry[] = config.projects?.length
    ? config.projects
    : [{ name: "default", path: rootDir }];

  const eventListeners: Array<(event: WatcherEvent & { project?: string }) => void> = [];

  const watchers = new Map<string, ReturnType<typeof createWatcher>>();
  const projectConfigs = new Map<string, Config>();

  for (const project of projects) {
    // merge global config with per-project overrides
    const projectConfig: Config = {
      ...config,
      ...(project.changesDir  && { changesDir:  project.changesDir  }),
      ...(project.archiveDir  && { archiveDir:  project.archiveDir  }),
      ...(project.tasksFile   && { tasksFile:   project.tasksFile   }),
      ...(project.proposalFile && { proposalFile: project.proposalFile }),
      ...(project.designFile  && { designFile:  project.designFile  }),
    };
    projectConfigs.set(project.name, projectConfig);
    const watcher = createWatcher(project.path, projectConfig, (event) => {
      const tagged = projects.length > 1
        ? { ...event, project: project.name }
        : event;
      for (const listener of eventListeners) listener(tagged as WatcherEvent & { project?: string });
    });
    watchers.set(project.name, watcher);
  }

  const app = Fastify({ logger: false });
  await app.register(FastifyWebSocket);

  app.addHook("onSend", async (_req, reply) => {
    reply.header("Access-Control-Allow-Origin", "*");
  });

  app.options("*", async (_req, reply) => {
    reply.header("Access-Control-Allow-Origin", "*");
    reply.header("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
    reply.header("Access-Control-Allow-Headers", "Content-Type");
    reply.send();
  });

  registerRoutes(app, watchers, rootDir, config, projects, projectConfigs);
  registerWebSocket(app, watchers, (cb) => eventListeners.push(cb), projects);

  const boardDist = boardDistPath ?? resolve(__dirname, "../../../board/dist");
  if (existsSync(boardDist)) {
    await app.register(FastifyStatic, {
      root: boardDist,
      prefix: "/",
      index: "index.html",
    });
    app.setNotFoundHandler((_req, reply) => {
      reply.sendFile("index.html");
    });
  }

  await app.listen({ port: config.port, host: "127.0.0.1" });
  console.log(`Harness server running on http://localhost:${config.port}`);

  return { app, watchers };
}
