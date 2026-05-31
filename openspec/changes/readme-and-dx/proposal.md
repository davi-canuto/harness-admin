# Proposal: README and DX Improvements

## Problem

The current README and npm page have several gaps that make the project look unfinished compared to well-maintained open source tools:

1. **No badges** — version, license, and Node.js requirement are invisible at a glance
2. **No GIF/demo** — the only visual is a static screenshot; there is no way to see the tool in motion
3. **No quick start** — installation instructions come after a long intro; a developer scanning the page has to read too much before finding the command to run
4. **Node.js requirement not stated** — the package uses ESM and native `fetch`; users on Node 16 will get cryptic errors with no explanation
5. **"What it does" framing** — the intro describes features, not the problem it solves; a developer who doesn't already know SDD won't understand why they need this
6. **npm page is empty** — `packages/cli/` has no `README.md`, so npmjs.com shows nothing; every visitor to the npm page sees a blank page

## Proposed Solution

### Badges

Add a badge strip at the top of the root `README.md`:
- npm version (links to npmjs.com)
- license (MIT)
- Node.js version requirement (`>= 18`)

### Demo GIF

Record a short (~8s) animated demo using Playwright that:
1. Shows the board loading with the titico project data
2. Collapses a section in the sidebar
3. Selects an in-progress change and shows the task list

Save as `docs/demo.gif` and embed in the README above the static screenshot.

### Quick Start section

Add a "Quick Start" section immediately after the intro — before installation details — with just 3 lines:

```bash
cd your-project
npx harness-admin      # opens browser at http://localhost:3000
npx harness-admin --tui  # terminal UI
```

### Node.js requirement

Add `"engines": { "node": ">=18" }` to `packages/cli/package.json`. Mention it in the README under a "Requirements" line.

### "Why Harness" section

Replace the generic intro paragraph with a problem-first framing:

> You have 20 specs in flight across your project. Some are done, some are stuck in backlog, a few are actively being worked on — but to know which is which you have to open each directory and read the files. Harness fixes that.

### npm README (`packages/cli/README.md`)

Create a focused `README.md` inside `packages/cli/` that renders on npmjs.com. Shorter than the root README — just quick start, usage flags, and a link to the full docs on GitHub.
