# Product Badge Board — Product Specification

## Purpose

Create a public, Notion-embeddable project access board that lets recruiters and other visitors quickly understand each product and open or copy its access details. Only the owner can create, edit, delete, feature, color, and reorder projects.

## Audience

- Primary viewer: recruiters and hiring managers reviewing Vitaliy Diduh's work.
- Owner: Vitaliy Diduh, who manages the board through Owner mode.
- Host surface: a public Sites URL embedded inside a public Notion page.

## Product data

Each project supports:

- Product name.
- Product idea/short description.
- One or more industry/category tags, entered as comma-separated values.
- Public HTTP(S) link.
- Optional password.
- Optional uploaded logo.
- Selectable card color: orange, blue, emerald, violet, rose, or cyan.
- Featured state.
- Manual sort position.

## Viewer experience

- All UI copy is English.
- Header title: `Recent Projects.`
- Browser tab uses a peach four-point sparkle on a dark brown square.
- Owner badge: avatar, `Vitaliy Diduh`, and LinkedIn `in` mark in the header action row.
- A matching `My portfolio` badge links to `https://vitaliydiduh.com/` and uses the portfolio site's favicon.
- Categories are generated from all unique project tags and include `All`.
- Selecting a category shows only matching projects.
- Category pills are compact on desktop; the selected pill has a clean orange fill without glow.
- Cards view is the default for a new browser session.
- The owner badge, portfolio badge, and Cards/Compact toggle are equal-height controls aligned with the `Recent Projects.` headline on desktop.
- View mode, selected category, and scroll position persist within the browser session.
- Cards view uses two columns on desktop and one column on mobile.
- Compact view uses a two-column row from 768px (identity | actions) and stacks on phones. Titles stay on one truncated line; long URLs show host plus short path segments (Figma file keys are omitted), with the full URL in the tooltip. Copy stays hidden on small screens so the host can remain readable.
- Industry tags appear directly below Product Idea and remain visually secondary.
- Featured projects appear before regular projects and display a Featured badge.
- A project link shows its favicon, truncated URL, and a `Site`, `Figma`, or `Prototype` resource badge.
- Clicking the visible URL copies the full URL; hover/focus exposes the full URL in a tooltip.
- A clear `Open` action opens the resource in a new tab. When a password exists, `Open` copies it first and confirms that action with a toast.
- Copy actions briefly change to `Copied ✓`.
- Password rows do not render when the password is empty.
- Existing passwords appear before the project link, are masked by default, and support Show/Hide and Copy.

## Owner experience

- Owner mode is enabled by a valid admin token and is retained only in session storage.
- New projects are inserted first in the ordering.
- Project forms support all product fields, multiple tags, featured state, color, and logo upload.
- Edit and Delete actions appear at the top-right of cards.
- Drag-and-drop reordering works in Owner mode, including touch/pointer interaction.
- The owner can upload and edit the avatar and LinkedIn URL.
- Changes synchronize across devices through the hosted database and object storage.

## Design system

- Modern dark interface using black and charcoal surfaces with orange as the primary accent.
- Compact cards with content-driven height; avoid unnecessary empty space.
- While products load, the grid shows card-shaped skeletons that match Cards and Compact layouts.
- Rounded surfaces, subtle borders, minimal shadow, and strong accessible contrast.
- Responsive at phone and desktop widths inside a Notion embed.
- Filtering must not resize or horizontally shift the centered content container when the page becomes shorter than the viewport.

## Architecture

- Frontend/full-stack framework: React 19, Next-compatible Vinext, TypeScript, Tailwind CSS.
- Hosting: OpenAI Sites / Cloudflare Worker runtime.
- Static GitHub Pages mirror and local `npm run dev` both use `outputs/pages/index.html`, built from `standalone/src/` by `npm run build` / `.github/workflows/deploy-pages.yml`, and backed by the same hosted API.
- Repository layout: product docs in `Docs/`, card catalog in `data/projects.json`, Vinext app in `site/`, standalone TypeScript board in `standalone/`, React Project components and Storybook in `project-ui/`, Cursor skills and rules in `.cursor/`.
- Cards are defined in `data/projects.json`, not in component source. An empty database is seeded from that file. Owner edits persist in D1.
- Database: D1 with Drizzle-managed migrations.
- Image storage: R2 binding `BUCKET`.
- Database binding: `DB`.
- Owner authorization: runtime secret `ADMIN_TOKEN`, supplied as `x-admin-token` for write requests.
- Public API reads: products and owner profile.
- Owner-only writes: product create/update/delete/reorder, profile update, and image upload.
- Downloadable standalone file: `outputs/notion-product-badge.html`, a byte copy of `outputs/pages/index.html`.

## API surface

- `GET /api/products`
- `POST /api/products`
- `PATCH /api/products/:id`
- `DELETE /api/products/:id`
- `POST /api/products/reorder`
- `GET /api/profile`
- `PUT /api/profile`
- `POST /api/logos`
- `GET /api/logos/:key`
- `GET /api/admin/check`

## Security boundary

The Site is public and viewers are intentionally able to reveal and copy project passwords. These values must therefore be treated as low-sensitivity demo/access credentials, not personal passwords, production secrets, API keys, or confidential customer credentials.

## Acceptance criteria

- Public visitors can filter, inspect, open, and copy project access data without entering Owner mode.
- Public visitors cannot call protected write endpoints successfully.
- Owner changes survive refresh and appear on another device.
- A card without a password has no password row.
- Featured ordering and manual ordering are stable after refresh.
- Cards and Compact views work on desktop and phone widths.
- Production build succeeds.
- Downloadable HTML has valid inline JavaScript and matches the production experience for shared behaviors.
