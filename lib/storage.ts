import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export async function getStorageItem(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    try { return localStorage.getItem(key); } catch { return null; }
  }
  return await SecureStore.getItemAsync(key);
}

export async function setStorageItem(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    try { localStorage.setItem(key, value); } catch { /* noop */ }
  } else {
    await SecureStore.setItemAsync(key, value);
  }
}
