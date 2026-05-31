import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { existsSync } from "fs";
import { startServer } from "@harness/server";
import { startTUI } from "@harness/tui";
import { loadConfig } from "./config.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const args = process.argv.slice(2);
const tui = args.includes("--tui");
const configFlag = args.indexOf("--config");
const configPath = configFlag !== -1 ? args[configFlag + 1] : undefined;

const config = loadConfig(configPath);
const rootDir = process.cwd();

// board-dist ships alongside dist/ in the published package
const boardDist = resolve(__dirname, "../board-dist");

async function main() {
  await startServer(rootDir, config, existsSync(boardDist) ? boardDist : undefined);

  const url = `http://localhost:${config.port}`;

  if (tui) {
    console.log(`  harness  running at ${url}\n`);
    await startTUI(url);
  } else {
    console.log(`\n  harness  ${url}\n`);
    const { default: open } = await import("open");
    await open(url);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
