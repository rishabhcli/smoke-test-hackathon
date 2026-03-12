import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { readAppResponse } from "../scripts/server.mjs";

const testDir = path.dirname(fileURLToPath(import.meta.url));
const indexPath = path.resolve(testDir, "..", "app", "index.html");

test("index.html contains the expected app copy", async () => {
  const source = await readFile(indexPath, "utf8");
  assert.match(source, /Smoke Test Hackathon/);
  assert.match(source, /npm run serve/);
});

test("local server response logic returns the landing page", async () => {
  const response = await readAppResponse("/");
  assert.equal(response.status, 200);
  assert.match(response.body.toString("utf8"), /Minimal Static App/);
});
