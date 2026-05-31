# Harness Admin — Workflow OpenSpec

Este projeto usa **OpenSpec v1.3.1** como framework SDD. Toda implementação é precedida por especificação.

## Fluxo obrigatório

1. `/opsx:propose "descrição"` — cria `proposal.md`, `design.md` e `tasks.md` no change ativo
2. Revisar e aprovar os artefatos antes de implementar
3. `/opsx:apply` — implementa as tasks do change ativo seguindo o design
4. `/opsx:archive` — fecha o change e move para `openspec/changes/archive/`

## Regras

- Nenhum código é escrito sem um change ativo com `tasks.md`
- O diretório `openspec/changes/` contém apenas changes em andamento
- Changes arquivadas ficam em `openspec/changes/archive/`
- Cada change tem exatamente: `proposal.md`, `design.md`, `tasks.md`

## Estrutura de um change

```
openspec/changes/
└── nome-do-change/
    ├── proposal.md   ← o quê e por quê
    ├── design.md     ← como implementar
    └── tasks.md      ← checklist de implementação
```
