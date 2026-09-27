---
name: new-changes
description: Starts a scoped Product Badge Board change from Docs/STATUS.md and Docs/PROJECT_SPEC.md. Use when the user selects New Changes, @-mentions this skill, or gives a concrete product edit.
disable-model-invocation: true
---

# New Changes

Read AGENTS.md and Docs/STATUS.md.
Implement: <конкретна правка>.
Preserve existing behavior from Docs/PROJECT_SPEC.md.

## Instructions

1. Read `AGENTS.md` and `Docs/STATUS.md` before taking action. Consult only the relevant section of `Docs/PROJECT_SPEC.md`.
2. Treat the text after `Implement:` as the complete change. If the user only described the edit, interpret it as that Implement request.
3. If `<конкретна правка>` is still present or the edit is missing, ask for the concrete change and do not implement yet.
4. Preserve public viewing, owner-only editing, English copy, and the dark orange board system.
5. For user-facing UI, update production (`site/components/product-board.tsx` and related), standalone (`standalone/src/`), and Storybook (`project-ui/`) when the surface is shared.
6. Validate with `pnpm run build` in `site/` and/or `npm --prefix standalone run build`. Add or update Storybook stories when `project-ui` components change.
7. Update `Docs/STATUS.md` and `Docs/CHANGELOG.md`. Publish the Site unless the user asks for local-only work.
