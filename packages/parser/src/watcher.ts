import chokidar from "chokidar";
import { join } from "path";
import { readChanges } from "./reader.js";
import type { Change, Config, WatcherEvent } from "./types.js";

type EventCallback = (event: WatcherEvent) => void;

export function createWatcher(rootDir: string, config: Config, onEvent: EventCallback) {
  const changesPath = join(rootDir, config.changesDir);
  let cache = new Map<string, Change>();

  function refresh() {
    const current = readChanges(rootDir, config);
    const currentMap = new Map(current.map((c) => [c.id, c]));

    for (const [id, change] of currentMap) {
      if (!cache.has(id)) {
        onEvent({ type: "change_added", change });
      } else {
        const prev = cache.get(id)!;
        if (JSON.stringify(prev) !== JSON.stringify(change)) {
          onEvent({ type: "change_updated", change });
        }
      }
    }

    for (const id of cache.keys()) {
      if (!currentMap.has(id)) {
        onEvent({ type: "change_removed", id });
      }
    }

    cache = currentMap;
  }

  refresh();

  const watcher = chokidar.watch(changesPath, {
    ignoreInitial: true,
    depth: 4,
  });

  watcher.on("all", () => refresh());

  return {
    close: () => watcher.close(),
    getAll: () => Array.from(cache.values()),
  };
}
