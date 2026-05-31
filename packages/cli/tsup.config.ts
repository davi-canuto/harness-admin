import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: false,
  clean: true,
  banner: { js: "#!/usr/bin/env node" },
  // inline workspace packages (not on npm), keep third-party deps external
  noExternal: ["@harness/server", "@harness/tui", "@harness/parser"],
  external: [
    "open",
    "fastify",
    "@fastify/websocket",
    "@fastify/static",
    "chokidar",
    "gray-matter",
    "ink",
    "react",
    "react-devtools-core",
    // node builtins
    "fs", "path", "url", "module", "events", "stream", "net", "http", "https",
    "os", "crypto", "buffer", "util", "assert", "child_process", "worker_threads",
  ],
});
