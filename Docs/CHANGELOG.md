# Product Badge Board — Changelog

## 2026-09-27 — Full live catalog in JSON

- Copied all 10 live board products into `data/projects.json` so Storybook, empty-database seed, and the standalone fallback match production.

## 2026-09-27 — Compact responsive layout

- Stopped compact rows from crushing titles and stretching Figma URLs: identity and actions sit in a two-column grid from 768px and stack on phones.
- Truncated visible links to host plus short path segments (Figma file keys omitted); the full URL remains in the tooltip. Copy stays off the compact row on small screens.

## 2026-09-27 — JSON card catalog

- Moved project card content into `data/projects.json`.
- Storybook, empty-database seeding, and the standalone board fallback now read that file instead of hardcoded card arrays.

## 2026-09-27 — Cursor skills and rules from source

- Added always-on and file-scoped Cursor rules from `Docs/` and the current `site/`, `standalone/`, and `project-ui` layout.
- Added an `align-board-surfaces` skill for shared visitor UI.
- Refreshed New Changes skill/rule validation paths and reset the Codex New Changes template to a generic prompt.

## 2026-09-27 — Cursor New Changes

- Moved the New Changes launcher into Cursor as `.cursor/skills/new-changes/` and `.cursor/rules/new-changes.mdc`.
- Removed the root `New Changes.webloc`.

## 2026-09-27 — Centralized Docs

- Moved product documentation into `Docs/` (`PROJECT_SPEC`, `STATUS`, `CHANGELOG`, `WORKFLOW`).
- Left `AGENTS.md` and `README.md` at the repository root so agents and GitHub still find them.

## 2026-09-27 — Card skeletons

- Replaced the solid loading blocks with card-shaped skeletons that mirror logo, title, idea, tags, and the link row in Cards and Compact views.

## 2026-09-27 — Project UI Storybook

- Added React Project components (`ProjectCard`, filters, link/password rows) in `project-ui/`.
- Added Storybook (Vite + React) and a workflow that builds it.

## 2026-09-27 — TypeScript Pages pipeline

- Moved the static board into `standalone/src/` TypeScript and CSS.
- GitHub Actions now installs Node, builds that source, and publishes the generated HTML.

## 2026-09-27 — GitHub Pages visual match

- Aligned the standalone GitHub Pages HTML with the live board typography, lucide-style icons, and button treatment.

## 2026-09-27 — GitHub Pages workflow

- Enabled Pages from the workflow, switched to Node 24 action majors, and pinned `ubuntu-24.04`.

## 2026-09-27 — Repository layout

- Moved the production app to `site/` and stopped treating it as a nested git repository.
- Added a root `.gitignore` so caches, build output, `.DS_Store`, and `archive/` stay out of git.
- Kept product docs, GitHub Actions, and the Notion HTML at the repository root.

## 2026-09-27 — GitHub Pages

- Added a GitHub Actions workflow that publishes the standalone board HTML to GitHub Pages.

## 2026-09-27 — Version 11

- Prevented the centered board container from resizing or shifting when category filtering removes the page scrollbar.
- Added a `My portfolio` badge linked to `vitaliydiduh.com` with the portfolio favicon.
- Matched the Cards/Compact selector height to the profile badges and aligned the header controls with the `Recent Projects.` headline.
- Updated the standalone Notion HTML to match.

## 2026-09-27 — Version 10

- Added favicons and `Site`, `Figma`, or `Prototype` badges to project links.
- Made the visible URL copy the full address, with truncation and a full-URL tooltip for long links.
- Removed the redundant `LINK` label from Cards view and placed password rows before project links.
- Made `Open` copy an available password before opening the resource, with toast confirmation.
- Placed the Cards/Compact selector beside the owner badge in the responsive header.
- Updated the standalone Notion HTML to match.

## 2026-09-25 — Version 9

- Added Cards and Compact view modes.
- Made Cards the default for a new browser session.
- Persisted view mode, category selection, and scroll position within the session.
- Added explicit Open actions, full URL tooltips, and transient `Copied ✓` feedback.
- Moved smaller industry tags beneath Product Idea.
- Reduced desktop category badge sizing and corrected the active orange state.
- Renamed the owner badge from `My LinkedIn` to `Vitaliy Diduh` while keeping the LinkedIn mark.
- Updated the standalone Notion HTML to match.

## 2026-09-24 — Versions 7–8

- Added Featured projects, Featured badges, and featured-first ordering.
- Added owner avatar and editable LinkedIn profile.
- Added dynamic category filters generated from industry tags.

## 2026-09-22 to 2026-09-24 — Versions 1–6

- Created the public Notion-embeddable project board.
- Added Owner mode with product creation, editing, and deletion.
- Added optional passwords with reveal and copy controls.
- Added responsive two-column desktop and one-column mobile layouts.
- Added multi-tag industries, card colors, and logo uploads.
- Added create-first insertion and drag-and-drop ordering.
- Added D1 synchronization, R2 uploads, and the downloadable standalone HTML.
