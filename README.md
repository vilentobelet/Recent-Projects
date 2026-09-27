# Product Badge Board

A public, responsive project access board designed for embedding in Notion. Recruiters can understand each product, filter by category, open links, and copy demo access details. Vitaliy Diduh can manage projects through token-protected Owner mode.

## Live site

https://product-badge-board.vilento-belet.chatgpt.site

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
├── project-ui/            # React Project components + Storybook
├── standalone/            # TypeScript source for the static board
├── outputs/               # built HTML for Notion / Pages
│   └── notion-product-badge.html
└── site/                  # production app (Vinext / Sites)
```

## Local development

Run the production app from `site/`:

```sh
pnpm run dev
pnpm run build
pnpm run start
```

Build the GitHub Pages / Notion HTML from `standalone/`:

```sh
npm --prefix standalone install
npm --prefix standalone run build
```

Run Project component Storybook from `project-ui/`:

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

Use the live URL for a Notion Embed block. `outputs/notion-product-badge.html` is the downloadable standalone alternative and reads the same hosted data.

## Safe credential use

Passwords shown on this public board are visible to any visitor who selects Show or Copy. Store only low-sensitivity project/demo credentials here.
