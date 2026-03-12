import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const appDir = path.resolve(scriptDir, "..", "app");
const defaultPort = Number.parseInt(process.env.PORT ?? "4173", 10);

function toFilePath(requestUrl) {
  const url = new URL(requestUrl, "http://127.0.0.1");
  const pathname = decodeURIComponent(url.pathname);
  const relativePath = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  const filePath = path.resolve(appDir, relativePath);

  if (!filePath.startsWith(appDir)) {
    return null;
  }

  return filePath;
}

function contentType(filePath) {
  if (filePath.endsWith(".html")) {
    return "text/html; charset=utf-8";
  }

  if (filePath.endsWith(".css")) {
    return "text/css; charset=utf-8";
  }

  if (filePath.endsWith(".js")) {
    return "text/javascript; charset=utf-8";
  }

  return "text/plain; charset=utf-8";
}

export async function readAppResponse(requestUrl = "/") {
  const filePath = toFilePath(requestUrl);

  if (!filePath) {
    return {
      status: 403,
      headers: { "content-type": "text/plain; charset=utf-8" },
      body: Buffer.from("Forbidden"),
    };
  }

  try {
    const file = await readFile(filePath);
    return {
      status: 200,
      headers: { "content-type": contentType(filePath) },
      body: file,
    };
  } catch (error) {
    return {
      status: 404,
      headers: { "content-type": "text/plain; charset=utf-8" },
      body: Buffer.from("Not found"),
    };
  }
}

export function startServer({ port = defaultPort } = {}) {
  const server = createServer(async (request, response) => {
    const result = await readAppResponse(request.url ?? "/");
    response.writeHead(result.status, result.headers);
    response.end(result.body);
  });

  return new Promise((resolve, reject) => {
    server.on("error", reject);
    server.listen(port, "127.0.0.1", () => resolve(server));
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = Number.parseInt(process.env.PORT ?? process.argv[2] ?? `${defaultPort}`, 10);
  const server = await startServer({ port });

  console.log(`Serving app from ${appDir}`);
  console.log(`Open http://127.0.0.1:${server.address().port}`);

  process.on("SIGINT", () => {
    server.close(() => process.exit(0));
  });
}
