import { startServer } from "@harness/server";
import { startTUI } from "@harness/tui";
import { loadConfig } from "./config.js";

const args = process.argv.slice(2);
const tui = args.includes("--tui");
const configFlag = args.indexOf("--config");
const configPath = configFlag !== -1 ? args[configFlag + 1] : undefined;

const config = loadConfig(configPath);
const rootDir = process.cwd();

async function main() {
  await startServer(rootDir, config);

  if (tui) {
    await startTUI(`http://localhost:${config.port}`);
  } else {
    const { default: open } = await import("open");
    await open(`http://localhost:${config.port}`);
    console.log(`Board open at http://localhost:${config.port}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
