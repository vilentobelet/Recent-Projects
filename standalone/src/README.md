# Standalone / Pages build

GitHub Pages and `npm run dev` (port 4173) no longer use a separate HTML/CSS clone.

They compile the same React board as localhost:5173:

- UI: `site/components/product-board.tsx`
- Entry: `site/pages-spa/`
- Build: `npm --prefix standalone run build` (`scripts/build.mjs` → Vite)
