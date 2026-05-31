# Design: CLI Package (Entry Point)

## Package Identity

```
name: @harness/board   ← npm package name (published identifier)
bin: { "harness": "./dist/index.js" }
build: tsup → dist/index.js with #!/usr/bin/env node banner
```

## Config Loading (`src/config.ts`)

```
loadConfig(configPath?)
  1. Resolve target: configPath ?? cwd/harness.config.json
  2. If file does not exist → return DEFAULTS
  3. Parse JSON → spread DEFAULTS with parsed values
  4. On parse error → warn to console, return DEFAULTS
```

Defaults:
```ts
{
  changesDir: "openspec/changes",
  archiveDir: "openspec/changes/archive",
  tasksFile: "tasks.md",
  proposalFile: "proposal.md",
  designFile: "design.md",
  port: 3000,
}
```

## Entry Point (`src/index.ts`)

```
1. Parse argv: --tui flag, --config <path> flag
2. loadConfig(configPath)
3. await startServer(cwd, config)
4. if --tui: await startTUI(`http://localhost:${port}`)
   else:     dynamic import("open") → open browser URL
```

Dynamic import of `open` avoids bundling it into the output via tsup's external list.

## tsup Config

```ts
{
  entry: ["src/index.ts"],
  format: ["esm"],
  banner: { js: "#!/usr/bin/env node" },
  external: ["@harness/server", "@harness/tui"],
}
```

`@harness/server` and `@harness/tui` are marked external — they ship as workspace dependencies and are resolved at runtime from `node_modules`.

## Dependencies

- `@harness/server` (workspace) — server startup
- `@harness/tui` (workspace) — TUI rendering
- `open` — cross-platform browser opener
