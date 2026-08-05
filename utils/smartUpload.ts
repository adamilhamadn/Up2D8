import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../lib/supabase';
import { Task } from '../db/types';

export async function processSmartUpload(): Promise<Omit<Task, 'id' | 'created_at' | 'updated_at'> | null> {
  // Request permissions
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Need camera roll permissions to upload screenshots.');
  }

  // Pick an image
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: 'images',
    allowsEditing: false,
    quality: 0.7,
    base64: true, // We need base64 to send to edge function
  });

  if (result.canceled || !result.assets || result.assets.length === 0) {
    return null; // User cancelled
  }

  const asset = result.assets[0];
  if (!asset?.base64) {
    throw new Error('Couldn\'t read this image. Try a clearer screenshot.');
  }

  // Call Supabase Edge Function
  const { data, error } = await supabase.functions.invoke('smart-upload', {
    body: { image: asset.base64 },
  });

  // Clear base64 from memory
  (asset as any).base64 = null;

  if (error || !data) {
    throw new Error('Couldn\'t read this image. Try a clearer screenshot.');
  }

  // Return parsed task
  return {
    ...data,
    status: 'draft',
    source: 'SmartUpload'
  } as Omit<Task, 'id' | 'created_at' | 'updated_at'>;
}
