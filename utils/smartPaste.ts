import * as Clipboard from 'expo-clipboard';
import { supabase } from '../lib/supabase';
import { Task } from '../db/types';
import * as Haptics from 'expo-haptics';

export async function processSmartPaste(): Promise<Omit<Task, 'id' | 'created_at' | 'updated_at'> | null> {
  const hasString = await Clipboard.hasStringAsync();
  if (!hasString) {
    throw new Error('Clipboard is empty.');
  }

  const text = await Clipboard.getStringAsync();
  
  if (text.length < 10) {
    throw new Error('Copied text is too short');
  }

  // Call Supabase Edge Function
  const { data, error } = await supabase.functions.invoke('smart-paste', {
    body: { text },
  });

  if (error || !data) {
    throw new Error('Couldn\'t understand text');
  }

  // The function returns a placeholder Task object
  // Set default status to 'draft'
  return {
    ...data,
    status: 'draft',
  } as Omit<Task, 'id' | 'created_at' | 'updated_at'>;
}
