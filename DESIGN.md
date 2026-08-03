# Design System: Up2D8

<!-- impeccable:design-schema 1 -->

## Core Aesthetic: Aesthetic Minimalism (Non-AI-Slop)

Up2D8 follows a refined, distraction-free **Aesthetic Minimalism** design direction tailored for high-focus academic management. The visual language avoids generic "AI slop" (overly saturated gradient blobs, unverified automatic state changes, emoji icons) in favor of crisp typography, tactile haptic feedback, subtle glassmorphic borders, and deep dark-mode contrast.

---

## 1. Color Palette & Theming

### Master Night Indigo Theme (Default Dark)
| Token | Hex | CSS / Native Variable | Usage |
|---|---|---|---|
| Primary | `#4338CA` | `--color-primary` | Main active elements, brand accents |
| Accent / CTA | `#7C3AED` | `--color-accent` | Primary buttons, active tab indicators |
| Background | `#0F172A` | `--color-background` | Deep slate app background |
| Surface / Card | `#131936` | `--color-surface` | Task card containers, modal sheets |
| Foreground / Text | `#FFFFFF` | `--color-foreground` | Primary text headings |
| Muted Text | `#94A3B8` | `--color-muted-text` | Subtitles, metadata, timestamps |
| Glass Border | `rgba(255,255,255,0.08)` | `--color-border` | Subtle 1px container borders |
| Destructive | `#DC2626` | `--color-destructive` | Dismiss, delete, cancel actions |
| Warning / Draft | `#F59E0B` | `--color-warning` | Low-confidence AI draft badges |

### Customizable Theme Palettes
- **Minimal Dark** (Default): Deep Slate `#0F172A` + Night Indigo `#4338CA`
- **Cyberpunk**: Pitch Black `#050505` + Neon Cyan `#06B6D4` + Electric Magenta `#EC4899`
- **Pastel Glow**: Soft Charcoal `#18181B` + Lavender `#C084FC` + Mint `#34D399`
- **Monochrome**: Obsidian `#000000` + Pure White `#FFFFFF` + Slate `#475569`

---

## 2. Typography Hierarchy

- **Font Family**: `Inter` (Variable Font)
- **H1 / Screen Titles**: `28px` / `1.2` line-height / Bold (`700`)
- **H2 / Section Headers**: `20px` / `1.3` line-height / SemiBold (`600`)
- **Body / Task Titles**: `16px` / `1.5` line-height / Medium (`500`)
- **Metadata / Timestamps**: `13px` / `1.4` line-height / Regular (`400`) / Muted Text
- **Micro Badges**: `11px` / `1.0` line-height / Uppercase Bold (`700`) / Letter-spacing `0.5px`

---

## 3. Key Components & Interaction Specs

### A. Task Cards
- **Container**: Rounded `16px`, background `#131936`, 1px border `rgba(255,255,255,0.08)`.
- **Category Badge**: Top-left pill with category color code (Coursework: Blue `#3B82F6`, Project: Purple `#A855F7`, Exam: Red `#EF4444`, Info: Teal `#14B8A6`).
- **Urgency Indicator**: Right-aligned urgency badge (Critical < 24h: Red pulse indicator, Impending < 3d: Amber, Upcoming: Subtle slate).
- **Actions**: 1-tap "Set Phone Reminder" icon button, swipe-to-complete gesture.

### B. Drafts Inbox Staging Items
- **Visual Callout**: Left border indicator (`#F59E0B` Amber for items needing review).
- **Confidence Badge**: Displays AI extraction score (e.g. `95% Confidence` or `Review Date`).
- **Control Bar**: 1-tap "Confirm Task" button + "Due date missing? Add manually" inline trigger.

### C. Category Hubs & Sticky Filter Pills
- **Navigation**: Horizontal scrollable filter pills (`Projects`, `Exams`, `Coursework`, `Announcements`).
- **Active Pill**: Solid `#7C3AED` background with white bold text.
- **Inactive Pill**: Transparent background with `#1E293B` border and muted text.

### D. Home Screen Widgets
- **Compact (2x2)**: Displays 2 most critical upcoming deadlines with clear color-coded category badges.
- **Medium (4x2)**: Displays 3 upcoming tasks with due dates, course codes, and urgency indicators.
- **Large (4x4)**: Full agenda timeline with Drafts Inbox badge count indicator.

---

## 4. Anti-Patterns & Quality Floor

- ❌ **No emojis as icons**: Always use vector icons (Lucide / Feather SVG sets).
- ❌ **No AI Slop / Unverified Auto-Commit**: AI parsed data MUST be visibly distinguishable in the Drafts Inbox before user confirmation.
- ❌ **No background process battery drain**: All OS alarms must use native hardware local notification scheduling (`expo-notifications`).
- ❌ **No low-contrast gray text**: Maintain minimum 4.5:1 WCAG contrast ratio for all text elements.
- ❌ **No 0ms instant state changes**: Micro-interactions must use 150-200ms ease-out transitions for tactile feedback.
