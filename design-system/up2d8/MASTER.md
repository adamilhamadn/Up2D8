# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** Up2D8
**Updated:** 2026-08-03
**Category:** Student Productivity (Mobile App)
**Aesthetic:** Monochrome Mastery — Pure black/white/gray. Color is functional, never decorative.

---

## Global Rules

### Color Palette (Dark Mode — Default)

| Role | Hex | CSS Variable |
|------|-----|--------------|
| Background | `#000000` | `--bg` |
| Surface | `#111111` | `--surface` |
| Surface Raised | `#1C1C1E` | `--surface-raised` |
| Border | `#2C2C2E` | `--border` |
| Text Primary | `#FFFFFF` | `--text-primary` |
| Text Secondary | `#8E8E93` | `--text-secondary` |
| Text Tertiary | `#48484A` | `--text-tertiary` |

### Color Palette (Light Mode)

| Role | Hex | CSS Variable |
|------|-----|--------------|
| Background | `#FFFFFF` | `--bg` |
| Surface | `#F2F2F7` | `--surface` |
| Surface Raised | `#FFFFFF` | `--surface-raised` |
| Border | `#E5E5EA` | `--border` |
| Text Primary | `#000000` | `--text-primary` |
| Text Secondary | `#8E8E93` | `--text-secondary` |
| Text Tertiary | `#C7C7CC` | `--text-tertiary` |

### User-Selectable Accent Colors

| Name | Hex | Variable |
|------|-----|----------|
| Graphite (default) | `#8E8E93` | `--accent` |
| Tomato | `#FF3B30` | `--accent` |
| Ocean | `#007AFF` | `--accent` |
| Mint | `#34C759` | `--accent` |
| Amethyst | `#AF52DE` | `--accent` |
| Tangerine | `#FF9500` | `--accent` |

**Accent applies to:** Active tab indicator, primary action buttons, category badge dots, confirm actions only.

### Typography (Inter Variable — iOS HIG Scale)

| Role | Size | Weight | Line Height |
|------|------|--------|-------------|
| Screen Title | `34px` | Bold (700) | `41px` |
| Section Header | `22px` | Bold (700) | `28px` |
| Task Title | `17px` | Regular (400) | `22px` |
| Body | `15px` | Regular (400) | `20px` |
| Caption | `13px` | Regular (400) | `18px` |
| Micro Badge | `11px` | Medium (500) | `13px` |

**Google Fonts:**
```
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
```

### Spacing

| Token | Value |
|-------|-------|
| `--space-xs` | `4px` |
| `--space-sm` | `8px` |
| `--space-md` | `16px` |
| `--space-lg` | `24px` |
| `--space-xl` | `32px` |

### Border Radius

| Token | Value |
|-------|-------|
| `--radius-sm` | `8px` |
| `--radius-md` | `12px` |
| `--radius-lg` | `16px` |
| `--radius-pill` | `999px` |

---

## Style Guidelines

**Style:** Monochrome Mastery
**Inspiration:** Things 3, Cron/Notion Calendar, Apple Reminders iOS 18, Amie, Structured, Todoist
**Keywords:** Monochrome, minimal, native-feeling, tactile, whitespace-driven, OLED-friendly
**Best For:** Mobile productivity apps, student tools, task managers, calendar apps

### Key Principles
- Beauty comes from clarity, whitespace, and typography — not gradients or color.
- Color is data (category dots, urgency indicators), never decoration.
- Every micro-interaction has haptic feedback for tactile satisfaction.
- The app feels like a premium physical planner, not a cluttered dashboard.

---

## Anti-Patterns (Do NOT Use)

- ❌ Gradient blobs or glowing neon borders
- ❌ Emojis as functional icons (use Lucide SVG)
- ❌ Robot/AI copy — every string must be friendly and human
- ❌ Purple/cyan/magenta cyberpunk colors in default theme
- ❌ Navy or dark blue backgrounds (use true black `#000000`)
- ❌ Color used decoratively (only functional)
- ❌ Instant state changes without transitions (use 150-200ms ease-out)
- ❌ Low contrast text below 4.5:1 ratio
- ❌ Animations that ignore `prefers-reduced-motion`

---

## Pre-Delivery Checklist

- [ ] No gradient blobs or neon anywhere
- [ ] All icons from Lucide (consistent SVG set)
- [ ] Every string is friendly, human, conversational
- [ ] Background is `#000000` (dark) or `#FFFFFF` (light)
- [ ] Accent color used only for active states and buttons
- [ ] Typography follows iOS HIG scale
- [ ] Every interactive element has haptic response
- [ ] 4.5:1 contrast ratio on all text
- [ ] `prefers-reduced-motion` respected
- [ ] Touch targets minimum 44×44px
- [ ] Widgets follow native platform design language
