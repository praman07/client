# Mention Chip Styling Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update `MentionChip` and `ChatMentionChip` to use category-based color coding (Indigo for documents, Orange for tasks, Emerald for canvases, Purple for people) using existing label token classes from the design system.

**Architecture:** Replace the monochrome `CHIP_COLORS` map with category-specific label token classes. Both components get identical updates. Dark mode is handled automatically by the CSS custom property tokens.

**Tech Stack:** React, TypeScript, Tailwind CSS v4 (via `@theme inline` label tokens), CSS custom properties (dark mode).

---

## File Overview

| File | Change |
|---|---|
| `client/src/features/mention/ui/MentionChip.tsx` | Update `CHIP_COLORS` map with label token classes |
| `client/src/features/mention/ui/ChatMentionChip.tsx` | Update `CHIP_COLORS` map with identical label token classes |

---

## Task 1: Update `MentionChip.tsx` CHIP_COLORS

**Files:**
- Modify: `client/src/features/mention/ui/MentionChip.tsx:22-42`

- [ ] **Step 1: Replace the CHIP_COLORS map**

Locate the current `CHIP_COLORS` constant (lines 29-42) and replace it entirely with the category-based color mapping:

```tsx
const CHIP_COLORS: Record<string, string> = {
  // Documents — Indigo
  [SearchEntityType.Page]:
    'bg-label-indigo-bg text-label-indigo-text hover:bg-label-indigo-hover border border-subtle',
  [SearchEntityType.VaultFile]:
    'bg-label-indigo-bg text-label-indigo-text hover:bg-label-indigo-hover border border-subtle',
  [SearchEntityType.VaultFolder]:
    'bg-label-indigo-bg text-label-indigo-text hover:bg-label-indigo-hover border border-subtle',

  // Tasks — Orange
  [SearchEntityType.Issue]:
    'bg-label-orange-bg text-label-orange-text hover:bg-label-orange-hover border border-subtle',

  // Canvases — Emerald (teal equivalent)
  [SearchEntityType.Whiteboard]:
    'bg-label-emerald-bg text-label-emerald-text hover:bg-label-emerald-hover border border-subtle',

  // People — Purple
  [SearchEntityType.User]:
    'bg-label-purple-bg text-label-purple-text hover:bg-label-purple-hover border border-subtle',
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/features/mention/ui/MentionChip.tsx
git commit -m "feat(mention): apply category-based colors to MentionChip

- Documents (Page, VaultFile, VaultFolder) → Indigo label tokens
- Issue → Orange label tokens
- Whiteboard → Emerald label tokens
- User → Purple label tokens

Co-Authored-By: Claude Sonnet 4.5 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: Update `ChatMentionChip.tsx` CHIP_COLORS

**Files:**
- Modify: `client/src/features/mention/ui/ChatMentionChip.tsx:20-35`

- [ ] **Step 1: Replace the CHIP_COLORS map**

Locate the current `CHIP_COLORS` constant (lines 22-35) and replace it with the identical category-based color mapping:

```tsx
const CHIP_COLORS: Record<string, string> = {
  // Documents — Indigo
  [SearchEntityType.Page]:
    'bg-label-indigo-bg text-label-indigo-text hover:bg-label-indigo-hover border border-subtle',
  [SearchEntityType.VaultFile]:
    'bg-label-indigo-bg text-label-indigo-text hover:bg-label-indigo-hover border border-subtle',
  [SearchEntityType.VaultFolder]:
    'bg-label-indigo-bg text-label-indigo-text hover:bg-label-indigo-hover border border-subtle',

  // Tasks — Orange
  [SearchEntityType.Issue]:
    'bg-label-orange-bg text-label-orange-text hover:bg-label-orange-hover border border-subtle',

  // Canvases — Emerald (teal equivalent)
  [SearchEntityType.Whiteboard]:
    'bg-label-emerald-bg text-label-emerald-text hover:bg-label-emerald-hover border border-subtle',

  // People — Purple
  [SearchEntityType.User]:
    'bg-label-purple-bg text-label-purple-text hover:bg-label-purple-hover border border-subtle',
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/features/mention/ui/ChatMentionChip.tsx
git commit -m "feat(mention): apply category-based colors to ChatMentionChip

Mirrors MentionChip styling with identical category color mapping.

Co-Authored-By: Claude Sonnet 4.5 (1M context) <noreply@anthropic.com>"
```

---

## Verification Tasks

- [ ] **Step 1: TypeScript compilation check**

Run: `cd client && pnpm tsc --noEmit`
Expected: No errors

- [ ] **Step 2: Build check**

Run: `cd client && pnpm build`
Expected: Successful build

- [ ] **Step 3: Visual smoke test** (manual)

1. Open the app and navigate to a page with BlockNote editor
2. Type `@` and select different entity types (Page, Issue, User, Whiteboard)
3. Verify chips render with distinct colors matching the category mapping
4. Test dark mode by toggling the theme
5. Open chat and verify `ChatMentionChip` renders identically

---

## Spec Coverage Check

| Spec Requirement | Task |
|---|---|
| Documents (Page, VaultFile, VaultFolder) → Indigo | Task 1, Task 2 |
| Issue → Orange | Task 1, Task 2 |
| Whiteboard → Emerald | Task 1, Task 2 |
| User → Purple | Task 1, Task 2 |
| Orphaned state unchanged | Verified (danger classes untouched) |
| Dark mode support | Automatic via CSS custom properties |

---

**Plan complete and saved to `docs/superpowers/plans/2026-04-27-mention-chip-styling.md`.**

**Two execution options:**

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**