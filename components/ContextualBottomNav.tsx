import { View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

export function ContextualBottomNav() {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  return (
    <View className="absolute bottom-0 w-full h-[88px] bg-bg/90 border-t border-border px-md pb-md pt-sm flex-row justify-around items-center z-50">
      <Pressable className="items-center justify-center w-16 active:opacity-50">
        <MaterialIcons name="calendar-today" size={24} color="#8E8E93" />
        <Text className="text-[11px] font-medium text-text-secondary mt-1">Timeline</Text>
      </Pressable>

      <Pressable 
        onPress={handlePress}
        className="flex-row items-center justify-center gap-2 bg-text-primary rounded-full px-6 py-3 shadow-lg active:scale-95 active:opacity-80"
      >
        <Text className="text-bg font-semibold text-[15px]">Confirm All (2)</Text>
      </Pressable>

      <Pressable className="items-center justify-center w-16 active:opacity-50">
        <MaterialIcons name="settings" size={24} color="#8E8E93" />
        <Text className="text-[11px] font-medium text-text-secondary mt-1">Settings</Text>
      </Pressable>
    </View>
  );
}
