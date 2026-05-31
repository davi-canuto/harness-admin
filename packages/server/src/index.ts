import { createRequire } from "module";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { existsSync } from "fs";
import Fastify from "fastify";
import FastifyStatic from "@fastify/static";
import FastifyWebSocket from "@fastify/websocket";
import { createWatcher } from "@harness/parser";
import type { Config, WatcherEvent } from "@harness/parser";
import { registerRoutes } from "./routes.js";
import { registerWebSocket } from "./ws.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function startServer(rootDir: string, config: Config, boardDistPath?: string) {
  const eventListeners: Array<(event: WatcherEvent) => void> = [];

  const watcher = createWatcher(rootDir, config, (event) => {
    for (const listener of eventListeners) {
      listener(event);
    }
  });

  const app = Fastify({ logger: false });
  await app.register(FastifyWebSocket);

  app.addHook("onSend", async (_req, reply) => {
    reply.header("Access-Control-Allow-Origin", "*");
  });

  app.options("*", async (_req, reply) => {
    reply.header("Access-Control-Allow-Origin", "*");
    reply.header("Access-Control-Allow-Methods", "GET,OPTIONS");
    reply.header("Access-Control-Allow-Headers", "Content-Type");
    reply.send();
  });

  registerRoutes(app, watcher);
  registerWebSocket(app, watcher, (cb) => eventListeners.push(cb));

  // Serve the board SPA — caller provides the path, or fall back to dev layout
  const boardDist = boardDistPath ?? resolve(__dirname, "../../../board/dist");
  if (existsSync(boardDist)) {
    await app.register(FastifyStatic, {
      root: boardDist,
      prefix: "/",
      // fallback to index.html for SPA routing
      index: "index.html",
    });
    app.setNotFoundHandler((_req, reply) => {
      reply.sendFile("index.html");
    });
  }

  await app.listen({ port: config.port, host: "127.0.0.1" });
  console.log(`Harness server running on http://localhost:${config.port}`);

  return { app, watcher };
}
