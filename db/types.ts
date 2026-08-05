export interface Task {
  id: string;
  user_id?: string | null;
  course_code?: string | null;
  title: string;
  description?: string | null;
  category?: 'Coursework' | 'Project' | 'Exam' | 'Info' | null;
  due_date?: string | null;
  confidence_score?: number | null;
  source?: 'Telegram' | 'SmartPaste' | 'SmartUpload' | 'Manual' | null;
  status: 'draft' | 'confirmed' | 'completed' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface Reminder {
  id: string;
  task_id: string;
  os_notification_id?: string | null;
  scheduled_for?: string | null;
  status: 'active' | 'fired' | 'cancelled';
}

export interface TimeBlock {
  id: string;
  task_id: string;
  user_id?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  date?: string | null;
}

export interface SharedLink {
  id: string;
  token: string;
  owner_id?: string | null;
  task_ids?: string | null; // JSON array of task IDs
  is_active: number; // 0 or 1
  created_at: string;
}
