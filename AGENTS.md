## Agent skills

### Issue tracker

Issues and PRDs for this repo live as GitHub issues. See `docs/agents/issue-tracker.md`.

### Triage labels

The default five canonical triage roles (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context repository layout (one `CONTEXT.md` and `docs/adr/` at the root). See `docs/agents/domain.md`.

### Automated Verification Gates

Never mark a ticket as "done" just because the code looks right.
- **Type-Check Requirement**: Configure TypeScript in strict mode (`"strict": true` in `tsconfig.json`).
- Before completing any ticket (or step), it must run `npx tsc --noEmit` in the terminal to verify zero TypeScript errors.
