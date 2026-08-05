# Up2D8

> [!WARNING]  
> **Under Development:** This project is currently in the early stages of development and is **not yet ready for use**.

A minimalist student planner that turns messy syllabus screenshots and class chats into a clean timeline of deadlines.

## What It Does

University students deal with deadlines scattered across Ulearn portals, Telegram groups, PDF syllabuses, and lecture slides. Up2D8 aggregates all of that into one distraction-free mobile app:

- **Smart Paste** — paste raw text, AI extracts the deadlines
- **Smart Upload** — upload a screenshot, Vision AI reads it for you
- **Telegram Bot Bridge** — forward class group messages to auto-create draft tasks
- **Drafts Inbox** — AI-extracted tasks are staged for human verification before hitting your calendar
- **Home Screen Widgets** — glanceable deadline counts without opening the app
- **Native Reminders** — hardware-level OS notifications with zero background battery drain
- **Time-Blocking Timeline** — drag tasks onto a visual daily timeline
- **Focus Timer** — 25-minute Pomodoro attached to any task card

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native + Expo (Expo Router v3) |
| Styling | NativeWind (Tailwind CSS for React Native) |
| Animations | react-native-reanimated v4 |
| Gestures | react-native-gesture-handler |
| Haptics | expo-haptics |
| Local DB | Expo SQLite (offline-first) |
| Backend | Supabase (Postgres + Edge Functions) |
| AI | OpenAI GPT-4o-mini (text) + Vision API (screenshots) |

## Getting Started

```bash
# Install dependencies
npm install

# Start the Expo development server
npm start

# Run on specific platforms
npm run android
npm run ios
npm run web
```

## Design Philosophy

Up2D8 follows a **Monochrome Mastery** design language — pure black, white, and gray. Color is never decorative; it is strictly functional (category badges, urgency dots, user-selected accent). Inspired by Things 3, Cron/Notion Calendar, and Apple Reminders.

See [DESIGN.md](DESIGN.md) for the full design system.

## Project Structure

```
app/              # Expo Router file-based routes
components/       # Reusable UI components
theme/            # ThemeContext, color tokens, barrel exports
docs/             # PRD, ADRs, agent infrastructure
assets/           # App icons and splash screen
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo dev server |
| `npm run typecheck` | Run TypeScript strict-mode check |

## License

Private — not open source.
