import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const standaloneRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = join(standaloneRoot, "..");

const bundled = await build({
  absWorkingDir: standaloneRoot,
  entryPoints: ["src/board.ts"],
  bundle: true,
  minify: true,
  format: "iife",
  target: "es2022",
  write: false,
  logLevel: "info",
});

const js = bundled.outputFiles[0].text.replaceAll("</script>", "<\\/script>");
const css = readFileSync(join(standaloneRoot, "src/styles.css"), "utf8");
const faviconSvg = readFileSync(join(repoRoot, "site/public/favicon.svg"), "utf8");
const appleTouch = readFileSync(join(repoRoot, "site/public/apple-touch-icon.png"));
const html = readFileSync(join(standaloneRoot, "src/index.html"), "utf8")
  .replace("__CSS__", css)
  .replace("__JS__", js)
  .replace("__FAVICON__", `data:image/svg+xml,${encodeURIComponent(faviconSvg)}`)
  .replace("__APPLE_TOUCH__", `data:image/png;base64,${appleTouch.toString("base64")}`);

const outputPath = join(repoRoot, "outputs/notion-product-badge.html");
mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, html);
console.log(`Wrote ${outputPath}`);
