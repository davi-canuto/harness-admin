# Tasks: README and DX Improvements

## npm package

- [x] 10.1 Add `"engines": { "node": ">=18" }` to `packages/cli/package.json`
- [x] 10.2 Create `packages/cli/README.md` — quick start, usage flags, config snippet, link to full docs

## Root README

- [x] 10.3 Add badge strip at the top (npm version, license, node requirement)
- [x] 10.4 Add "Quick Start" section immediately after the intro with the 3 key commands and Node.js requirement note
- [x] 10.5 Add "Why Harness" section with problem-first framing, replacing the generic intro paragraph
- [x] 10.6 Reorder sections: Quick Start → Why Harness → Screenshots → Installation → Usage → rest

## Demo GIF

- [x] 10.7 Write a Playwright script that records: board loading → collapse a section → select in-progress change → scroll tasks
- [x] 10.8 Generate `docs/demo.gif` from the Playwright recording and embed it in the README

## Publish

- [x] 10.9 Bump version to `0.1.5`, rebuild cli, publish to npm
- [x] 10.10 Confirm npmjs.com page shows the README and correct metadata
