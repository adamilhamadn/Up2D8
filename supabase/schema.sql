-- Supabase Schema for Up2D8

CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    course_code TEXT,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    due_date TIMESTAMPTZ,
    confidence_score REAL,
    source TEXT,
    status TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE reminders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    os_notification_id TEXT,
    scheduled_for TIMESTAMPTZ,
    status TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE time_blocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    user_id UUID,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    date TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE shared_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    token TEXT UNIQUE NOT NULL,
    owner_id UUID,
    task_ids JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_preferences (
    user_id UUID PRIMARY KEY,
    theme TEXT DEFAULT 'system',
    accent_color TEXT DEFAULT '#007AFF',
    notifications_enabled BOOLEAN DEFAULT true,
    telegram_chat_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE telegram_codes (
    code TEXT PRIMARY KEY,
    user_id UUID NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL
);

-- RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE telegram_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own tasks" ON tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own tasks" ON tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own tasks" ON tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own tasks" ON tasks FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own reminders" ON reminders FOR SELECT USING (auth.uid() = (SELECT user_id FROM tasks WHERE tasks.id = reminders.task_id));
CREATE POLICY "Users can insert their own reminders" ON reminders FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM tasks WHERE tasks.id = reminders.task_id));
CREATE POLICY "Users can update their own reminders" ON reminders FOR UPDATE USING (auth.uid() = (SELECT user_id FROM tasks WHERE tasks.id = reminders.task_id));
CREATE POLICY "Users can delete their own reminders" ON reminders FOR DELETE USING (auth.uid() = (SELECT user_id FROM tasks WHERE tasks.id = reminders.task_id));

CREATE POLICY "Users can view their own time blocks" ON time_blocks FOR SELECT USING (auth.uid() = (SELECT user_id FROM tasks WHERE tasks.id = time_blocks.task_id));
CREATE POLICY "Users can insert their own time blocks" ON time_blocks FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM tasks WHERE tasks.id = time_blocks.task_id));
CREATE POLICY "Users can update their own time blocks" ON time_blocks FOR UPDATE USING (auth.uid() = (SELECT user_id FROM tasks WHERE tasks.id = time_blocks.task_id));
CREATE POLICY "Users can delete their own time blocks" ON time_blocks FOR DELETE USING (auth.uid() = (SELECT user_id FROM tasks WHERE tasks.id = time_blocks.task_id));

CREATE POLICY "Users can view their own shared links" ON shared_links FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Users can insert their own shared links" ON shared_links FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users can update their own shared links" ON shared_links FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Users can delete their own shared links" ON shared_links FOR DELETE USING (auth.uid() = owner_id);

CREATE POLICY "Users can manage their preferences" ON user_preferences FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their telegram codes" ON telegram_codes FOR ALL USING (auth.uid() = user_id);
