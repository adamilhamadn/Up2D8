import { View, Text, Pressable, AccessibilityInfo } from 'react-native';
import { useState, useEffect } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

interface DraftTaskCardProps {
  title: string;
  confidence: 'high' | 'low';
  dateStr?: string;
  onConfirm: () => void;
  onDismiss: () => void;
}

export function DraftTaskCard({ title, confidence, dateStr, onConfirm, onDismiss }: DraftTaskCardProps) {
  const isHigh = confidence === 'high';
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => subscription.remove();
  }, []);

  const handlePress = (action: () => void) => {
    Haptics.selectionAsync();
    action();
  };

  return (
    <View className="bg-surface rounded-md border border-border p-md flex flex-col gap-md">
      <View className="flex-row items-start justify-between gap-sm">
        <View className="flex-row items-start gap-sm flex-1">
          {isHigh ? (
            <View 
              className="w-2 h-2 rounded-full bg-text-primary mt-1.5 flex-shrink-0" 
              accessibilityLabel="High confidence extraction"
            />
          ) : (
            <View 
              className="w-2 h-2 rounded-full border border-text-tertiary mt-1.5 flex-shrink-0" 
              accessibilityLabel="Low confidence, date not found"
            />
          )}
          <View>
            <Text className="text-[17px] font-medium leading-tight text-text-primary">{title}</Text>
            <View className="flex-row items-center gap-1 mt-xs">
              <MaterialIcons 
                name={isHigh ? 'calendar-today' : 'help-outline'} 
                size={14} 
                color="#8E8E93" 
              />
              <Text className="text-[13px] text-text-secondary">
                {dateStr || "Couldn't find a date"}
              </Text>
            </View>
          </View>
        </View>
      </View>
      
      <View className="flex-row items-center justify-end gap-sm pt-sm border-t border-border">
        <Pressable 
          onPress={() => handlePress(onDismiss)}
          className="px-md py-sm rounded-full active:opacity-50"
          accessibilityRole="button"
          accessibilityLabel={`Dismiss ${title}`}
        >
          <Text className="text-[15px] text-text-secondary font-medium">Dismiss</Text>
        </Pressable>
        
        <Pressable 
          onPress={() => handlePress(onConfirm)}
          className={`bg-surface-raised px-lg py-sm rounded-full border border-border flex-row items-center gap-2 active:opacity-50 ${!reduceMotion ? 'active:scale-95' : ''}`}
          accessibilityRole="button"
          accessibilityLabel={isHigh ? `Confirm ${title}` : `Add date for ${title}`}
        >
          <MaterialIcons name={isHigh ? 'check' : 'edit'} size={18} color="#FFFFFF" />
          <Text className="text-[15px] text-text-primary font-medium">
            {isHigh ? 'Confirm' : 'Add Date'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
