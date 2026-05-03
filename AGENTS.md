# Collabify Design System — AGENTS.md
> Complete reference for refactoring every UI component, layout, and page to use the Collabify Design System.
> Match Linear's visual atmosphere + Plane's token depth. Zero shadcn tokens. Zero arbitrary CSS values.

---

## 0. The Golden Rule

**One source of truth: `globals.css`.**

Every color, radius, shadow, and spacing value you use in a component MUST come from a token defined there.
Never use raw hex, `rgb()`, `opacity-[0.x]` tricks, or Tailwind's default color palette (`blue-500`, `gray-200`, etc.).

---

## 1. Layer Hierarchy (Read This First)

The entire app is built on three levels of depth. Get this right and everything else falls into place.

```
app root        → bg-canvas          (ONE per app. body/html only. Never repeat.)
  └── page      → bg-surface-1       (Full-page panels. Sidebar, main content area.)
        └── sidebar → bg-surface-1   (Siblings of each other. NOT nested.)
        └── main    → bg-surface-1
              └── card      → bg-layer-1    (Content inside a surface.)
                    └── inner → bg-layer-2  (Content inside a layer.)
                          └── deep  → bg-layer-3 (Max depth. Rarely needed.)
```

### Rules
| Rule | Correct | Wrong |
|------|---------|-------|
| Canvas is used once | `<body>` only | Using `bg-canvas` on any child element |
| Surfaces are siblings | Sidebar + Main are both `bg-surface-1` | Nesting `bg-surface-1` inside another surface |
| Layer number must match parent surface | Surface-1 → Layer-1 | Surface-1 → Layer-2 for first card |
| Never skip a layer | 1 → 2 → 3 | 1 → 3 |
| Use transparent layers on image/gradient bg | `bg-layer-transparent-hover` | `bg-layer-1-hover` on colored bg |

---

## 2. Token Quick Reference

### Backgrounds — use with `bg-*`

| Token | `bg-` class | When to use |
|-------|-------------|-------------|
| `--bg-canvas` | `bg-canvas` | Body/app root only |
| `--bg-surface-1` | `bg-surface-1` | Sidebar, main panel, page |
| `--bg-surface-2` | `bg-surface-2` | Elevated panels, second-level panels |
| `--bg-layer-1` | `bg-layer-1` | Cards, list items, table rows |
| `--bg-layer-1-hover` | `bg-layer-1-hover` | Hover state on layer-1 elements |
| `--bg-layer-1-active` | `bg-layer-1-active` | Active/pressed state |
| `--bg-layer-1-selected` | `bg-layer-1-selected` | Selected/checked state |
| `--bg-layer-2` | `bg-layer-2` | Nested cards, input backgrounds |
| `--bg-layer-2-hover` | `bg-layer-2-hover` | Hover on layer-2 |
| `--bg-layer-3` | `bg-layer-3` | Tooltips, deeply nested |
| `--bg-layer-transparent` | `bg-layer-transparent` | Invisible base for hover-only items |
| `--bg-layer-transparent-hover` | `bg-layer-transparent-hover` | Nav items, icon buttons on any bg |
| `--bg-accent-primary` | `bg-accent-primary` | Primary CTA buttons |
| `--bg-accent-primary-hover` | `bg-accent-primary-hover` | Hover on primary buttons |
| `--bg-accent-subtle` | `bg-accent-subtle` | Accent chip backgrounds |
| `--bg-danger-primary` | `bg-danger-primary` | Destructive action buttons |
| `--bg-danger-subtle` | `bg-danger-subtle` | Danger state backgrounds |
| `--bg-warning-subtle` | `bg-warning-subtle` | Warning banners |
| `--bg-success-subtle` | `bg-success-subtle` | Success states |
| `--bg-backdrop` | `bg-backdrop` | Modal/dialog overlay |

### Borders — use with `border-*`

| Token | `border-` class | When to use |
|-------|-----------------|-------------|
| `--border-subtle` | `border-subtle` | Default border. Almost all borders. |
| `--border-subtle-1` | `border-subtle-1` | Input borders, slightly visible |
| `--border-strong` | `border-strong` | Dividers, section separators |
| `--border-strong-1` | `border-strong-1` | High-contrast separators |
| `--border-accent-strong` | `border-accent-strong` | Focus rings, active tabs |
| `--border-accent-subtle` | `border-accent-subtle` | Soft accent outlines |
| `--border-danger-strong` | `border-danger-strong` | Error input state |
| `--border-success-strong` | `border-success-strong` | Success input state |

### Text — use with `text-*`

