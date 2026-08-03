# Up2D8 Product Requirements Document (PRD)

## Problem Statement

University students are overwhelmed by deadlines scattered across incompatible platforms (Ulearn portal, Telegram class groups, PDF syllabuses). Manually tracking dates is tedious, calendar apps lack dedicated category hubs for projects and exams, and traditional reminder apps require background processes that drain battery. Students need glanceable home screen widgets, time-blocking for study sessions, and a way to share schedules with classmates — all wrapped in a clean, distraction-free interface.

## Solution

Up2D8 is a high-performance, monochrome mobile app (built with React Native and Expo) that centralizes student deadlines via Telegram forwarding, text ("Smart Paste"), and screenshot OCR ("Smart Upload"). AI parses data into a "Drafts Inbox" for human verification. Confirmed tasks populate a Unified Calendar, specialized Category Hubs, a draggable Time-Blocking Timeline, and native Home Screen Widgets. Native OS Hardware Reminders fire without background battery drain. Students can customize their accent color, capture tasks in < 3 taps, run focus timers, and share schedules via unlisted deep links.

## User Stories

### Core Ingestion & AI Parsing
1. **As a student**, I want to paste raw text from a syllabus or chat into the app, so that the AI extracts the task title, category, and due date (Smart Paste).
2. **As a student**, I want to upload a screenshot of Ulearn or a lecture slide, so that Vision AI extracts tasks without me typing (Smart Upload).
3. **As a student**, I want to forward messages from my class Telegram groups to the Up2D8 bot, so that deadlines are automatically sent to my drafts.
4. **As a student**, I want the AI to detect duplicate tasks (e.g. same exam date from both Telegram and a screenshot), so that my schedule stays clean.

### Quick Capture & Natural Language
5. **As a student**, I want a quick-add button that opens a minimal text field, so that I can add a task in under 3 taps.
6. **As a student**, I want to type natural language like "Submit report next Friday 5pm" and have it auto-parsed, so that I don't have to fill in separate form fields.

### Staging & Verification (Drafts Inbox)
7. **As a student**, I want AI-extracted tasks to land in a "Drafts Inbox", so that I can verify dates before they hit my calendar.
8. **As a student**, I want a "Couldn't find a date? Add one" fallback, so that I can fill in missing info the AI couldn't parse.
9. **As a student**, I want to bulk-confirm or bulk-dismiss items in the Drafts Inbox, so that I can process a whole syllabus in seconds.
10. **As a student**, I want low-confidence extractions visually highlighted, so that I pay extra attention to ambiguous dates.
11. **As a student**, I want to swipe right on a draft to quick-confirm it, so that reviewing is fast and gestural.

### Task Management, Category Hubs & Filtering
12. **As a student**, I want dedicated Category Hubs (Projects, Exams, Coursework, Announcements), so that I can browse work grouped by section.
13. **As a student**, I want to filter and group tasks by Course, Date, and Time, so that I can focus on one subject at a time.
14. **As a student**, I want a Unified Calendar with Month, Week, and Agenda views, so that I can plan my schedule effectively.
15. **As a student**, I want tasks indicated by small colored dots (not heavy badges), so that I can scan my calendar visually like Amie.
16. **As a student**, I want to mark tasks as completed or archived, so that my active view shows only pending work.
17. **As a student**, I want to manually create and edit tasks, so that I can track personal study goals alongside course deadlines.

### Time-Blocking & Focus
18. **As a student**, I want to drag a task from my list onto a visual daily timeline, so that I can block out study time for it.
19. **As a student**, I want the timeline to show free time as empty whitespace, so that I can see when I'm overbooked.
20. **As a student**, I want a Focus Timer (25-min Pomodoro) attached to any task, so that I can study in focused intervals.
21. **As a student**, I want the timer to show a visual countdown ring on the task card, so that I can see progress at a glance.

### Native Hardware Reminders & Notifications
22. **As a student**, I want a "Remind Me" button on any task, so that a native phone reminder is scheduled without the app running in the background.
23. **As a student**, I want preset reminder times (1 hour, 1 day, custom) shown as quick-select chips, so that setting a reminder is instant.
24. **As a student**, I want to cancel or reschedule reminders with a single tap, so that I stay in control.

