import type { FastifyInstance } from "fastify";
import type { createWatcher } from "@harness/parser";

type Watcher = ReturnType<typeof createWatcher>;

export function registerRoutes(app: FastifyInstance, watcher: Watcher) {
  app.get("/api/changes", async () => {
    return watcher.getAll();
  });

  app.get<{ Params: { id: string } }>("/api/changes/:id", async (request, reply) => {
    const change = watcher.getAll().find((c) => c.id === request.params.id);
    if (!change) {
      return reply.status(404).send({ error: "Change not found" });
    }
    return change;
  });
}