| Token | `text-` class | When to use |
|-------|---------------|-------------|
| `--txt-primary` | `text-primary` | Body text, headings |
| `--txt-secondary` | `text-secondary` | Captions, metadata, labels |
| `--txt-tertiary` | `text-tertiary` | Placeholder-like, de-emphasized |
| `--txt-placeholder` | `text-placeholder` | Input placeholders |
| `--txt-disabled` | `text-disabled` | Disabled UI text |
| `--txt-on-color` | `text-on-color` | White text on colored bg (buttons) |
| `--txt-accent-primary` | `text-accent-primary` | Accent colored text, links |
| `--txt-danger-primary` | `text-danger-primary` | Error messages |
| `--txt-success-primary` | `text-success-primary` | Success messages |
| `--txt-warning-primary` | `text-warning-primary` | Warning messages |

---

## 3. Typography Scale

Font sizes follow a pixel-named scale. Use them by name, never by Tailwind's default `text-sm/base/lg`.

| Class | Size | Use case |
|-------|------|----------|
| `text-10` | 10px | Tiny labels, keyboard shortcuts |
| `text-11` | 11px | Count badges, compact timestamps |
| `text-12` | 12px | Secondary metadata, form hints |
| `text-13` | 13px | **Default body** (Linear standard) |
| `text-14` | 14px | Prominent body, form labels |
| `text-16` | 16px | Section subheadings |
| `text-18` | 18px | Modal titles, card headings |
| `text-20` | 20px | Page titles |
| `text-24` | 24px | Section headings |
| `text-32` | 32px | Display headings |
| `text-40` | 40px | Hero / marketing headings |

### Letter spacing — for headings only

```tsx
<h1 className="text-32 tracking-title font-semibold">...</h1>
<h2 className="text-24 tracking-tight font-semibold">...</h2>
// tracking-display (-0.066em) for hero text only
// Never add tracking to body text
```

### Font weights
| Class | Weight | Use case |
|-------|--------|----------|
| `font-light` | 300 | De-emphasized, rarely used |
| `font-normal` | 400 | All body text |
| `font-medium` | 500 | Labels, nav items, button text |
| `font-semibold` | 600 | Headings, modal titles |

---

## 4. Radius Scale

| Class | Size | Use case |
|-------|------|----------|
| `rounded-micro` | 2px | Icon buttons in toolbars, inline badges |
| `rounded-xs` | 3px | Compact chips |
| `rounded-sm` | 4px | Small containers, tags |
| `rounded-md` | 6px | Buttons, inputs |
| `rounded-lg` | 8px | Cards, dropdown menus |
| `rounded-xl` | 12px | Modals, sheets, large panels |
| `rounded-2xl` | 22px | Large feature panels |
| `rounded-full` | 9999px | Avatars, pills, toggle switches |

---

## 5. Shadows

| Class | Use case |
|-------|----------|
| `shadow-raised-100` | Cards lifted slightly off surface |
| `shadow-raised-200` | Slightly more elevation (hover states) |
| `shadow-overlay-100` | Dropdown menus, popovers |
| `shadow-overlay-200` | Context menus, floating panels |
| `shadow-dialog` | Modals / dialogs (Linear multi-layer shadow) |

---

## 6. Interaction State Rules

Every interactive element needs hover + focus states. Use these patterns exactly:

```tsx
// Nav item (transparent base)
<button className="
  bg-layer-transparent hover:bg-layer-transparent-hover
  active:bg-layer-transparent-active
  text-secondary hover:text-primary
  transition-colors duration-150
">

// List item / table row
<tr className="
  hover:bg-layer-1-hover active:bg-layer-1-active
  transition-colors duration-100
">

// Selected nav item
<li className="bg-layer-1-selected text-primary font-medium">

// Primary button
<button className="
  bg-accent-primary hover:bg-accent-primary-hover
  text-on-color font-medium
  active:scale-[0.98] transition-all
">

// Ghost / icon button
<button className="
  bg-layer-transparent hover:bg-layer-1
  text-secondary hover:text-primary
  rounded-md p-1.5
">
```

**Never use `opacity-50` for disabled states.** Use `text-disabled bg-layer-1 pointer-events-none` instead.

---

## 7. Component Patterns

### Button Variants

