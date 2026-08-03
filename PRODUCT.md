# Product

<!-- impeccable:product-schema 1 -->

## Platform

adaptive

## Stack

React Native + Expo Router v3 + NativeWind + Supabase + Expo SQLite + expo-notifications + react-native-reanimated v4 + react-native-gesture-handler + expo-haptics

## Users

University students who need to track coursework, project deadlines, exam dates, and campus announcements scattered across Ulearn, Telegram groups, slides, and syllabuses. They check their phones during commutes, between lectures, and during late-night study sessions.

## Product Purpose

Up2D8 aggregates messy academic deadlines into a distraction-free, monochrome mobile workspace. It replaces manual calendar entry with AI-assisted parsing (Smart Paste & Smart Upload) and Telegram forwarding, offering native hardware phone reminders, home screen widgets, time-blocking, quick capture, focus timers, and unlisted schedule link sharing.

## Positioning

Unlike generic calendar tools or bloated task managers, Up2D8 is a local-first, privacy-focused academic hub designed specifically for student workflows. It features a "Drafts Inbox" safety barrier against AI hallucinations, hardware-level reminders with zero background battery drain, and a pure monochrome aesthetic with user-customizable accent colors.

## Operating Context

Students checking deadlines on mobile during commutes, late-night study sessions, and between lectures. Works 100% offline with zero latency via local SQLite database. Home screen widgets provide passive visibility without opening the app.

## Capabilities and Constraints

### Ingestion
- **Smart Paste:** Paste raw text → LLM extracts task title, category, due date.
- **Smart Upload:** Upload screenshot → Vision AI extracts tasks in-memory, immediately discards image (privacy).
- **Telegram Bot Bridge:** Forward messages to bot → pairing via 6-digit one-time code → auto-creates draft tasks.

### Staging & Management
- **Drafts Inbox:** AI-extracted tasks staged with confidence indicators. Students verify before committing to calendar.
- **Category Hubs:** Dedicated sections for Projects, Exams, Coursework, and University Announcements.
- **Multi-Dimensional Filter:** Group tasks by Course/Subject, Date, Time Window, and Category.

### Productivity
- **Time-Blocking Timeline:** Drag tasks from list onto a vertical daily timeline to block study sessions.
- **Quick Capture:** < 3 taps to add a task via natural language ("Submit report next Friday 5pm").
- **Focus Timer:** 25-minute Pomodoro countdown attached to any task card.
- **Milestone Celebrations:** Haptic vibration pattern + subtle animation when clearing all tasks or achieving Inbox Zero.

### System Integration
- **Native Phone Reminders:** `expo-notifications` local OS scheduling (no background battery drain).
- **Home Screen Widgets:** iOS WidgetKit + Android AppWidgets with interactive check-off.
- **Contextual Bottom Nav:** Primary action button adapts to current screen context.
- **Shareable Schedule Links:** Unlisted deep links (`up2d8://share/:token`) for 1-tap importing.
- **Custom Theme Colors:** User-selectable accent color (Graphite, Tomato, Ocean, Mint, Amethyst, Tangerine).

## Brand Commitments

- **Name:** Up2D8
- **Tone:** Clean, precise, effortless, friendly.
- **Visual Style:** Pure monochrome (black, white, dark gray). No AI slop. No gradient blobs. No neon. Color is functional, never decorative.
- **UX Copy:** Conversational. Talks like a calm, helpful classmate. Uses easy-to-understand words.

## Evidence on Hand

No real student data, testimonials, or case studies yet. All demo content must be labeled synthetic. No fabricated university names, course codes, or professor names.

## Product Principles

1. **Zero AI Slop:** AI is an invisible assistant staging drafts, never an unverified decision-maker. Every AI extraction goes through the Drafts Inbox for human verification.
2. **Glanceable & Frictionless:** Important deadlines are reachable in 1 tap (Widgets, Native Reminders, Quick Capture). Adding a task takes < 3 taps.
3. **Local-First & Private:** Student data loads instantly offline. Raw Vision screenshots are processed in-memory and immediately discarded. No student credentials are ever stored.
4. **Craft Over Decoration:** Beauty comes from clarity, whitespace, and typography — not from gradients, glows, or color splashes.

## Accessibility & Inclusion

- Minimum 4.5:1 contrast ratio on all text (WCAG AA).
- `prefers-reduced-motion` respected for all animations.
- All interactive elements have haptic feedback and sufficient touch targets (44×44px minimum).
- Screen reader compatible labels on all functional elements.
