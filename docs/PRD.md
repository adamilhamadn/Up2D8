# Up2D8 Product Requirements Document (PRD)

## Problem Statement

University students are overwhelmed by deadlines scattered across incompatible platforms (Ulearn portal, Telegram class groups, PDF syllabuses). Manually tracking dates is tedious, calendar apps lack dedicated category hubs for projects and exams, and traditional reminder apps require apps to run in the background or drain battery. Furthermore, students need glanceable home screen widgets, aesthetic customization, and 1-tap link sharing with classmates.

## Solution

Up2D8 is a high-performance, highly aesthetic mobile app (built with React Native and Expo) that centralizes student deadlines via Telegram forwarding, text ("Smart Paste"), and screenshot OCR ("Smart Upload"). AI parses data into a "Drafts Inbox" for confirmation. Confirmed tasks populate a Unified Calendar, specialized Category Hubs (Projects, Exams, Coursework), power native Home Screen Widgets, schedule 1-tap Native OS Hardware Reminders (no background battery drain), support custom color themes, and allow 1-tap link sharing with classmates.

## User Stories

### Core Ingestion & AI Parsing
1. **As a student**, I want to paste raw text from a syllabus or chat into the app, so that the AI automatically extracts the task title, category, and due date (Smart Paste).
2. **As a student**, I want to upload a screenshot of Ulearn or a lecture slide, so that Vision AI extracts tasks and deadlines without manual typing (Smart Upload).
3. **As a student**, I want to forward messages from my class Telegram groups to the Up2D8 bot, so that deadlines mentioned in chats are automatically sent to my app inbox.
4. **As a student**, I want the AI to detect potential duplicate tasks (e.g. same exam date from both Telegram and a screenshot), so that my schedule stays clean.

### Staging & Verification (Drafts Inbox)
5. **As a student**, I want AI-extracted tasks to land in a "Drafts Inbox", so that I can review and verify dates before they hit my official calendar.
6. **As a student**, I want a "Due date missing? Add manually" fallback option in the Drafts Inbox, so that I can fill in any missing information the AI couldn't parse.
7. **As a student**, I want to bulk-confirm or bulk-dismiss items in the Drafts Inbox, so that I can process an entire syllabus extraction in seconds.
8. **As a student**, I want low-confidence AI extractions highlighted visually, so that I pay extra attention to verifying ambiguous dates.

### Task Management, Category Hubs & Filtering
9. **As a student**, I want dedicated Category Hubs (Projects Hub, Exams Hub, Coursework Hub, University Announcements), so that I can browse all my upcoming work grouped cleanly by section.
10. **As a student**, I want to filter and group my tasks by Course/Subject, Date, and Date + Time, so that I can focus specifically on a single subject's upcoming workload.
11. **As a student**, I want a Unified Calendar with Month, Week, and Agenda views, so that I can plan my study schedule effectively.
12. **As a student**, I want tasks color-coded by category (Coursework, Project, Exam, University Info), so that I can distinguish task types at a glance.
13. **As a student**, I want to mark tasks as completed or archived, so that my active view focuses only on pending work.
14. **As a student**, I want to manually create and edit custom tasks, so that I can track personal study goals alongside official course deadlines.

### Native Hardware Reminders & System Features
15. **As a student**, I want a "Set Phone Reminder" button on any task card, so that a native OS reminder is scheduled directly on my phone hardware without requiring the app to run in the background.
16. **As a student**, I want to choose custom lead times for my phone reminders (e.g. 1 hour before, 1 day before, or exact custom date/time), so that I am notified at the ideal moment.
17. **As a student**, I want a native Home Screen Widget on my phone, so that I can see my next 3 urgent deadlines without opening the app.
18. **As a student**, I want clear visual Urgency Badges (Critical < 24h, Impending < 3 days, Upcoming), so that I know what requires immediate focus.
19. **As a student**, I want the app to function offline, so that I can check my schedule even without cellular data or Wi-Fi.
20. **As a student**, I want to export confirmed tasks to external calendar apps (Apple iCal / Google Calendar), so that my personal and academic schedules sync.

### Customization & Social Link Sharing
21. **As a student**, I want to customize the app's theme colors (e.g. Minimal Dark, Cyberpunk, Pastel, Neon), so that the app matches my personal visual style.
22. **As a student**, I want to generate a Shareable Schedule Link for a specific task or course schedule, so that I can send it to my classmates via WhatsApp or Telegram.
23. **As a student**, I want my classmates to open my shared link and instantly gain view/import access in their Up2D8 app without making their schedule public.
24. **As a student**, I want shared links to be unlisted and token-protected, so that only people with the explicit link can access the shared schedule data.
25. **As a student**, I want deep linking configured (`up2d8://share/...`), so that clicking a shared link automatically launches the app directly to the preview screen.
26. **As a student**, I want to cancel or reschedule native phone reminders at any time with a single tap, so that I maintain full control over my notifications.

## Implementation Decisions

### Architecture & Tech Stack
- **Frontend Framework:** React Native with Expo (Expo Router v3 for file-based routing & deep linking support).
- **Native Phone Reminders:** `expo-notifications` module using local scheduled notifications (triggers via OS `AlarmManager` on Android & `UNUserNotificationCenter` on iOS without background app processes).
- **Styling & Theming:** NativeWind / CSS variables design system with dynamic theme provider supporting theme switching (Dark, Light, Cyberpunk, Pastel).
- **Home Screen Widgets:** Expo Config Plugins with `react-native-widget-extension` (iOS WidgetKit) and Android AppWidgets.
- **Deep Linking & Link Sharing:** Expo Linking (`up2d8://` and HTTPS universal links) resolving unique share tokens (`/share/:token`) from Supabase.
- **Backend & Database:** Supabase (Postgres RLS for unlisted link security + Auth + Realtime) with Edge Functions for Telegram Webhooks and AI Orchestration.
- **AI Engine:** OpenAI GPT-4o-mini (Text extraction) and GPT-4o / Gemini Vision (Screenshot extraction).

### Data Contracts & Schema
- `Task` entity state: `draft` -> `confirmed` -> `completed` / `archived`.
- `Reminder` entity: `id`, `task_id`, `os_notification_id`, `scheduled_for` (TIMESTAMPTZ), `status` (`active` | `fired` | `cancelled`).
- `SharedLink` entity: `id`, `token` (nanoid), `owner_id`, `task_ids` (array), `is_active`, `created_at`.
- Task fields: `id`, `user_id`, `course_code`, `title`, `description`, `category` (`Coursework`|`Project`|`Exam`|`Info`), `due_date` (TIMESTAMPTZ), `confidence_score`, `source`, `status`.

## Testing Decisions

- **Native Notification Scheduling Tests:** Unit test `expo-notifications` wrapper ensuring correct OS trigger timestamp calculation and notification ID tracking for cancellation.
- **Category Hub Filtering Tests:** Verify Category Hub screens accurately filter tasks by category (`Project`, `Exam`, `Coursework`, `Info`) without missing items.
- **Deep Link Navigation Tests:** Test URL scheme handler (`up2d8://share/:token`) ensuring valid tokens fetch shared payload and invalid tokens show an error modal.
- **Theme Provider Tests:** Verify all UI components re-render correctly when switching visual themes without crashing or flickering.
- **AI Parsing Accuracy Tests:** Test Smart Paste and Smart Upload against sample syllabuses to verify schema adherence.

## Out of Scope
- Full public social media feed (sharing remains private and link-only).
- Direct credential-based scraping of Ulearn servers.
