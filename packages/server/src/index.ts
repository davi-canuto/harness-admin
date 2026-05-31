import Fastify from "fastify";
import FastifyWebSocket from "@fastify/websocket";
import { createWatcher } from "@harness/parser";
import type { Config, WatcherEvent } from "@harness/parser";
import { registerRoutes } from "./routes.js";
import { registerWebSocket } from "./ws.js";

export async function startServer(rootDir: string, config: Config) {
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

  await app.listen({ port: config.port, host: "127.0.0.1" });
  console.log(`Harness server running on http://localhost:${config.port}`);

  return { app, watcher };
}
