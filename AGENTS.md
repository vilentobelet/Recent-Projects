# Product Badge Board — Codex Instructions

## Start here

- Product documentation lives in `Docs/`.
- Treat `Docs/PROJECT_SPEC.md` as the product requirements source of truth.
- Read `Docs/STATUS.md` before implementation to learn the current state and next work.
- Read `Docs/WORKFLOW.md` only when planning a new task or handing work to another chat.
- Consult `Docs/CHANGELOG.md` only when history is relevant.
- Do not reconstruct requirements from old chat history when these files answer the question.

## Default behavior for every new chat

- Before implementing any requested change, read `Docs/STATUS.md` and consult only the relevant section of `Docs/PROJECT_SPEC.md`.
- Interpret the user's first task message as: `Implement: <the requested change>. Preserve existing behavior from Docs/PROJECT_SPEC.md.`
- The user does not need to repeat this boilerplate in each new chat; a concise description of the requested change is sufficient.
- Do not reread the full project history or ask the user to restate established requirements.
- If the requested change is clear and safe, proceed without a redundant confirmation. Ask only when a missing decision would materially change the result.

## Project layout

- Product data catalog: `data/projects.json` (seed, Storybook, standalone fallback). Do not hardcode cards in source.
- Cursor skills: `.cursor/skills/` (`new-changes`, `align-board-surfaces`)
- Cursor rules: `.cursor/rules/` (always-on board rules plus New Changes, board UI, and API)
- Production source: `site/`
- Standalone TypeScript source: `standalone/src/`
- Project React components + Storybook: `project-ui/`
- Notion-downloadable HTML: `outputs/notion-product-badge.html` (built from `standalone/`)
- Historical deployment archives: `archive/` — do not inspect unless recovery is requested.
- Live site: `https://product-badge-board.vilento-belet.chatgpt.site`

## Working agreements

- Keep changes scoped to the user's current request.
- Preserve public viewing and owner-only editing.
- Keep the React site, standalone TypeScript board, and `project-ui` Storybook kit aligned when changing user-facing features.
- Use English for all UI copy.
- Preserve the dark gray/black/orange visual system and responsive behavior.
- Desktop Cards view uses two columns; mobile uses one column.
- Never expose, print, document, or commit the real `ADMIN_TOKEN` or repository credentials.
- Do not treat the board as a secure password vault. Public visitors are intentionally allowed to reveal and copy stored access passwords.
- Avoid reading `node_modules`, generated build output, `.env.local`, deployment archives, or unrelated files.
- Prefer targeted searches and file reads over repository-wide dumps.
- Use `apply_patch` for manual edits.
- When editing New Changes, update `.cursor/skills/new-changes/SKILL.md` and `.cursor/rules/new-changes.mdc`. Keep `.agents/skills/new-changes/` in sync for Codex.

## Validation

- For production UI or API changes, run `pnpm run build` in `site/`.
- For downloadable HTML or GitHub Pages changes, edit `standalone/src/` and run `npm --prefix standalone run build`.
- For `project-ui` component changes, add or update stories and run `npm --prefix project-ui run build-storybook` when practical.
- Update `Docs/STATUS.md` after material work and add a concise entry to `Docs/CHANGELOG.md` for shipped behavior.
- Publish Site changes unless the user explicitly requests local-only work.

## Definition of done

A task is complete when the requested behavior is implemented, relevant validation passes, the live/downloadable variants remain consistent where applicable, and the durable project files reflect the new state.
