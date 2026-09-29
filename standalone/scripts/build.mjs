import { spawn } from "node:child_process";
import { copyFileSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const scriptsDir = dirname(fileURLToPath(import.meta.url));
const standaloneRoot = join(scriptsDir, "..");
const repoRoot = join(standaloneRoot, "..");
const siteRoot = join(repoRoot, "site");
const pagesDir = join(repoRoot, "outputs/pages");
const viteBin = join(siteRoot, "node_modules/vite/bin/vite.js");
const pagesConfig = join(siteRoot, "vite.pages.config.ts");

function runVite() {
  return new Promise((resolve, reject) => {
    const child = spawn("node", [viteBin, "build", "--config", pagesConfig], {
      cwd: siteRoot,
      stdio: "inherit",
    });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`vite pages build exited ${code}`));
    });
  });
}

function readAsset(href) {
  const relative = href.replace(/^\.\//, "").replace(/^\//, "");
  return readFileSync(join(pagesDir, relative), "utf8");
}

await runVite();

copyFileSync(join(siteRoot, "public/favicon.svg"), join(pagesDir, "favicon.svg"));
copyFileSync(join(siteRoot, "public/favicon-32.png"), join(pagesDir, "favicon-32.png"));
copyFileSync(join(siteRoot, "public/apple-touch-icon.png"), join(pagesDir, "apple-touch-icon.png"));

const faviconSvg = readFileSync(join(pagesDir, "favicon.svg"), "utf8");
const faviconPng = readFileSync(join(pagesDir, "favicon-32.png"));
const appleTouch = readFileSync(join(pagesDir, "apple-touch-icon.png"));

let html = readFileSync(join(pagesDir, "index.html"), "utf8");
html = html.replace(/<link rel="modulepreload"[^>]*>/g, "");
html = html.replace(/<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g, (_match, href) => `<style>${readAsset(href)}</style>`);
html = html.replace(/<script type="module"[^>]*src="([^"]+)"[^>]*><\/script>/g, (_match, src) => {
  const js = readAsset(src).replaceAll("</script>", "<\\/script>");
  return `<script type="module">${js}</script>`;
});
html = html
  .replace("./favicon.svg", `data:image/svg+xml,${encodeURIComponent(faviconSvg)}`)
  .replace("./favicon-32.png", `data:image/png;base64,${faviconPng.toString("base64")}`)
  .replace("./apple-touch-icon.png", `data:image/png;base64,${appleTouch.toString("base64")}`);

writeFileSync(join(pagesDir, "index.html"), html);
writeFileSync(join(repoRoot, "outputs/notion-product-badge.html"), html);
writeFileSync(join(pagesDir, ".nojekyll"), "");

for (const name of readdirSync(pagesDir)) {
  if (name === "assets") rmSync(join(pagesDir, name), { recursive: true, force: true });
}

console.log(`Wrote ${join(pagesDir, "index.html")}`);
console.log(`Wrote ${join(repoRoot, "outputs/notion-product-badge.html")}`);
