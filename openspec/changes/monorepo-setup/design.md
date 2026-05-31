# Design: Monorepo Setup

## Workspace Configuration

`pnpm-workspace.yaml` declares the packages glob and allows esbuild build scripts (required by tsup):

```yaml
packages:
  - "packages/*"
allowBuilds:
  esbuild: true
```

## Root package.json

Private workspace root. Scripts delegate to `pnpm -r` (recursive) or `pnpm --filter`:

```json
{
  "name": "harness-admin",
  "private": true,
  "scripts": {
    "build": "pnpm -r build",
    "dev": "pnpm --filter @harness/server dev & pnpm --filter @harness/board dev",
    "typecheck": "pnpm -r typecheck",
    "lint": "pnpm -r lint"
  }
}
```

## Shared TypeScript Config

`tsconfig.base.json` — extended by every package's own `tsconfig.json`:

- `target: ES2022`, `module: NodeNext`, `moduleResolution: NodeNext`
- `strict: true`, `declaration: true`, `declarationMap: true`, `sourceMap: true`
- `esModuleInterop: true`, `resolveJsonModule: true`, `skipLibCheck: true`

## Default Config File

`harness.config.json` ships as an example and as the defaults reference:

```json
{
  "changesDir": "openspec/changes",
  "archiveDir": "openspec/changes/archive",
  "tasksFile": "tasks.md",
  "proposalFile": "proposal.md",
  "designFile": "design.md",
  "port": 3000
}
```

## OpenSpec Directory Structure

```
openspec/
├── changes/
│   ├── .gitkeep
│   └── archive/
│       └── .gitkeep
└── specs/
    └── .gitkeep
```

Empty directories are tracked via `.gitkeep` so the structure is committed without content.

## Documentation Files

- `CLAUDE.md` — codebase guide for AI assistant: package responsibilities, status classification rules, coding conventions
- `AGENTS.md` — OpenSpec workflow rules: mandatory propose → design → tasks → archive flow
