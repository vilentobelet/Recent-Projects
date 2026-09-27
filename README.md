# Product Badge Board

A public, responsive project access board designed for embedding in Notion. Recruiters can understand each product, filter by category, open links, and copy demo access details. Vitaliy Diduh can manage projects through token-protected Owner mode.

## Live URLs

- Production (Vinext / D1 / R2): https://product-badge-board.vilento-belet.chatgpt.site
- GitHub Pages (same HTML artifact as local `npm run dev`): https://vilentobelet.github.io/Recent-Projects/

## Documentation

Product docs live in [`Docs/`](Docs/README.md):

- [`Docs/PROJECT_SPEC.md`](Docs/PROJECT_SPEC.md) — stable requirements and acceptance criteria.
- [`Docs/STATUS.md`](Docs/STATUS.md) — current production state and the next active task.
- [`Docs/CHANGELOG.md`](Docs/CHANGELOG.md) — shipped behavior by version.
- [`Docs/WORKFLOW.md`](Docs/WORKFLOW.md) — low-context development process.
- [`AGENTS.md`](AGENTS.md) — concise rules Codex and Cursor load for this project.
- Cursor skills and rules — `.cursor/skills/` and `.cursor/rules/`.

## Project structure

```text
.
├── .cursor/               # Cursor skills and rules
├── .github/workflows/     # Pages + Storybook CI
├── AGENTS.md              # agent operating rules (root, auto-loaded)
├── Docs/                  # product documentation
├── data/                  # project card JSON catalog
│   └── projects.json
├── project-ui/            # React Project components + Storybook
├── standalone/            # TypeScript source for the static board
├── outputs/
│   ├── pages/             # GitHub Pages + local preview artifact
│   └── notion-product-badge.html
└── site/                  # production Vinext app (Sites only)
```

## Local development (same artifact as GitHub Pages)

From the repository root:

```sh
npm --prefix standalone install
npm run dev
```

This builds `outputs/pages/index.html` and serves it at http://127.0.0.1:4173/ — the same file GitHub Actions uploads to Pages. Cards load from the live Sites API.

```sh
npm run build    # write outputs/pages and the Notion HTML copy
```

## Production Sites app

`localhost:5173` is the Vinext app in `site/`. It uses a **local** D1 database, not the Pages artifact. Use it only when working on the hosted API or Owner-mode server code:

```sh
cd site
pnpm run dev
pnpm run build
pnpm run start
```

Or from the repo root: `npm run site:dev`.

## Storybook

```sh
npm --prefix project-ui install
npm --prefix project-ui run storybook
```

Node.js 22.13 or newer is required. The production runtime uses the D1 `DB` binding, R2 `BUCKET` binding, and an `ADMIN_TOKEN` secret.

## Owner access

Owner mode accepts the private admin token through the URL fragment and then keeps it in browser session storage. Never commit or document the real token.

```text
https://product-badge-board.vilento-belet.chatgpt.site/#admin=YOUR_TOKEN
```

## Notion embed

Use the live Sites URL for a Notion Embed block. `outputs/notion-product-badge.html` is a copy of the Pages HTML and reads the same hosted data.

## Safe credential use

Passwords shown on this public board are visible to any visitor who selects Show or Copy. Store only low-sensitivity project/demo credentials here.
