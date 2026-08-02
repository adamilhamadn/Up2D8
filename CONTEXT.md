# Up2D8

Up2D8 is a mobile app for students that aggregates coursework, projects, exams, and university deadlines from multiple messy sources (Ulearn, Telegram, and syllabuses) using AI extraction, home screen widgets, native OS hardware reminders, customizable themes, and shareable link collaboration.

## Language

### Ingestion & Processing

**Smart Paste**:
Pasting raw unstructured text into the app which is parsed by an LLM to extract actionable deadlines.
_Avoid_: Text import, manual entry, clipboard scrape

**Smart Upload**:
Uploading an image or screenshot of a syllabus, slide, or portal to extract tasks and deadlines via Vision AI.
_Avoid_: Screenshot reader, OCR scanner, image parser

**Extraction Confidence**:
An internal score produced by the AI parser indicating certainty regarding extracted fields (date, title, category).
_Avoid_: AI score, accuracy rate

**Telegram Bot Bridge**:
The backend integration service mapping incoming Telegram messages and user IDs to Up2D8 student accounts.
_Avoid_: Telegram forwarder, bot connector

### Staging & Management

**Drafts Inbox**:
A staging area for AI-extracted tasks that require user verification before being committed to the main task calendar.
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
A dynamic classification (Critical, Impending, Upcoming) assigned to a task based on remaining time until deadline.
_Avoid_: Priority tag, alert level

### Native Notifications & System Integration

**Native System Reminder**:
A hardware-level OS notification/alarm scheduled directly on the phone (`expo-notifications` / iOS Local Notifications / Android AlarmManager) that triggers without requiring the app to run in the background.
_Avoid_: Background sync alarm, app reminder daemon

**Home Screen Widget**:
A native iOS/Android system widget displaying real-time upcoming deadlines directly on the student's phone home screen.
_Avoid_: App snippet, phone card, shortcut box

### Sharing & Customization

**Shareable Schedule Link**:
A secure, unique cryptographically-generated deep link granting unlisted view/import access to a specific task or full course schedule.
_Avoid_: Public link, open URL, invite code

**Theme Palette**:
User-selected color schemes (e.g. Minimal Dark, Neon Cyber, Pastel Glow) that dynamically re-skin the entire application interface.
_Avoid_: Color picker, skin mode

**Unified Calendar**:
The primary view combining all confirmed tasks across categories into interactive Month, Week, and Agenda timelines.
_Avoid_: Schedule view, timeline box
