import { createServer } from "node:http";
import { watch } from "node:fs";
import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createReadStream, existsSync, statSync } from "node:fs";

const standaloneRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = join(standaloneRoot, "..");
const pagesDir = join(repoRoot, "outputs/pages");
const port = Number(process.env.PORT || 4173);

function runBuild() {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ["scripts/build.mjs"], {
      cwd: standaloneRoot,
      stdio: "inherit",
    });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`standalone build exited ${code}`));
    });
  });
}

function mime(file) {
  if (file.endsWith(".html")) return "text/html; charset=utf-8";
  if (file.endsWith(".svg")) return "image/svg+xml";
  if (file.endsWith(".png")) return "image/png";
  return "application/octet-stream";
}

await runBuild();

const server = createServer((request, response) => {
  const url = new URL(request.url || "/", `http://127.0.0.1:${port}`);
  let pathname = url.pathname;
  if (pathname === "/Recent-Projects" || pathname === "/Recent-Projects/") pathname = "/";
  if (pathname.startsWith("/Recent-Projects/")) pathname = pathname.slice("/Recent-Projects".length);
  const file = join(pagesDir, pathname === "/" ? "index.html" : pathname);
  if (!file.startsWith(pagesDir) || !existsSync(file) || !statSync(file).isFile()) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }
  response.writeHead(200, { "content-type": mime(file) });
  createReadStream(file).pipe(response);
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Pages artifact: ${pagesDir}/index.html`);
  console.log(`Local preview:  http://127.0.0.1:${port}/`);
});

const watchRoots = [
  join(standaloneRoot, "src"),
  join(repoRoot, "data/projects.json"),
  join(repoRoot, "site/public/favicon.svg"),
  join(repoRoot, "site/public/apple-touch-icon.png"),
];
let rebuilding = false;
let queued = false;

async function rebuild() {
  if (rebuilding) {
    queued = true;
    return;
  }
  rebuilding = true;
  try {
    await runBuild();
  } catch (error) {
    console.error(error);
  } finally {
    rebuilding = false;
    if (queued) {
      queued = false;
      void rebuild();
    }
  }
}

for (const root of watchRoots) {
  watch(root, { recursive: true }, () => {
    void rebuild();
  });
}
