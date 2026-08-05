import { getTasks } from '../db/taskRepository';
import { supabase } from '../lib/supabase';
import NetInfo from '@react-native-community/netinfo';
import * as SecureStore from 'expo-secure-store';
import { nanoid } from 'nanoid/non-secure';
import * as Calendar from 'expo-calendar';

import { getDatabase } from '../db/database';

export async function syncOfflineQueue() {
  const state = await NetInfo.fetch();
  if (!state.isConnected) {
    return;
  }

  const db = await getDatabase();
  const queue = await db.getAllAsync<any>('SELECT * FROM sync_queue ORDER BY created_at ASC');

  if (queue.length === 0) return;

  console.log(`Replaying ${queue.length} items to Supabase...`);

  for (const item of queue) {
    try {
      if (item.operation === 'INSERT') {
        await supabase.from(item.table_name).insert(JSON.parse(item.payload));
      } else if (item.operation === 'UPDATE') {
        await supabase.from(item.table_name).update(JSON.parse(item.payload)).eq('id', item.record_id);
      } else if (item.operation === 'DELETE') {
        await supabase.from(item.table_name).delete().eq('id', item.record_id);
      }
      // If success, remove from queue
      await db.runAsync('DELETE FROM sync_queue WHERE id = ?', [item.id]);
    } catch (e) {
      console.error('Failed to sync item:', item.id, e);
      // Stop syncing on first error to preserve order
      break;
    }
  }
}

export async function exportToCalendar() {
  const { status } = await Calendar.requestCalendarPermissionsAsync();
  if (status === 'granted') {
    const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
    const defaultCalendar = calendars.find(cal => cal.isPrimary) || calendars[0];
    
    if (defaultCalendar) {
      const tasks = await getTasks();
      for (const t of tasks) {
        if (t.due_date && t.status === 'confirmed') {
          await Calendar.createEventAsync(defaultCalendar.id, {
            title: t.title,
            startDate: new Date(t.due_date),
            endDate: new Date(new Date(t.due_date).getTime() + 60 * 60 * 1000), // 1 hour
            ...(t.description ? { notes: t.description } : {}),
            ...(t.course_code ? { location: t.course_code } : {}),
          });
        }
      }
      return true;
    }
  }
  return false;
}
