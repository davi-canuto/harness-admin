import React from "react";
import { render } from "ink";
import { readChanges } from "@harness/parser";
import { App } from "./App.js";

const rootDir = process.argv[2] ?? process.cwd();

const config = {
  changesDir: "openspec/changes",
  archiveDir: "openspec/changes/archive",
  tasksFile: "tasks.md",
  proposalFile: "proposal.md",
  designFile: "design.md",
  port: 3000,
};

const changes = readChanges(rootDir, config);
render(<App changes={changes} />);
