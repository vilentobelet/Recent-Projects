# Product Badge Board — Current Status

Last updated: 2026-09-29

## GitHub Pages

- Workflow: `.github/workflows/deploy-pages.yml`
- Source: `site/pages-spa/` compiles `site/components/product-board.tsx` (same UI as localhost:5173). `npm --prefix standalone run build` writes the artifact; CI installs `site/` deps first.
- Shared artifact: `outputs/pages/index.html` (local preview at http://127.0.0.1:4173/ and the Pages upload path).
- Off Vinext hosts, the board calls `https://product-badge-board.vilento-belet.chatgpt.site` for API reads/writes.
- Notion copy of the same HTML: `outputs/notion-product-badge.html`.
- The workflow enables Pages with `build_type: workflow` before deploy. If the token cannot create Pages, set Settings → Pages → Source → GitHub Actions and re-run.

## Production

- Status: live and public.
- URL: https://product-badge-board.vilento-belet.chatgpt.site
- Sites project ID: `appgprj_6ab27ecda510819199edb390edc8bc06`
- Latest published version: 11.
- Latest published source commit: `99de809984ffff2d44bbc81010696a17681810e5`

## Working files

- Product documentation: `Docs/`
- Card catalog JSON: `data/projects.json`
- Production source: `site/`
- Main UI: `site/components/product-board.tsx`
- Schema: `site/db/schema.ts`
- API routes: `site/app/api/`
- Migrations: `site/drizzle/`
- Hosting configuration: `site/.openai/hosting.json`
- Downloadable Notion HTML: `outputs/notion-product-badge.html` (generated)
- GitHub Pages / local preview artifact: `outputs/pages/` (generated, same HTML as the Notion file)
- Pages SPA entry: `site/pages-spa/`
- Project React components + Storybook: `project-ui/`
- GitHub Pages workflow: `.github/workflows/deploy-pages.yml`
- Cursor New Changes skill: `.cursor/skills/new-changes/`
- Cursor align-board-surfaces skill: `.cursor/skills/align-board-surfaces/`
- Cursor rules: `.cursor/rules/` (`product-badge-board`, `board-ui`, `api-and-data`, `new-changes`)
- Local OpenAI Sites git backup: `archive/openai-sites.git` (gitignored)

## Implemented

- Public product board and Owner mode.
- Two-column adaptive Cards view and one-column mobile layout.
- Compact view and session-persisted view/category/scroll preferences.
- Dynamic category filtering with compact selected-state badges.
- Multiple industry tags per project.
- Optional password with mask, Show/Hide, and Copy.
- Link domain, Copy feedback, full-URL tooltip, and Open-in-new-tab action.
- Create-first ordering, editing, deletion, and drag-and-drop reordering.
- Card colors and per-project logo uploads.
- Featured projects and Featured badge.
- Owner avatar and LinkedIn link displayed as `Vitaliy Diduh`.
- Owner badge and Cards/Compact selector share one responsive header action row.
- `My portfolio` badge links to `vitaliydiduh.com` with the site's favicon.
- Header badges and the Cards/Compact selector share a 48px height and align with the headline on desktop.
- Category filtering preserves the centered board width when the page scrollbar appears or disappears.
- Project links show favicons, resource-type badges, truncated URLs, click-to-copy behavior, and full-URL tooltips.
- Password rows precede project links; opening a protected resource copies its password first and confirms with a toast.
- D1 persistence and R2 image storage.
- Standalone downloadable HTML connected to the production API.
- Card-shaped loading skeletons for Cards and Compact views.
- Project cards are loaded from `data/projects.json` (Storybook, D1 seed, standalone fallback) rather than hardcoded arrays.
- Compact view uses a two-column identity/actions grid from 768px so titles and tags no longer collapse beside long Figma URLs.
- `data/projects.json` now holds the full 10-product live catalog (not a four-card sample).
- Board favicon: peach sparkle on a dark brown square (`site/public/favicon.svg`).
- Shared Pages artifact `outputs/pages/index.html` for local `npm run dev` and GitHub Actions.
- GitHub Pages / port 4173 now render the same React `ProductBoard` as localhost:5173 (lucide, Tailwind, shadcn), with API calls to the live Sites origin. Push to update https://vilentobelet.github.io/Recent-Projects/.
- Local Vinext (`localhost:5173`) still mirrors live products and owner profile on loopback GETs.
- Seed catalog names: Brand Identity cards are `bloBrew - Brand Identity` and `Tom Yum - Brand Identity`; Web3 `bloBrew` is unchanged. Live D1 still uses the short titles until an Owner save.

## Verification

- Production React build passed for version 11.
- Inline JavaScript syntax check passed for the downloadable HTML.
- Desktop and mobile browser QA passed for the header controls and category-filter width stability.
- Live production QA confirmed the 48px control heights, portfolio link, stable scrollbar gutter, and unchanged 1180px board width before/after B2B filtering.
- Version 11 deployment completed successfully.
- `project-ui` Storybook production build succeeded (`storybook-static/`).
- Card skeleton stories added for Cards, Compact, and two-column loading states.
- Production Vinext build passed after adding card skeletons.
- Standalone HTML rebuilt with card-shaped loading skeletons.
- Site, Storybook, and standalone builds passed after moving cards into `data/projects.json`.
- Production, standalone, and Storybook builds passed after the compact responsive layout fix.
- Catalog JSON synced from the live `/api/products` list (10 cards).
- Favicon assets added and wired on production, standalone, and Storybook.
- `outputs/pages/index.html` and `outputs/notion-product-badge.html` are identical after `npm run build`.
- Local 4173 React Pages build: 10 products, lucide icons, Cards and Compact match the Vinext component tree.

## Known constraints

- Project passwords are publicly retrievable by design and are not suitable for sensitive secrets.
- The Pages HTML depends on the live Sites API and network availability.
- Local `npm run dev` (port 4173) is the Pages artifact. `localhost:5173` is Vinext with D1/R2; public GETs can still mirror the live board.
- Visitor UI is one React file (`product-board.tsx`) for Vinext and Pages; rebuild Pages after board UI changes.
- Historical archives and the OpenAI Sites git backup are retained under `archive/` and are not part of normal development context.

## Next task

Local Vinext-only (localhost:5173): every card uses URL click-to-copy + Open; password cards add a key. Do not publish Pages or Sites until Vitaliy confirms.
