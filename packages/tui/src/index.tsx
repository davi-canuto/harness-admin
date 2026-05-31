import React from "react";
import { render } from "ink";
import { App } from "./App.js";
import type { Change } from "./types.js";

export async function startTUI(serverUrl: string) {
  const res = await fetch(`${serverUrl}/api/changes`);
  const changes: Change[] = await res.json();
  render(<App changes={changes} />);
}
