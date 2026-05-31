import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import type { Config } from "@harness/server";

const DEFAULTS: Config = {
  changesDir: "openspec/changes",
  archiveDir: "openspec/changes/archive",
  tasksFile: "tasks.md",
  proposalFile: "proposal.md",
  designFile: "design.md",
  port: 3000,
};

export function loadConfig(configPath?: string): Config {
  const target = configPath ?? resolve(process.cwd(), "harness.config.json");

  if (!existsSync(target)) {
    return DEFAULTS;
  }

  try {
    const raw = JSON.parse(readFileSync(target, "utf-8"));
    return { ...DEFAULTS, ...raw };
  } catch {
    console.warn(`Could not parse config at ${target}, using defaults`);
    return DEFAULTS;
  }
}
