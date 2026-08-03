# Design System: Up2D8

<!-- impeccable:design-schema 2 -->

## Core Aesthetic: Monochrome Mastery

Up2D8 follows a pure monochrome design language inspired by Things 3, Cron/Notion Calendar, and Apple Reminders. The UI is entirely black, white, and gray. Color is never decorative — it is strictly functional, reserved for category badges, urgency dots, and the user's chosen accent. Every design decision earns its place through clarity, not decoration.

---

## 1. Color Palette

### Dark Mode (Default — OLED-Friendly)

| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | `#000000` | True black background |
| `--surface` | `#111111` | Card/container background |
| `--surface-raised` | `#1C1C1E` | Elevated sheets, modals |
| `--border` | `#2C2C2E` | Subtle 1px dividers |
| `--text-primary` | `#FFFFFF` | Headlines, task titles |
| `--text-secondary` | `#8E8E93` | Metadata, timestamps, subtitles |
| `--text-tertiary` | `#48484A` | Disabled states, placeholder text |

### Light Mode

| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | `#FFFFFF` | Pure white background |
| `--surface` | `#F2F2F7` | Card/container background (iOS system gray 6) |
| `--surface-raised` | `#FFFFFF` | Elevated sheets with shadow |
| `--border` | `#E5E5EA` | Subtle 1px dividers |
| `--text-primary` | `#000000` | Headlines, task titles |
| `--text-secondary` | `#8E8E93` | Metadata, timestamps |
| `--text-tertiary` | `#C7C7CC` | Disabled, placeholder |

### User-Customizable Accent Color (Settings → Theme Color)

The app ships 95% monochrome. One accent color applies to: active tab indicator, primary action buttons, category badge dots, and the "confirm" action in Drafts Inbox.

| Accent Name | Hex | Vibe |
|-------------|-----|------|
| Graphite (default) | `#8E8E93` | Pure monochrome, no accent |
| Tomato | `#FF3B30` | Urgent, energetic |
| Ocean | `#007AFF` | Calm, reliable |
| Mint | `#34C759` | Fresh, calming |
| Amethyst | `#AF52DE` | Creative, personal |
| Tangerine | `#FF9500` | Warm, approachable |

---

## 2. Typography Scale (Inter Variable)

Mirrors the iOS Human Interface Guidelines type ramp for native familiarity.

| Role | Size | Weight | Line Height | Letter Spacing |
|------|------|--------|-------------|----------------|
| Screen Title | `34px` | Bold (700) | `41px` | `0.37px` |
| Section Header | `22px` | Bold (700) | `28px` | `0.35px` |
| Task Title | `17px` | Regular (400) | `22px` | `-0.41px` |
| Body / Description | `15px` | Regular (400) | `20px` | `-0.24px` |
| Caption / Metadata | `13px` | Regular (400) | `18px` | `-0.08px` |
| Micro Badge | `11px` | Medium (500) | `13px` | `0.06px` |

---

## 3. Spacing & Radius

| Token | Value |
|-------|-------|
| `--space-xs` | `4px` |
| `--space-sm` | `8px` |
| `--space-md` | `16px` |
| `--space-lg` | `24px` |
| `--space-xl` | `32px` |
| `--radius-sm` | `8px` |
| `--radius-md` | `12px` |
| `--radius-lg` | `16px` |
| `--radius-pill` | `999px` |

---

## 4. Component Interaction Specs

### Task Card (Inspired by Things 3)

- **Container:** Background `--surface`, border-radius `--radius-md`, 1px border `--border`.
- **Check-off:** Tap circle checkbox → fills with accent color → task title smooth strikethrough (200ms ease-out) → card collapses fluidly → light haptic "success" feedback.
- **Swipe Right:** Quick-confirm from Drafts Inbox (reveals green checkmark).
- **Swipe Left:** Dismiss/archive (reveals gray archive icon).
- **Long Press:** Opens context menu (Edit, Set Reminder, Share, Delete).

### Drafts Inbox Item (Inspired by Amie)

- **Full opacity dot:** High confidence extraction.
- **Half opacity dot + "Review needed" label:** Medium confidence.
- **Hollow ring dot + "Couldn't find a date" label:** Low confidence, needs manual input.
- **Control bar:** 1-tap "Confirm" button + inline "Couldn't find a date? Add one" trigger.

### Category Badge Dots

Category is indicated by a small colored dot, not a full badge:
- Coursework: `#007AFF` (Blue dot)
- Exams: `#FF3B30` (Red dot)
- Projects: `#FF9500` (Orange dot)
- University Info: `#8E8E93` (Gray dot)

### Home Screen Widget (Inspired by Apple Reminders iOS 18)

- **Small (2×2):** Count badge: "3 due today" in large bold text, monochrome.
- **Medium (4×2):** Next 3 upcoming tasks with due date, monochrome + accent urgency dots.
- **Large (4×4):** Full today agenda with interactive checkboxes.

---

## 5. UX Copy Style Guide

The app talks like a calm, helpful classmate. Every word must change behavior. No-ops get cut.

| Situation | ❌ Don't Write | ✅ Write This |
|-----------|---------------|--------------|
| Empty Drafts Inbox | "No pending items awaiting verification." | "All clear! Nothing to review." |
| Task confirmed | "Task successfully moved to confirmed state." | "Added to your schedule." |
| Smart Paste success | "AI extraction completed. 3 entities parsed." | "Found 3 deadlines. Take a look?" |
| Smart Upload processing | "Processing image via Vision AI pipeline..." | "Reading your screenshot..." |
| Reminder set | "Native OS notification scheduled for T-24h." | "You'll get a reminder tomorrow." |
| Error: no date found | "Failed to extract temporal data from input." | "Couldn't find a date. Want to add one?" |
| Inbox Zero achieved | "All draft items have been processed." | "You're all caught up!" |
| Shared link generated | "Cryptographic share token created." | "Link copied! Send it to your friends." |
| Offline mode | "Device is currently disconnected from network." | "You're offline. Everything still works." |

---

## 6. Animation & Haptics Stack

| Layer | Library | Purpose |
|-------|---------|---------|
| Layout transitions | `react-native-reanimated` v4 | Card collapse, list reorder, sheet animations |
| Gesture handling | `react-native-gesture-handler` | Swipe-to-complete, drag-to-time-block |
| Haptic feedback | `expo-haptics` | Selection, success, warning, error patterns |
| Spring physics | Reanimated `withSpring()` | Natural motion (damping: 15, stiffness: 150) |
| Reduced motion | `AccessibilityInfo` | Respects `prefers-reduced-motion` |

All animations run on the UI thread via Reanimated worklets. 60fps guaranteed.

---

## 7. Anti-Slop Checklist

- [ ] No gradient blobs or glowing neon borders
- [ ] No emojis as functional icons (Lucide SVG only)
- [ ] No robot/AI copy — every string is hand-written and friendly
- [ ] No purple/cyan/magenta cyberpunk colors in default theme
- [ ] Color is ONLY functional (accent dots, urgency indicators, category badges)
- [ ] Background is true black or true white, never navy or dark blue
- [ ] Typography follows iOS HIG type ramp
- [ ] Every interactive element has haptic response
- [ ] Minimum 4.5:1 contrast ratio on all text
- [ ] `prefers-reduced-motion` respected
- [ ] Widgets follow native Apple/Android design language
