# Harness Admin — Claude Instructions

## Workflow obrigatório

Todo change deste projeto passa pelo fluxo OpenSpec:

```
proposal.md → design.md → tasks.md → archive
```

Nenhuma implementação começa sem especificação aprovada. Sempre use `/opsx:propose` antes de implementar qualquer feature, fix ou refatoração.

## Estrutura do monorepo

- `packages/parser` — núcleo compartilhado: leitura de arquivos, parsing, classificação de status
- `packages/server` — servidor Fastify com `/api/changes` e WebSocket
- `packages/board` — frontend browser (Vite + React + Tailwind)
- `packages/tui` — frontend terminal (Ink + React)
- `packages/cli` — entry point do `npx @harness/board`
- `openspec/` — specs e changes do próprio Harness

## Convenções de código

- TypeScript estrito em todos os pacotes
- Sem bibliotecas de componentes externas no board (apenas Tailwind + SVGs inline)
- Sistema de arquivos é a fonte de verdade — sem banco de dados
- pnpm workspaces para gerenciar o monorepo

## Classificação de status

| Status | Condição |
|---|---|
| `archived` | change dentro de `archiveDir` |
| `done` | 100% tasks `[x]`, fora do archive |
| `in_progress` | ao menos 1 `[x]` e 1 `[ ]` |
| `backlog` | sem `tasks.md` ou 0 tasks marcadas |
