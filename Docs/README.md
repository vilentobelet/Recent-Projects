# Documentation

All product documentation for the Product Badge Board lives in this folder.

| File | Purpose |
| --- | --- |
| [PROJECT_SPEC.md](PROJECT_SPEC.md) | Stable requirements and acceptance criteria |
| [STATUS.md](STATUS.md) | Current production state and the next active task |
| [CHANGELOG.md](CHANGELOG.md) | Shipped behavior by version |
| [WORKFLOW.md](WORKFLOW.md) | Low-context development process |

## Agent guidance

| Location | Purpose |
| --- | --- |
| [`AGENTS.md`](../AGENTS.md) | Durable operating rules (root, auto-loaded) |
| [`.cursor/rules/product-badge-board.mdc`](../.cursor/rules/product-badge-board.mdc) | Always-on Cursor project rule |
| [`.cursor/rules/board-ui.mdc`](../.cursor/rules/board-ui.mdc) | Live board + Storybook + standalone alignment |
| [`.cursor/rules/api-and-data.mdc`](../.cursor/rules/api-and-data.mdc) | Public GET vs owner writes, D1/R2 |
| [`.cursor/rules/new-changes.mdc`](../.cursor/rules/new-changes.mdc) | Opt-in New Changes rule |
| [`.cursor/skills/new-changes/`](../.cursor/skills/new-changes/SKILL.md) | Opt-in New Changes skill |
| [`.cursor/skills/align-board-surfaces/`](../.cursor/skills/align-board-surfaces/SKILL.md) | Keep the three UI surfaces in sync |

The GitHub overview stays in [`README.md`](../README.md).
