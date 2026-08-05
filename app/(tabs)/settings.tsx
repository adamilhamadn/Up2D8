import React from 'react';
import { View, Text, Pressable, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';
import { ThemeMode } from '../../theme/ThemeContext';
import { AccentColorName, AccentColors } from '../../theme/colors';
import Constants from 'expo-constants';
import * as Haptics from 'expo-haptics';
import { MaterialIcons } from '@expo/vector-icons';
import { useTasks } from '../../db/TaskContext';
import { checkTelegramConnection, disconnectTelegram, generateTelegramCode } from '../../utils/telegramIntegration';
import { exportToCalendar, syncOfflineQueue } from '../../utils/syncService';
import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

export default function SettingsScreen() {
  const { colors, accent, accentName, setAccent, themeMode, setThemeMode } = useTheme();
  
  const [isTelegramConnected, setIsTelegramConnected] = useState(false);
  const [telegramCode, setTelegramCode] = useState<string | null>(null);
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'offline'>('synced');

  useEffect(() => {
    checkTelegramConnection().then(setIsTelegramConnected);
    
    const unsubscribe = NetInfo.addEventListener(state => {
      if (!state.isConnected) {
        setSyncStatus('offline');
      } else {
        setSyncStatus('syncing');
        syncOfflineQueue().then(() => setSyncStatus('synced'));
      }
    });

    return () => unsubscribe();
  }, []);

  const handleConnectTelegram = async () => {
    setIsGeneratingCode(true);
    try {
      const code = await generateTelegramCode();
      setTelegramCode(code);
    } catch (e) {
      alert("Failed to generate code. Please check your connection.");
    } finally {
      setIsGeneratingCode(false);
    }
  };

  const handleDisconnectTelegram = async () => {
    await disconnectTelegram();
    setIsTelegramConnected(false);
    setTelegramCode(null);
  };

  const handleAccentSelect = (name: AccentColorName) => {
    Haptics.selectionAsync();
    setAccent(name);
  };

  const handleClearData = () => {
    Alert.alert(
      "Clear All Data",
      "Are you sure you want to delete all tasks and settings? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Clear", 
          style: "destructive",
          onPress: async () => {
            const { clearAllData } = await import('../../db/taskRepository');
            await clearAllData();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            alert("All data cleared.");
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-bg px-md" edges={['top']}>
      <Text className="text-[34px] font-bold text-text-primary mb-md pt-md" style={{ letterSpacing: 0.37 }}>
        Settings
      </Text>
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        
        {/* Appearance Section */}
        <View className="mb-xl">
          <Text className="text-[13px] font-semibold text-text-secondary uppercase mb-sm ml-2">Appearance</Text>
          
          <View className="bg-surface rounded-2xl overflow-hidden mb-md border border-border">
            <View className="flex-row p-1 bg-surface-raised m-2 rounded-xl">
              {(['system', 'light', 'dark'] as ThemeMode[]).map((mode) => (
                <Pressable
                  key={mode}
                  onPress={() => { Haptics.selectionAsync(); setThemeMode(mode); }}
                  className={`flex-1 py-2 items-center rounded-lg ${themeMode === mode ? 'bg-text-primary' : 'bg-transparent'}`}
                >
                  <Text className={`text-[13px] font-semibold capitalize ${themeMode === mode ? 'text-bg' : 'text-text-primary'}`}>
                    {mode}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View className="flex-row flex-wrap px-4 py-3 justify-between border-t border-border">
              {(Object.keys(AccentColors) as AccentColorName[]).map((name) => {
                const colorValue = AccentColors[name];
                const isSelected = accentName === name;
                return (
                  <Pressable
                    key={name}
                    onPress={() => handleAccentSelect(name)}
                    className="w-10 h-10 rounded-full items-center justify-center m-1"
                    style={{ backgroundColor: colorValue }}
                  >
                    {isSelected && <MaterialIcons name="check" size={20} color="#FFFFFF" />}
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>

        {/* Integrations Section */}
        <View className="mb-xl">
          <Text className="text-[13px] font-semibold text-text-secondary uppercase mb-sm ml-2">Integrations</Text>
          
          <View className="bg-surface rounded-2xl overflow-hidden border border-border">
            {isTelegramConnected ? (
              <Pressable onPress={handleDisconnectTelegram} className="flex-row items-center justify-between px-md py-4 active:opacity-70">
                <View className="flex-row items-center gap-x-3">
                  <MaterialIcons name="send" size={24} color={accent} />
                  <Text className="text-[17px] text-text-primary">Telegram connected ✓</Text>
                </View>
                <Text className="text-[15px] text-[#FF3B30]">Disconnect</Text>
              </Pressable>
            ) : telegramCode ? (
              <View className="px-md py-4">
                <Text className="text-[15px] text-text-primary mb-2 text-center">
                  Send this code to @Up2D8Bot
                </Text>
                <Text className="text-[34px] font-bold text-center tracking-widest" style={{ color: accent }}>
                  {telegramCode}
                </Text>
                <Text className="text-[13px] text-text-secondary mt-2 text-center">
                  Code expires in 5 minutes
                </Text>
              </View>
            ) : (
              <Pressable onPress={handleConnectTelegram} disabled={isGeneratingCode} className="flex-row items-center justify-between px-md py-4 active:opacity-70">
                <View className="flex-row items-center gap-x-3">
                  <MaterialIcons name="send" size={24} color={colors.textPrimary} />
                  <Text className="text-[17px] text-text-primary">{isGeneratingCode ? 'Connecting...' : 'Connect Telegram'}</Text>
                </View>
                <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
              </Pressable>
            )}
          </View>
        </View>

        {/* Data Section */}
        <View className="mb-xl">
          <View className="flex-row justify-between items-center mb-sm ml-2 mr-2">
            <Text className="text-[13px] font-semibold text-text-secondary uppercase">Data</Text>
            <View className="flex-row items-center">
              <View 
                className="w-2 h-2 rounded-full mr-2" 
                style={{ 
                  backgroundColor: syncStatus === 'synced' ? '#34C759' : syncStatus === 'syncing' ? '#FF9500' : '#8E8E93' 
                }} 
              />
              <Text className="text-[11px] text-text-secondary">
                {syncStatus === 'synced' ? 'Synced' : syncStatus === 'syncing' ? 'Syncing...' : 'Offline'}
              </Text>
            </View>
          </View>

          {syncStatus === 'offline' && (
            <Text className="text-[13px] text-text-secondary mb-3 mx-2">
              You're offline. Everything still works.
            </Text>
          )}
          
          <View className="bg-surface rounded-2xl overflow-hidden border border-border">
            <Pressable onPress={async () => {
              Haptics.selectionAsync();
              const success = await exportToCalendar();
              if (success) {
                alert("Tasks exported to your calendar.");
              } else {
                alert("Failed to export. Need calendar permissions.");
              }
            }} className="flex-row items-center justify-between px-md py-4 border-b border-border active:opacity-70">
              <Text className="text-[17px] text-text-primary">Export Tasks (.ics)</Text>
              <MaterialIcons name="event" size={24} color={colors.textSecondary} />
            </Pressable>
            <Pressable onPress={handleClearData} className="flex-row items-center justify-between px-md py-4 active:opacity-70">
              <Text className="text-[17px] text-[#FF3B30]">Clear All Data</Text>
            </Pressable>
          </View>
        </View>

        {/* About Section */}
        <View className="mb-xl">
          <Text className="text-[13px] font-semibold text-text-secondary uppercase mb-sm ml-2">About</Text>
          
          <View className="bg-surface rounded-2xl overflow-hidden border border-border px-md py-4">
            <View className="flex-row justify-between mb-2">
              <Text className="text-[17px] text-text-primary font-semibold">Up2D8</Text>
              <Text className="text-[17px] text-text-secondary">v{Constants.expoConfig?.version || '1.0.0'}</Text>
            </View>
            <Text className="text-[15px] text-text-secondary">Made for students.</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