```tsx
// Primary — main CTA
"bg-accent-primary hover:bg-accent-primary-hover text-on-color rounded-md px-3 py-1.5 text-13 font-medium"

// Secondary — secondary actions
"bg-layer-2 hover:bg-layer-2-hover text-primary border border-subtle rounded-md px-3 py-1.5 text-13 font-medium"

// Ghost — toolbar, icon buttons
"bg-layer-transparent hover:bg-layer-transparent-hover text-secondary hover:text-primary rounded-md p-1.5"

// Destructive
"bg-danger-primary hover:bg-danger-primary/90 text-on-color rounded-md px-3 py-1.5 text-13 font-medium"

// Outline
"border border-subtle hover:bg-layer-1 text-primary rounded-md px-3 py-1.5 text-13 font-medium"
```

### Card / Panel

```tsx
// Standard card (inside surface-1)
"bg-layer-1 border border-subtle rounded-lg p-4"

// Elevated card (hover state)
"bg-layer-1 hover:bg-layer-1-hover border border-subtle rounded-lg p-4 shadow-raised-100 transition-colors"

// Featured / accent card
"bg-accent-subtle border border-accent-subtle rounded-lg p-4"
```

### Input

```tsx
// Default input
"bg-layer-2 border border-subtle-1 rounded-md px-3 py-1.5 text-13 text-primary placeholder:text-placeholder"

// Error state
"bg-layer-2 border border-danger-strong rounded-md px-3 py-1.5"

// Focus state (handled by :focus-visible global)
// Do not manually add ring classes — the global reset handles it
```

### Dialog / Modal

```tsx
// Overlay
"fixed inset-0 bg-backdrop z-[var(--z-overlay)]"

// Content panel
"bg-surface-2 border border-subtle rounded-xl shadow-dialog z-[var(--z-modal)] p-6"

// Header
"border-b border-subtle pb-4 mb-4"

// Title
"text-18 font-semibold text-primary tracking-tight"

// Description
"text-13 text-secondary"
```

### Dropdown / Popover

```tsx
// Container
"bg-surface-2 border border-subtle rounded-lg shadow-overlay-100 p-1"

// Item
"flex items-center gap-2 px-2 py-1.5 text-13 text-primary rounded-md hover:bg-layer-1-hover cursor-default"

// Separator
"border-t border-subtle my-1"

// Label / header
"px-2 py-1 text-11 text-tertiary font-medium uppercase tracking-wide"
```

### Badge / Chip

```tsx
// Default
"bg-layer-2 text-secondary text-11 font-medium px-2 py-0.5 rounded-full"

// Accent
"bg-accent-subtle text-accent-primary text-11 font-medium px-2 py-0.5 rounded-full"

// Success
"bg-success-subtle text-success-primary text-11 font-medium px-2 py-0.5 rounded-full"

// Danger
"bg-danger-subtle text-danger-primary text-11 font-medium px-2 py-0.5 rounded-full"

// Warning
"bg-warning-subtle text-warning-primary text-11 font-medium px-2 py-0.5 rounded-full"
```

### Sidebar Navigation Item

```tsx
// Inactive
"flex items-center gap-2.5 px-2 py-1.5 rounded-md text-13 font-medium
 text-secondary bg-layer-transparent
 hover:bg-layer-transparent-hover hover:text-primary
 transition-colors duration-100"

// Active / Selected
"flex items-center gap-2.5 px-2 py-1.5 rounded-md text-13 font-medium
 text-primary bg-layer-1-selected"
```

### Table

```tsx
// Table wrapper
"bg-surface-1 border border-subtle rounded-lg overflow-hidden"

// Header row
"bg-layer-1 border-b border-subtle"

// Header cell
"px-4 py-2.5 text-11 font-medium text-tertiary uppercase tracking-wide text-left"

// Body row
"border-b border-subtle hover:bg-layer-transparent-hover transition-colors"

// Body cell
"px-4 py-2.5 text-13 text-primary"
```

### Tabs

```tsx
// Tab list
"flex gap-1 border-b border-subtle"

// Tab trigger (inactive)
"px-3 py-2 text-13 font-medium text-secondary border-b-2 border-transparent
 hover:text-primary transition-colors duration-100"

// Tab trigger (active)
"px-3 py-2 text-13 font-medium text-primary border-b-2 border-accent-strong"
```

### Skeleton

```tsx
"bg-layer-1 animate-pulse rounded-md"
// Width/height determined by context
```

### Separator / Divider

```tsx
// Horizontal
"w-full h-px bg-border-subtle my-2"

// Vertical
"w-px h-full bg-border-subtle mx-2"
```

### Avatar

```tsx
// Container
"rounded-full overflow-hidden bg-layer-2 flex items-center justify-center"

// Fallback text
"text-11 font-semibold text-secondary"

// Size variants: size-6 (24px), size-7 (28px), size-8 (32px), size-10 (40px)
```

