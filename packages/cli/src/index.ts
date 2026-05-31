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

// -p / --port flag overrides config
const portFlag = args.indexOf("--port") !== -1 ? args.indexOf("--port") : args.indexOf("-p");
const portOverride = portFlag !== -1 ? Number(args[portFlag + 1]) : undefined;

const config = loadConfig(configPath);
if (portOverride && !isNaN(portOverride)) config.port = portOverride;

const rootDir = process.cwd();
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
  if ((err as NodeJS.ErrnoException).code === "EADDRINUSE") {
    console.error(`\n  Port ${config.port} is already in use.\n`);
    console.error(`  Run on a different port:\n`);
    console.error(`    npx harness-admin -p 3001\n`);
    process.exit(1);
  }
  console.error(err);
  process.exit(1);
});