### Home Screen Widgets
25. **As a student**, I want a small home screen widget showing "3 due today" in bold monochrome text, so that I see urgency without opening the app.
26. **As a student**, I want a medium widget listing my next 3 tasks with due dates and urgency dots, so that I can scan my day from the home screen.
27. **As a student**, I want a large widget with my full today agenda and interactive checkboxes, so that I can complete tasks directly from my home screen.

### Customization & Theming
28. **As a student**, I want to choose a theme accent color (Graphite, Tomato, Ocean, Mint, Amethyst, Tangerine) in Settings, so that the app matches my personal style.
29. **As a student**, I want the app to be 95% monochrome with my accent color used only for active states and buttons, so that the UI stays clean.
30. **As a student**, I want to switch between Dark Mode and Light Mode, so that I can use the app comfortably at any time of day.

### Sharing & Collaboration
31. **As a student**, I want to generate a shareable link for a task or course schedule, so that I can send it to classmates via WhatsApp or Telegram.
32. **As a student**, I want my classmates to open my link and preview/import the tasks into their own app, without making my schedule public.
33. **As a student**, I want shared links to be unlisted and token-protected, so that only people with the link can access the data.

### System & Experience
34. **As a student**, I want the app to work fully offline, so that I can check my schedule without Wi-Fi.
35. **As a student**, I want to export tasks to Apple Calendar or Google Calendar, so that my academic and personal schedules sync.
36. **As a student**, I want a satisfying haptic vibration and subtle animation when I clear all tasks or achieve Inbox Zero, so that productivity feels rewarding.
37. **As a student**, I want the bottom navigation to show a contextual primary button (e.g. "Review All" in Drafts, "Add Task" on Calendar), so that the most relevant action is always one tap away.

## Implementation Decisions

### Architecture & Tech Stack
- **Frontend:** React Native + Expo (Expo Router v3 for file-based routing & deep linking).
- **Animations:** `react-native-reanimated` v4 (UI thread worklets, 60fps).
- **Gestures:** `react-native-gesture-handler` (swipe-to-complete, drag-to-time-block).
- **Haptics:** `expo-haptics` (selection, success, warning, error feedback).
- **Styling:** NativeWind with CSS variable design tokens for theme switching.
- **Widgets:** Expo Config Plugins + `react-native-widget-extension` (iOS WidgetKit) + Android AppWidgets.
- **Deep Linking:** Expo Linking (`up2d8://` + HTTPS universal links) resolving share tokens from Supabase.
- **Backend:** Supabase (Postgres RLS + Auth + Edge Functions for Telegram webhooks + AI orchestration).
- **Local DB:** Expo SQLite for offline-first local persistence.
- **AI:** OpenAI GPT-4o-mini (text) + GPT-4o / Gemini Vision (screenshots).

### Data Schema
- `Task`: `id`, `user_id`, `course_code`, `title`, `description`, `category` (Coursework|Project|Exam|Info), `due_date` (TIMESTAMPTZ), `confidence_score`, `source` (Telegram|SmartPaste|SmartUpload|Manual), `status` (draft|confirmed|completed|archived).
- `Reminder`: `id`, `task_id`, `os_notification_id`, `scheduled_for` (TIMESTAMPTZ), `status` (active|fired|cancelled).
- `SharedLink`: `id`, `token` (nanoid), `owner_id`, `task_ids` (array), `is_active`, `created_at`.
- `TimeBlock`: `id`, `task_id`, `user_id`, `start_time`, `end_time`, `date`.
- `UserPreferences`: `id`, `user_id`, `accent_color`, `theme_mode` (dark|light|system).

## Testing Decisions

- **Gesture Interaction Tests:** Verify swipe-to-confirm and drag-to-time-block produce correct state mutations.
- **Native Notification Tests:** Unit test `expo-notifications` wrapper for correct OS trigger timestamps and cancellation tracking.
- **Category Hub Filtering:** Verify hubs accurately filter tasks by category without missing items.
- **Deep Link Navigation:** Test `up2d8://share/:token` for valid/invalid token handling.
- **Theme Provider Tests:** Verify all components re-render correctly on accent color and dark/light mode changes.
- **AI Parsing Tests:** Test Smart Paste/Upload against sample syllabuses for schema adherence.
- **Offline Sync:** Test task CRUD while offline, verify queued ops sync on reconnection.

## Out of Scope
- Direct credential-based scraping of Ulearn servers.
- Public social feed (sharing is private, link-only).
- AI auto-confirming tasks without human verification.
