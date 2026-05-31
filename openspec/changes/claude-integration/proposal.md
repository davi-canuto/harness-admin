# Proposal: Claude Integration

## Problem

When a developer is working on a change, they often need to ask questions, think through design decisions, or get implementation help. Today they context-switch to Claude manually, paste the relevant files, and lose the context every time they start a new conversation.

The board already has `proposal.md`, `design.md`, and `tasks.md` loaded for every change. That's exactly the context Claude needs. There's no reason the developer should have to paste it manually.

## Proposed Solution

Add a **Chat with Claude** panel to the board. When a change is selected, a chat panel opens with the three spec files pre-loaded as context. The developer can ask questions about the spec, request clarification, or explore implementation ideas — all within the same window as the task list.

### UI

- A "Chat" tab appears next to "Tasks" in the detail panel header
- Switching to Chat shows a message thread and an input box
- The first message in the thread is a system-generated summary: `Context loaded: proposal.md, design.md, tasks.md for "change-name"`
- The developer types freely; messages go to the server which proxies to the Claude API

### Server

New endpoint: `POST /api/changes/:id/chat`

Request body:
```json
{ "messages": [{ "role": "user", "content": "..." }] }
```

On first call:
1. Read `proposal.md`, `design.md`, `tasks.md` from `change.path`
2. Build a system prompt: `You are helping with the SDD change "${name}". Here are the specs:\n\n[file contents]`
3. Call Claude API (`claude-sonnet-4-6` by default) with the system prompt + messages
4. Stream the response back to the client via SSE

Subsequent calls in the same session: client sends full message history, server appends and calls Claude again.

### Configuration

`ANTHROPIC_API_KEY` environment variable required. If not set, the Chat tab is hidden and a notice appears: `Set ANTHROPIC_API_KEY to enable Claude chat`.

The model is configurable in `harness.config.json`:
```json
{ "claudeModel": "claude-sonnet-4-6" }
```

## Out of Scope

- Persistent conversation history across sessions (post-MVP — memory is in-memory only)
- File editing from the chat
- Tool use / function calling
