import { supabase } from '../lib/supabase';
import { getStorageItem, setStorageItem } from '../lib/storage';
import { nanoid } from 'nanoid/non-secure';

export async function generateTelegramCode(): Promise<string> {
  // Generate a random 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Since we might not have a full Auth system yet for MVP,
  // we'll simulate a user ID or use a local one.
  let userId = await getStorageItem('up2d8_user_id');
  if (!userId) {
    userId = nanoid();
    await setStorageItem('up2d8_user_id', userId);
  }

  // 5 minute TTL
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

  // Store in Supabase
  const { error } = await supabase
    .from('telegram_codes')
    .insert([{
      code,
      user_id: userId,
      expires_at: expiresAt
    }]);

  if (error) {
    throw new Error('Failed to generate code.');
  }

  return code;
}

export async function checkTelegramConnection(): Promise<boolean> {
  const userId = await getStorageItem('up2d8_user_id');
  if (!userId) return false;

  const { data, error } = await supabase
    .from('user_preferences')
    .select('telegram_chat_id')
    .eq('user_id', userId)
    .single();

  if (error || !data) return false;

  return !!data.telegram_chat_id;
}

export async function disconnectTelegram(): Promise<void> {
  const userId = await getStorageItem('up2d8_user_id');
  if (!userId) return;

  await supabase
    .from('user_preferences')
    .update({ telegram_chat_id: null })
    .eq('user_id', userId);
}
