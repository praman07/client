# Batch Changelog Generator

Use this to convert commits from `client/scripts/all-commits.md` into changelog entries.

## Context

You are generating a comprehensive changelog for Collabify — a team collaboration app with:
- **Features**: chat, pages, whiteboard, vault, issues, projects, workspaces
- **Server commits**: backend (GraphQL, Prisma, WebSocket)
- **Client commits**: frontend (React, TanStack Router, UI components)
- **Total commits**: 338 across 19 weeks (Dec 2025 - May 2026)

## How to Process

Process **one week at a time**, starting from Week 1 (oldest).

For each week:
1. Read commits for that week from `client/scripts/all-commits.md`
2. Group commits by meaningful feature/area
3. Generate **7 or more** changelog entries
4. Update `client/changelog.json` in correct chronological position

## Output Format

Each entry:
```json
{
  "id": "generate-uuid-v4",
  "date": "YYYY-MM-DD (week ending Sunday)",
  "version": "v0.x.x (sequential from previous)",
  "title": "Short meaningful title (3-5 words)",
  "summary": "One sentence describing what was shipped",
  "items": [
    { "type": "new", "text": "Clear item description" },
    { "type": "improvement", "text": "Clear item description" },
    { "type": "fix", "text": "Clear item description" }
  ]
}
```

## Type Detection Rules

- `feat`/`add`/`new` (any scope) → `type: "new"`
- `fix`/`bug`/`patch` → `type: "fix"`
- `refactor`/`style`/`chore`/`docs`/`revert` → `type: "improvement"`

## Grouping Strategy

For each week, create entries for:

1. **Backend/Server** (server repo commits):
   - Database schema changes
   - GraphQL queries/mutations
   - WebSocket events
   - Redis/Docker infrastructure

2. **Frontend/Client** (client repo commits):
   - UI components
   - Routing changes
   - Auth pages
   - Feature pages

3. **Cross-cutting**:
   - Authentication (Clerk, sessions)
   - Shared utilities
   - Build/deploy changes

## Version Rules

- Start from v0.0.1 for Week 1
- Increment sequentially per entry
- Use v0.x.x format (v0.1.1, v0.1.2, etc.)

## Date Rules

- Use the week's **ending Sunday** as date
- Entries sorted newest-first in changelog.json
- Week 1: 2025-12-27 (Dec 28 - Jan 3 → Sunday = Jan 3, so use Jan 3)

## Entry Placement

When writing to `client/changelog.json`:
- Entries are sorted newest-first by date
- Insert new entries BEFORE older ones
- Example: Week 2 (Jan 3) goes AFTER v0.2.0 (Mar 21), BEFORE Week 1

## Batch Processing Order

Process from oldest to newest:

| Week | End Date | Commits | Entries |
|------|----------|---------|---------|
| 1 | 2025-12-27 | 1 | → 2 entries |
| 2 | 2026-01-03 | 22 | → 7+ entries |
| 3 | 2026-01-10 | 16 | → 7+ entries |
| ... | ... | ... | ... |
| 19 | 2026-05-02 | 41 | → existing |

## Requirements

- **Minimum 7 entries per week**
- **No duplicate entries** — skip if entry with same title exists
- **Clear item text** — 1-3 words, not full commit messages
- **Meaningful titles** — "Real-time messaging" not "chat feature part 1"
- **Group intelligently** — combine related commits into single items

## Files

- Commits source: `client/scripts/all-commits.md`
- Output file: `client/changelog.json`
- Weekly batches: `client/scripts/batches/week-XX-YYYY-MM-DD.md`

## Current Task

Process Week 2 (Dec 28 - Jan 3, 2026) — 22 commits.

Generate 7+ changelog entries for this week's commits and update `client/changelog.json`.

After completing Week 2, ask "continue" to process Week 3.