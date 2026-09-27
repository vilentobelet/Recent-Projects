---
name: align-board-surfaces
description: Keeps the Vinext board, standalone HTML, and project-ui Storybook kit aligned. Use when changing cards, skeletons, header, category filters, passwords, links, or other visitor-facing board UI.
---

# Align board surfaces

Shared visitor UI lives in three places. Update all that apply:

| Surface | Path | Validate |
| --- | --- | --- |
| Production | `site/components/product-board.tsx`, `site/components/project-card-skeleton.tsx` | `pnpm run build` in `site/` |
| Storybook kit | `project-ui/src/components/`, stories in `project-ui/src/stories/` | `npm --prefix project-ui run build-storybook` or Storybook on port 6006 |
| Pages / Notion HTML | `standalone/src/board.ts`, `styles.css`, `index.html` | `npm run build` (writes `outputs/pages/index.html`, uploaded by GitHub Actions) |

`project-ui` is presentational only. Do not assume `site/` imports it.

Match the live board: Inter, lucide icons, Featured above the title, Copy/Open buttons, card-shaped skeletons, two-column desktop Cards / one-column mobile.
