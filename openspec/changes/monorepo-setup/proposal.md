# Proposal: Monorepo Setup

## Problem

The Harness Admin project needs a foundation before any package can be built: a workspace configuration that ties all packages together, shared TypeScript settings, root-level tooling, and the OpenSpec directory structure that the tool itself will later visualize.

Without this scaffolding, each package would be an isolated island with no shared conventions and no way to reference each other via `workspace:*` protocol.

## Proposed Solution

Initialize a pnpm workspace monorepo with:

- `pnpm-workspace.yaml` declaring all packages under `packages/*`
- A root `package.json` with workspace-level scripts (`build`, `dev`, `typecheck`, `lint`)
- A shared `tsconfig.base.json` with strict TypeScript settings used by every package
- `harness.config.json` with default configuration values (changesDir, archiveDir, port, etc.)
- `CLAUDE.md` with codebase instructions for the AI assistant
- `AGENTS.md` with the mandatory OpenSpec workflow rules
- `openspec/changes/` and `openspec/changes/archive/` as empty tracked directories
- `openspec/specs/` for archived specs

## Out of Scope

Individual package implementations — each package is a separate change.
