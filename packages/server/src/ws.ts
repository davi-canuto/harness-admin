import type { FastifyInstance } from "fastify";
import type { WatcherEvent, createWatcher, ProjectEntry } from "@harness/parser";

type Watcher = ReturnType<typeof createWatcher>;
type Watchers = Map<string, Watcher>;

export function registerWebSocket(
  app: FastifyInstance,
  watchers: Watchers,
  onEvent: (cb: (event: WatcherEvent & { project?: string }) => void) => void,
  projects: ProjectEntry[]
) {
  const clients = new Set<import("ws").WebSocket>();
  const multi = projects.length > 1;

  app.get("/ws", { websocket: true }, (socket) => {
    clients.add(socket);

    // send snapshot: all changes across all watchers
    const allChanges = [...watchers.entries()].flatMap(([name, w]) =>
      w.getAll().map((c) => (multi ? { ...c, project: name } : c))
    );
    socket.send(JSON.stringify({ type: "snapshot", changes: allChanges }));
    socket.on("close", () => clients.delete(socket));
  });

  onEvent((event) => {
    const payload = JSON.stringify(event);
    for (const client of clients) {
      if (client.readyState === 1) client.send(payload);
    }
  });
}
