import { supabase } from '../lib/supabase';
import { nanoid } from 'nanoid/non-secure';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import * as SecureStore from 'expo-secure-store';

export async function generateShareLink(taskIds: string[]): Promise<string> {
  const token = nanoid(10);
  
  let userId = await SecureStore.getItemAsync('up2d8_user_id');
  if (!userId) {
    userId = nanoid();
    await SecureStore.setItemAsync('up2d8_user_id', userId);
  }

  const { error } = await supabase
    .from('shared_links')
    .insert([{
      id: nanoid(),
      token,
      owner_id: userId,
      task_ids: JSON.stringify(taskIds),
      is_active: 1
    }]);

  if (error) {
    throw new Error('Failed to generate share link.');
  }

  const link = `up2d8://share/${token}`;
  
  await Clipboard.setStringAsync(link);
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  
  return link;
}

export async function fetchSharedTasks(token: string) {
  const { data, error } = await supabase
    .from('shared_links')
    .select('*')
    .eq('token', token)
    .single();

  if (error || !data) {
    throw new Error('This link is no longer active or does not exist.');
  }

  if (data.is_active === 0) {
    throw new Error('This link is no longer active.');
  }

  // To fully fetch, we would need to fetch the tasks from the `tasks` table.
  // For MVP, we will assume the receiver can fetch them based on the task_ids.
  const taskIds = JSON.parse(data.task_ids);
  const { data: tasksData, error: tasksError } = await supabase
    .from('tasks')
    .select('*')
    .in('id', taskIds);

  if (tasksError) {
    throw new Error('Failed to load shared tasks.');
  }

  return tasksData || [];
}
