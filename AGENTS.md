# Product Badge Board — Codex Instructions

## Start here

- Treat `PROJECT_SPEC.md` as the product requirements source of truth.
- Read `STATUS.md` before implementation to learn the current state and next work.
- Read `WORKFLOW.md` only when planning a new task or handing work to another chat.
- Consult `CHANGELOG.md` only when history is relevant.
- Do not reconstruct requirements from old chat history when these files answer the question.

## Default behavior for every new chat

- Before implementing any requested change, read `STATUS.md` and consult only the relevant section of `PROJECT_SPEC.md`.
- Interpret the user's first task message as: `Implement: <the requested change>. Preserve existing behavior from PROJECT_SPEC.md.`
- The user does not need to repeat this boilerplate in each new chat; a concise description of the requested change is sufficient.
- Do not reread the full project history or ask the user to restate established requirements.
- If the requested change is clear and safe, proceed without a redundant confirmation. Ask only when a missing decision would materially change the result.

## Project layout

- Production source: `site/`
- Notion-downloadable HTML: `outputs/notion-product-badge.html`
- Historical deployment archives: `archive/` — do not inspect unless recovery is requested.
- Live site: `https://product-badge-board.vilento-belet.chatgpt.site`

## Working agreements

- Keep changes scoped to the user's current request.
- Preserve public viewing and owner-only editing.
- Keep the React site and downloadable HTML behavior aligned when changing user-facing features.
- Use English for all UI copy.
- Preserve the dark gray/black/orange visual system and responsive behavior.
- Desktop Cards view uses two columns; mobile uses one column.
- Never expose, print, document, or commit the real `ADMIN_TOKEN` or repository credentials.
- Do not treat the board as a secure password vault. Public visitors are intentionally allowed to reveal and copy stored access passwords.
- Avoid reading `node_modules`, generated build output, `.env.local`, deployment archives, or unrelated files.
- Prefer targeted searches and file reads over repository-wide dumps.
- Use `apply_patch` for manual edits.
- When editing the New Changes template, update and validate both `New Changes.webloc` and `.agents/skills/new-changes/agents/openai.yaml`.

## Validation

- For production UI or API changes, run `pnpm run build` in `site/`.
- For downloadable HTML changes, parse the inline JavaScript with Node to catch syntax errors.
- Perform focused browser QA when layout or interaction behavior changes materially.
- Update `STATUS.md` after material work and add a concise entry to `CHANGELOG.md` for shipped behavior.
- Publish Site changes unless the user explicitly requests local-only work.

## Definition of done

A task is complete when the requested behavior is implemented, relevant validation passes, the live/downloadable variants remain consistent where applicable, and the durable project files reflect the new state.
