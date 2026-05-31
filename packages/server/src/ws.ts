import type { FastifyInstance } from "fastify";
import type { WatcherEvent, createWatcher } from "@harness/parser";

type Watcher = ReturnType<typeof createWatcher>;

export function registerWebSocket(
  app: FastifyInstance,
  watcher: Watcher,
  onEvent: (cb: (event: WatcherEvent) => void) => void
) {
  const clients = new Set<import("ws").WebSocket>();

  app.get("/ws", { websocket: true }, (socket) => {
    clients.add(socket);
    socket.send(JSON.stringify({ type: "snapshot", changes: watcher.getAll() }));
    socket.on("close", () => clients.delete(socket));
  });

  onEvent((event) => {
    const payload = JSON.stringify(event);
    for (const client of clients) {
      if (client.readyState === 1) {
        client.send(payload);
      }
    }
  });
}
