import { getDatabase } from './database';
import { Task } from './types';
import { nanoid } from 'nanoid/non-secure';

export async function createTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task> {
  const db = await getDatabase();
  const id = nanoid();
  const now = new Date().toISOString();
  
  const newTask: Task = {
    ...task,
    id,
    created_at: now,
    updated_at: now,
  };

  await db.runAsync(
    `INSERT INTO tasks (id, user_id, course_code, title, description, category, due_date, confidence_score, source, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      newTask.id,
      newTask.user_id || null,
      newTask.course_code || null,
      newTask.title,
      newTask.description || null,
      newTask.category || null,
      newTask.due_date || null,
      newTask.confidence_score || null,
      newTask.source || null,
      newTask.status,
      newTask.created_at,
      newTask.updated_at,
    ]
  );
  
  await db.runAsync(
    `INSERT INTO sync_queue (id, operation, table_name, record_id, payload, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
    [nanoid(), 'INSERT', 'tasks', newTask.id, JSON.stringify(newTask), now]
  );
  
  return newTask;
}

export async function getTasks(): Promise<Task[]> {
  const db = await getDatabase();
  return await db.getAllAsync<Task>('SELECT * FROM tasks ORDER BY created_at DESC');
}

export async function getTaskById(id: string): Promise<Task | null> {
  const db = await getDatabase();
  return await db.getFirstAsync<Task>('SELECT * FROM tasks WHERE id = ?', [id]);
}

export async function updateTask(id: string, partial: Partial<Omit<Task, 'id' | 'created_at'>>): Promise<void> {
  const db = await getDatabase();
  const updates: string[] = [];
  const values: any[] = [];
  
  const now = new Date().toISOString();
  partial.updated_at = now;

  for (const [key, value] of Object.entries(partial)) {
    updates.push(`${key} = ?`);
    values.push(value);
  }
  
  if (updates.length === 0) return;

  values.push(id);
  const query = `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`;
  
  await db.runAsync(query, values);

  await db.runAsync(
    `INSERT INTO sync_queue (id, operation, table_name, record_id, payload, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
    [nanoid(), 'UPDATE', 'tasks', id, JSON.stringify(partial), now]
  );
}

export async function deleteTask(id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM tasks WHERE id = ?', [id]);
  await db.runAsync(
    `INSERT INTO sync_queue (id, operation, table_name, record_id, payload, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
    [nanoid(), 'DELETE', 'tasks', id, null, new Date().toISOString()]
  );
}

export async function getTasksByStatus(status: Task['status']): Promise<Task[]> {
  const db = await getDatabase();
  return await db.getAllAsync<Task>('SELECT * FROM tasks WHERE status = ? ORDER BY due_date ASC', [status as any]);
}

export async function getTasksByCategory(category: NonNullable<Task['category']>): Promise<Task[]> {
  const db = await getDatabase();
  return await db.getAllAsync<Task>('SELECT * FROM tasks WHERE category = ? ORDER BY due_date ASC', [category as any]);
}

export async function clearAllData(): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM tasks');
  await db.runAsync('DELETE FROM sync_queue');
}

export async function syncTasksFromCloud(): Promise<void> {
  const { supabase } = await import('../lib/supabase');
  
  // 1. Fetch pending tasks from cloud_tasks table
  const { data, error } = await supabase
    .from('cloud_tasks')
    .select('*');

  if (error || !data || data.length === 0) return;

  // 2. Insert into local SQLite
  const db = await getDatabase();
  for (const cloudTask of data) {
    const newTask: Omit<Task, 'id' | 'created_at' | 'updated_at'> = {
      title: cloudTask.title,
      description: cloudTask.description,
      category: cloudTask.category,
      course_code: cloudTask.course_code,
      due_date: cloudTask.due_date,
      confidence_score: cloudTask.confidence_score,
      status: 'draft', // Force into Drafts
      source: 'telegram'
    };
    
    // We reuse our local createTask which also handles adding to the sync_queue if needed,
    // though ideally we wouldn't sync back what we just pulled. For MVP it's fine.
    await createTask(newTask);
    
    // 3. Delete from cloud so we don't pull it again
    await supabase.from('cloud_tasks').delete().eq('id', cloudTask.id);
  }
}
