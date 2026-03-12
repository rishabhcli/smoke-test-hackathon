import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { readAppResponse } from "./server.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const appDir = path.resolve(scriptDir, "..", "app");
const indexPath = path.join(appDir, "index.html");

await access(indexPath);

const source = await readFile(indexPath, "utf8");
assert.match(source, /Smoke Test Hackathon/);
assert.match(source, /npm run verify/);

const response = await readAppResponse("/");

assert.equal(response.status, 200);
assert.match(response.body.toString("utf8"), /Minimal Static App/);
assert.match(response.body.toString("utf8"), /Smoke Test Hackathon/);

console.log("Verification passed for app/index.html and local server response logic.");
