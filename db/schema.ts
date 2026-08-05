export const TASKS_SCHEMA = `
  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    course_code TEXT,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT CHECK(category IN ('Coursework','Project','Exam','Info') OR category IS NULL),
    due_date TEXT,
    confidence_score REAL,
    source TEXT CHECK(source IN ('Telegram','SmartPaste','SmartUpload','Manual') OR source IS NULL),
    status TEXT CHECK(status IN ('draft','confirmed','completed','archived')) DEFAULT 'draft',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );
`;

export const REMINDERS_SCHEMA = `
  CREATE TABLE IF NOT EXISTS reminders (
    id TEXT PRIMARY KEY,
    task_id TEXT REFERENCES tasks(id) ON DELETE CASCADE,
    os_notification_id TEXT,
    scheduled_for TEXT,
    status TEXT CHECK(status IN ('active','fired','cancelled')) DEFAULT 'active'
  );
`;

export const TIME_BLOCKS_SCHEMA = `
  CREATE TABLE IF NOT EXISTS time_blocks (
    id TEXT PRIMARY KEY,
    task_id TEXT REFERENCES tasks(id) ON DELETE CASCADE,
    user_id TEXT,
    start_time TEXT,
    end_time TEXT,
    date TEXT
  );
`;

export const SHARED_LINKS_SCHEMA = `
  CREATE TABLE IF NOT EXISTS shared_links (
    id TEXT PRIMARY KEY,
    token TEXT UNIQUE,
    owner_id TEXT,
    task_ids TEXT,
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS sync_queue (
    id TEXT PRIMARY KEY,
    operation TEXT,
    table_name TEXT,
    record_id TEXT,
    payload TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );
`;

export const SCHEMA_STATEMENTS = [
  TASKS_SCHEMA,
  REMINDERS_SCHEMA,
  TIME_BLOCKS_SCHEMA,
  SHARED_LINKS_SCHEMA,
];
