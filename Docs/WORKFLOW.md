# Token-Efficient Project Workflow

This workflow minimizes repeated context without sacrificing verification. It can reduce unnecessary usage, but it cannot guarantee a fixed token or plan-usage percentage.

## 1. One outcome per chat

Use a separate project chat for each distinct result, for example:

- `Improve mobile card layout`
- `Add search and sorting`
- `Audit public password handling`

Continue the same chat only while the objective is unchanged. Start a new project chat when the objective diverges.

## 2. Use files as durable memory

At the start of a normal implementation task, Codex should use this order:

1. Automatically follow `AGENTS.md`.
2. Read `STATUS.md`.
3. Read only the relevant section of `PROJECT_SPEC.md`.
4. Inspect only the source files affected by the request.
5. Read `CHANGELOG.md` only if prior behavior matters.

Do not ask Codex to reread the complete chat or scan the complete repository.

## 3. Give compact task prompts

Recommended prompt template:

```text
Goal: <one outcome>
Change: <specific behavior>
Keep: <important existing behavior>
Verify: <what must be tested>
```

Example:

```text
Goal: Make category filtering easier on mobile.
Change: Add a compact horizontal tag scroller with a clear active state.
Keep: Dynamic tags, Cards/Compact modes, Owner drag-and-drop.
Verify: Phone width and production build.
```

## 4. Batch related visual feedback

Send related visual corrections in one message when possible. Include:

- The exact screen size or desktop/mobile target.
- One screenshot when it materially changes the interpretation.
- The component or label involved.
- The desired final behavior, not a long sequence of experiments.

This reduces repeated inspect/edit/build cycles.

## 5. Use a focused execution loop

For each task:

1. Inspect the smallest relevant surface.
2. Make one scoped patch.
3. Run the narrowest useful check.
4. Run the production build once after the implementation stabilizes.
5. Perform browser QA only for material interaction or layout changes.
6. Update `STATUS.md` and add one concise `CHANGELOG.md` entry.
7. Publish once after verification.

Avoid rebuilding and redeploying after every tiny intermediate edit.

## 6. Keep instruction context small

- Keep `AGENTS.md` limited to durable rules.
- Put detailed requirements in `PROJECT_SPEC.md`, not `AGENTS.md`.
- Keep only the current state and one next task in `STATUS.md`.
- Append short changelog entries; do not copy full implementation narratives.
- Remove obsolete requirements instead of adding contradictory notes.

## 7. Avoid expensive context sources by default

Do not load these unless the current task needs them:

- Historical `archive/` deployment backups.
- `node_modules` or generated build artifacts.
- Entire command logs.
- All migrations when only UI is changing.
- All API routes when only styling is changing.
- Old screenshots after the design decision is recorded in the spec.

## 8. Match model effort to task risk

- Use a fast/standard configuration for copy changes, small CSS fixes, and clearly scoped component edits.
- Use higher reasoning only for architecture changes, data migrations, security decisions, or difficult regressions.
- Do not run parallel agents for a small single-file change.

## 9. Handoff protocol

Before ending a substantial task, record:

- What changed.
- What passed verification.
- Current production version and commit, if published.
- Any known constraint.
- Exactly one next task, if one exists.

The next chat should be able to begin from `STATUS.md` without requiring the old transcript.

## 10. Suggested project-chat rhythm

- Keep this original chat as the product history.
- Open a new chat inside the same local Project for each feature or fix.
- Refer to the requirement by filename and section instead of pasting the full history.
- When a chat becomes long but the objective is unchanged, compact it if available; otherwise finish the checkpoint, update `STATUS.md`, and continue in a focused new project chat.
