# Mention Chip Styling Design Spec

**Date:** 2026-04-27
**Status:** Approved
**Components Affected:** `MentionChip`, `ChatMentionChip`

---

## 1. Problem Statement

Mention chips across pages, issue descriptions, and chat all render with identical monochrome styling (`bg-layer-2 text-primary`). This makes it impossible to visually distinguish between entity types at a glance, reducing scanability and discoverability.

---

## 2. Solution Overview

Introduce category-based color coding for mention chips using existing design system tokens. Entity types are grouped into 4 categories, each with distinct visual treatment.

---

## 3. Entity Category Mapping

| Category | Entity Types | Label Token | Visual |
|---|---|---|---|
| **Documents** | Page, VaultFile, VaultFolder | `--label-indigo-*` | Blue-tinted |
| **Tasks** | Issue | `--label-orange-*` | Orange-tinted |
| **Canvases** | Whiteboard | `--label-teal-*` | Teal-tinted |
| **People** | User | `--label-purple-*` | Purple-tinted |

---

## 4. Token Usage

Each chip uses the label token chain from `globals.css`:

| Property | Token | Light Mode Value | Dark Mode Value |
|---|---|---|---|
| Background | `--label-*-bg` | `oklch(0.94 0.022 263)` | `oklch(0.30 0.105 262)` |
| Text | `--label-*-text` | `oklch(0.46 0.175 262)` | `oklch(0.632 0.156 263)` |
| Hover | `--label-*-hover` | `oklch(0.88 0.045 263)` | `oklch(0.386 0.144 262)` |
| Border | `--border-subtle` | `oklch(100% 0 0 / 5%)` | same |

---

## 5. Chip Visual Structure

```
┌─────────────────────────────────────────────────────┐
│  [@]  Display Text                                  │
│   ↑    ↑                                            │
│  Icon  Content (text-primary color)                │
└─────────────────────────────────────────────────────┘
         ↑ rounded-md px-1.5 py-0.5 text-13 font-medium
         ↑ border-subtle (1px)
         ↑ bg: category color (label-*-bg)
         ↑ text: category text color (label-*-text)
         ↑ hover: category hover color (label-*-hover)
```

---

## 6. Orphaned State (Unchanged)

When `entityId` is missing, chip renders with danger styling:

- **Background:** `bg-danger-subtle`
- **Text:** `text-danger-primary`
- **Decoration:** `line-through` on text
- **Cursor:** `cursor-not-allowed`
- **Title:** "This entity no longer exists"

---

## 7. Component Changes

### `MentionChip.tsx`

**CHIP_COLORS map update:**

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

  // Canvases — Teal (using emerald for teal equivalent)
  [SearchEntityType.Whiteboard]:
    'bg-label-emerald-bg text-label-emerald-text hover:bg-label-emerald-hover border border-subtle',

  // People — Purple
  [SearchEntityType.User]:
    'bg-label-purple-bg text-label-purple-text hover:bg-label-purple-hover border border-subtle',
}
```

**Note:** Teal uses `--label-emerald-*` tokens since there's no native teal label token. Emerald provides the best teal-adjacent option.

### `ChatMentionChip.tsx`

Apply identical CHIP_COLORS update to this file.

---

## 8. Implementation Steps

1. Update `CHIP_COLORS` map in `MentionChip.tsx` with category-based colors
2. Update `CHIP_COLORS` map in `ChatMentionChip.tsx` with identical category-based colors
3. Verify dark mode rendering via CSS custom properties (tokens already support dark mode)
4. Verify hover state transitions work correctly
5. Check both components render consistently across:
   - BlockNote editor (page descriptions, issue descriptions)
   - Chat message rendering (RichChatContent.tsx)

---

## 9. Acceptance Criteria

- [ ] All Page, VaultFile, VaultFolder mentions render with indigo styling
- [ ] All Issue mentions render with orange styling
- [ ] All Whiteboard mentions render with emerald (teal) styling
- [ ] All User mentions render with purple styling
- [ ] Orphaned mentions still show danger styling (not affected by change)
- [ ] Chips are visible and distinguishable in both light and dark themes
- [ ] Hover states work correctly (background transitions on hover)
- [ ] Both `MentionChip` and `ChatMentionChip` are visually consistent

---

## 10. Out of Scope

- Adding icons to chips (future enhancement)
- Adding entity-type prefixes (future enhancement)
- Changes to navigation behavior (`useNavigateToEntity`)
- Changes to BlockNote schema or mention creation flow