---

## 8. Layout Constants

```tsx
// Top header bar height
"h-[var(--height-header)]"  // 3.25rem

// Left sidebar width
"w-[var(--width-sidebar)]"  // 15rem

// Sidebar rail (icon-only mode)
"w-[var(--width-sidebar-rail)]"  // 3.5rem

// Page content padding
"px-[var(--padding-page)] py-[var(--padding-page)]"  // 1.35rem
```

---

## 9. Z-Index — Always Use Variables

```tsx
"z-[var(--z-dropdown)]"   // 100 — dropdown menus
"z-[var(--z-sticky)]"     // 200 — sticky headers
"z-[var(--z-overlay)]"    // 300 — modal backdrop
"z-[var(--z-modal)]"      // 400 — modal content
"z-[var(--z-toast)]"      // 500 — toasts
"z-[var(--z-tooltip)]"    // 600 — tooltips
```

---

## 10. Status / Label Colors (Issue Labels, Priority)

Use the extended palette tokens directly via CSS variables. Do **not** use Tailwind's color palette.

```tsx
// Inline style for dynamic label colors
style={{ backgroundColor: `var(--ext-${color}-200)`, color: `var(--ext-${color}-700)` }}

// Example
style={{ backgroundColor: 'var(--ext-violet-200)', color: 'var(--ext-violet-700)' }}
```

---

## 11. Prohibited Patterns

Never use these in component code:

| ❌ Prohibited | ✅ Use instead |
|--------------|---------------|
| `bg-background` | `bg-canvas` or `bg-surface-1` |
| `bg-card` | `bg-layer-1` |
| `bg-muted` | `bg-layer-1` or `bg-layer-2` |
| `bg-accent` | `bg-layer-2` |
| `bg-primary` | `bg-accent-primary` |
| `bg-destructive` | `bg-danger-primary` |
| `bg-secondary` | `bg-layer-1` |
| `text-foreground` | `text-primary` |
| `text-muted-foreground` | `text-secondary` or `text-tertiary` |
| `text-primary-foreground` | `text-on-color` |
| `text-destructive` | `text-danger-primary` |
| `border-input` | `border-subtle-1` |
| `border-border` | `border-subtle` |
| `ring-ring` | `outline-border-accent` (handled by global reset) |
| `#hex` / `rgb()` | Any `--bg-*` / `--txt-*` / `--border-*` token |
| `gray-200`, `blue-500` | Use semantic tokens only |
| `dark:*` variants | All tokens auto-switch in dark mode |
| `opacity-50` for disabled | `text-disabled pointer-events-none` |

---

## 12. Collabify-Specific Patterns

### Chat Message Bubble
```tsx
// Others' messages
"bg-layer-1 text-primary rounded-lg rounded-tl-sm px-3 py-2 text-13"

// Own messages
"bg-accent-subtle text-primary rounded-lg rounded-tr-sm px-3 py-2 text-13"
```

### Kanban Column
```tsx
// Column header
"bg-surface-1 border-b border-subtle px-3 py-2.5"

// Column body
"bg-surface-1 flex flex-col gap-2 p-2"

// Kanban card
"bg-layer-1 hover:bg-layer-1-hover border border-subtle rounded-lg p-3
 shadow-raised-100 cursor-pointer transition-colors duration-100"
```

### Issue Priority Indicator
```tsx
// Using extended palette
const priorityColors = {
  urgent: 'var(--ext-red-500)',
  high:   'var(--ext-orange-500)',
  medium: 'var(--ext-yellow-500)',
  low:    'var(--ext-grey-500)',
  none:   'var(--ext-grey-700)',
}
```

### Page Header (top of content area)
```tsx
"flex items-center justify-between h-[var(--height-header)]
 border-b border-subtle px-[var(--padding-page)]
 bg-surface-1"
```

---

## 13. Scrollbar Usage

```tsx
// Hide scrollbar (overflow still works)
"overflow-y-auto scrollbar-hide"

// Thin scrollbar (2px)
"overflow-y-auto scrollbar-xs"

// Default thin scrollbar (4px)
"overflow-y-auto scrollbar-sm"

// Standard scrollbar (6px) — default body behavior
"overflow-y-auto scrollbar-md"
```

---

## 14. Animation Usage

```tsx
// Fade in on mount
"animate-fade-in"

// Slide up (for toasts, tooltips)
"animate-slide-up"

// Scale in (for dropdowns, popovers)
"animate-scale-in"

// Loading skeleton pulse
"animate-pulse-subtle"
```
