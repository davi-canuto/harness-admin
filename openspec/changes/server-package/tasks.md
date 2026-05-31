# Tasks: Server Package

- [x] 3.1 Create `packages/server/package.json` with Fastify dependencies and build scripts
- [x] 3.2 Create `packages/server/tsconfig.json` extending `tsconfig.base.json`
- [x] 3.3 Create `packages/server/tsup.config.ts` targeting ESM (no DTS)
- [x] 3.4 Implement `src/routes.ts` — `GET /api/changes` and `GET /api/changes/:id`
- [x] 3.5 Implement `src/ws.ts` — WebSocket route with snapshot-on-connect and event fan-out
- [x] 3.6 Implement `src/index.ts` — `startServer()` wiring watcher, routes, WebSocket, and CORS
- [x] 3.7 Run `pnpm --filter @harness/server build` and confirm clean output
