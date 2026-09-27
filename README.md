# Product Badge Board

A public, responsive project access board designed for embedding in Notion. Recruiters can understand each product, filter by category, open links, and copy demo access details. Vitaliy Diduh can manage projects through token-protected Owner mode.

## Live site

https://product-badge-board.vilento-belet.chatgpt.site

## Documentation

- `PROJECT_SPEC.md` — stable requirements and acceptance criteria.
- `STATUS.md` — current production state and the next active task.
- `CHANGELOG.md` — shipped behavior by version.
- `WORKFLOW.md` — low-context development process.
- `AGENTS.md` — concise rules Codex loads for this project.

## Project structure

```text
.
├── AGENTS.md
├── PROJECT_SPEC.md
├── STATUS.md
├── CHANGELOG.md
├── WORKFLOW.md
├── outputs/
│   └── notion-product-badge.html
└── work/
    ├── product-badge-site/
    └── product-badge-site-archive-v*.tar.gz
```

## Local development

Run commands from `work/product-badge-site/`:

```sh
pnpm run dev
pnpm run build
pnpm run start
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
