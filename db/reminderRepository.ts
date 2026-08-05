import { getDatabase } from './database';
import { Reminder } from './types';
import { nanoid } from 'nanoid/non-secure';

export async function createReminder(reminder: Omit<Reminder, 'id'>): Promise<Reminder> {
  const db = await getDatabase();
  const id = nanoid();
  
  const newReminder: Reminder = {
    ...reminder,
    id,
  };

  await db.runAsync(
    `INSERT INTO reminders (id, task_id, os_notification_id, scheduled_for, status)
     VALUES (?, ?, ?, ?, ?)`,
    [
      newReminder.id,
      newReminder.task_id || null,
      newReminder.os_notification_id || null,
      newReminder.scheduled_for || null,
      newReminder.status || 'active',
    ]
  );
  
  return newReminder;
}

export async function getRemindersForTask(taskId: string): Promise<Reminder[]> {
  const db = await getDatabase();
  return await db.getAllAsync<Reminder>('SELECT * FROM reminders WHERE task_id = ? ORDER BY scheduled_for ASC', [taskId]);
}

export async function updateReminder(id: string, partial: Partial<Reminder>): Promise<void> {
  const db = await getDatabase();
  const updates: string[] = [];
  const values: any[] = [];
  
  for (const [key, value] of Object.entries(partial)) {
    updates.push(`${key} = ?`);
    values.push(value);
  }
  
  if (updates.length === 0) return;

  values.push(id);
  const query = `UPDATE reminders SET ${updates.join(', ')} WHERE id = ?`;
  
  await db.runAsync(query, values);
}
