# Design: Multi-Repo Dashboard

## Files changed

| File | Action |
|---|---|
| `packages/parser/src/types.ts` | Add `project?: string` field to `Change` |
| `packages/server/src/index.ts` | Instantiate one watcher per project |
| `packages/server/src/routes.ts` | Add `?project=` param and `/api/changes/all` |
| `packages/server/src/ws.ts` | Tag events with `project` field |
| `packages/cli/src/config.ts` | Parse `projects` array from config |
| `packages/board/src/types.ts` | Mirror `project?` field |
| `packages/board/src/hooks/useChanges.ts` | Accept active project state |
| `packages/board/src/components/Sidebar.tsx` | Add project switcher dropdown |
| `packages/board/src/components/ProjectSwitcher.tsx` | New |

---

## Parser — types

```ts
interface Change {
  // ... existing fields ...
  project?: string;  // set by server when multi-project mode is active
}
```

---

## Server — multi-watcher setup (`index.ts`)

```ts
interface ProjectConfig {
  name: string;
  path: string;
}

export async function startServer(rootDir: string, config: Config, boardDistPath?: string) {
  const projects: ProjectConfig[] = config.projects?.length
    ? config.projects
    : [{ name: "default", path: rootDir }];

  const watchers = new Map<string, ReturnType<typeof createWatcher>>();

  for (const project of projects) {
    const watcher = createWatcher(project.path, config, (event) => {
      // tag event with project name
      const tagged = { ...event, project: project.name };
      broadcastToClients(tagged);
    });
    watchers.set(project.name, watcher);
  }
  // ...
}
```

---

## Server — routes

```ts
// GET /api/changes?project=name  — single project (default: first project)
// GET /api/changes/all           — all projects merged

app.get("/api/changes/all", async () => {
  return [...watchers.entries()].flatMap(([name, w]) =>
    w.getAll().map((c) => ({ ...c, project: name }))
  );
});
```

---

## Board — ProjectSwitcher (`ProjectSwitcher.tsx`)

Dropdown in the sidebar header. Only rendered when `projects.length > 1`.

```tsx
// Options: project names + "All projects"
// Selecting updates activeProject state in App
// activeProject === null means "All projects"
```

---

## Board — Sidebar header

```tsx
<div className="px-4 pt-4 pb-2 flex items-center justify-between">
  <h1 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Harness</h1>
  {multiProject && <ProjectSwitcher projects={projects} active={activeProject} onChange={setActiveProject} />}
</div>
```

In "All projects" mode, each change row shows a small project badge:

```tsx
<span className="text-[9px] px-1 py-0.5 rounded bg-zinc-800 text-zinc-500">{change.project}</span>
```

---

## Config changes

`packages/cli/src/config.ts` — extend `Config`:

```ts
interface ProjectEntry {
  name: string;
  path: string;
}

interface Config {
  // ... existing ...
  projects?: ProjectEntry[];
}
```

When `projects` is set, `changesDir`/`archiveDir` still apply per project (each project uses the same relative paths).
