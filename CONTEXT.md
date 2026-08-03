# Up2D8

Up2D8 is a mobile app for students that aggregates coursework, projects, exams, and university deadlines from multiple messy sources (Ulearn, Telegram, and syllabuses) using AI extraction, home screen widgets, native OS hardware reminders, time-blocking, focus timers, and shareable link collaboration — all wrapped in a pure monochrome aesthetic.

## Language

### Ingestion & Processing

**Smart Paste**:
Pasting raw unstructured text into the app which is parsed by an LLM to extract actionable deadlines.
_Avoid_: Text import, manual entry, clipboard scrape

**Smart Upload**:
Uploading an image or screenshot of a syllabus, slide, or portal to extract tasks and deadlines via Vision AI.
_Avoid_: Screenshot reader, OCR scanner, image parser

**Quick Capture**:
A minimal text field opened in under 3 taps that accepts natural language input (e.g. "Submit report next Friday 5pm") and auto-parses it into a task.
_Avoid_: Quick add, fast entry form

**Extraction Confidence**:
An internal score produced by the AI parser indicating certainty regarding extracted fields (date, title, category). Visualized as dot opacity in the Drafts Inbox.
_Avoid_: AI score, accuracy rate

**Telegram Bot Bridge**:
The backend integration service mapping incoming Telegram messages and user IDs to Up2D8 student accounts via a 6-digit one-time pairing code.
_Avoid_: Telegram forwarder, bot connector

### Staging & Management

**Drafts Inbox**:
A staging area for AI-extracted tasks that require user verification before being committed to the main task calendar. The safety barrier against AI hallucinations.
_Avoid_: Pending list, AI queue, draft folder

**Task**:
An actionable student assignment or event, categorized strictly as Coursework, Project, Exam, or University Info.
_Avoid_: Item, event, to-do, entry

**Category Hubs**:
Dedicated section views (Projects Hub, Exams Hub, Coursework Hub) grouping tasks into focused subject sections based on user input.
_Avoid_: Folder views, tag lists

**Multi-Dimensional Filter**:
Querying and grouping tasks simultaneously across Course/Subject, Date, Time Window, and Category.
_Avoid_: Simple search, basic tag filter

**Urgency Level**:
A dynamic classification (Critical, Impending, Upcoming) assigned to a task based on remaining time until deadline. Visualized as accent-colored dots.
_Avoid_: Priority tag, alert level

### Productivity

**Time-Blocking Timeline**:
A vertical daily timeline where students drag tasks from their list onto specific time slots to block out study sessions. Free time appears as empty whitespace.
_Avoid_: Schedule builder, calendar drag

**Focus Timer**:
A 25-minute Pomodoro countdown ring attached to any task card. When completed, the task auto-marks as "in progress."
_Avoid_: Study timer, work clock

**Milestone Celebration**:
A satisfying haptic vibration pattern and subtle animation triggered when a student clears all tasks for the day or achieves Inbox Zero.
_Avoid_: Achievement badge, gamification reward

### Native Notifications & System Integration

**Native System Reminder**:
A hardware-level OS notification scheduled directly on the phone via `expo-notifications` that triggers without requiring the app to run in the background.
_Avoid_: Background sync alarm, app reminder daemon

**Home Screen Widget**:
A native iOS/Android system widget displaying real-time upcoming deadlines directly on the student's phone home screen. Available in Small, Medium, and Large sizes.
_Avoid_: App snippet, phone card, shortcut box

**Contextual Bottom Nav**:
A bottom navigation bar whose primary action button adapts to the current screen context (e.g. "Review All" in Drafts, "Add Task" on Calendar).
_Avoid_: Adaptive toolbar, smart nav

### Sharing & Customization

**Shareable Schedule Link**:
A secure, unique cryptographically-generated deep link granting unlisted view/import access to a specific task or full course schedule.
_Avoid_: Public link, open URL, invite code

**Theme Accent Color**:
A single user-selected color (Graphite, Tomato, Ocean, Mint, Amethyst, Tangerine) that applies to active states, primary buttons, and category badges while keeping the UI 95% monochrome.
_Avoid_: Color picker, skin mode, theme palette

**Unified Calendar**:
The primary view combining all confirmed tasks across categories into interactive Month, Week, and Agenda timelines.
_Avoid_: Schedule view, timeline box
