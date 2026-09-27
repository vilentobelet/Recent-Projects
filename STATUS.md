# Product Badge Board — Current Status

Last updated: 2026-09-27

## GitHub Pages

- Workflow: `.github/workflows/deploy-pages.yml`
- Publishes `outputs/notion-product-badge.html` as the Pages site (`index.html`).
- The workflow enables Pages with `build_type: workflow` before deploy. If the token cannot create Pages, set Settings → Pages → Source → GitHub Actions and re-run.

## Production

- Status: live and public.
- URL: https://product-badge-board.vilento-belet.chatgpt.site
- Sites project ID: `appgprj_6ab27ecda510819199edb390edc8bc06`
- Latest published version: 11.
- Latest published source commit: `99de809984ffff2d44bbc81010696a17681810e5`

## Working files

- Production source: `site/`
- Main UI: `site/components/product-board.tsx`
- Schema: `site/db/schema.ts`
- API routes: `site/app/api/`
- Migrations: `site/drizzle/`
- Hosting configuration: `site/.openai/hosting.json`
- Downloadable Notion HTML: `outputs/notion-product-badge.html`
- GitHub Pages workflow: `.github/workflows/deploy-pages.yml`
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

## Verification

- Production React build passed for version 11.
- Inline JavaScript syntax check passed for the downloadable HTML.
- Desktop and mobile browser QA passed for the header controls and category-filter width stability.
- Live production QA confirmed the 48px control heights, portfolio link, stable scrollbar gutter, and unchanged 1180px board width before/after B2B filtering.
- Version 11 deployment completed successfully.

## Known constraints

- Project passwords are publicly retrievable by design and are not suitable for sensitive secrets.
- The standalone HTML depends on the live Sites API and network availability.
- UI behavior shared by the production site and standalone HTML must be updated in both implementations.
- Historical archives and the OpenAI Sites git backup are retained under `archive/` and are not part of normal development context.

## Next task

No required implementation is pending. Add only the user's next explicitly requested change here while it is active, then clear or replace it after completion.
