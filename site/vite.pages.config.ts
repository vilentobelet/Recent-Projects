import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/postcss";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const siteRoot = dirname(fileURLToPath(import.meta.url));
const spaRoot = resolve(siteRoot, "pages-spa");

export default defineConfig({
  root: spaRoot,
  base: "./",
  plugins: [react()],
  resolve: {
    alias: { "@": siteRoot },
    dedupe: ["react", "react-dom"],
  },
  css: {
    postcss: {
      plugins: [tailwindcss],
    },
  },
  server: {
    fs: { allow: [siteRoot, resolve(siteRoot, "..")] },
  },
  build: {
    outDir: resolve(siteRoot, "../outputs/pages"),
    emptyOutDir: true,
    cssCodeSplit: false,
    assetsInlineLimit: 1024 * 1024,
    codeSplitting: false,
  },
});
