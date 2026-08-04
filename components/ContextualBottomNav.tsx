import { View, Text, Pressable, AccessibilityInfo } from 'react-native';
import { useState, useEffect } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../theme';

interface NavItem {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  onPress: () => void;
}

interface ContextualBottomNavProps {
  primaryLabel: string;
  primaryIcon?: keyof typeof MaterialIcons.glyphMap;
  onPrimaryPress: () => void;
  leftItem: NavItem;
  rightItem: NavItem;
}

export function ContextualBottomNav({ primaryLabel, primaryIcon, onPrimaryPress, leftItem, rightItem }: ContextualBottomNavProps) {
  const { colors } = useTheme();
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => subscription.remove();
  }, []);

  const handlePrimaryPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPrimaryPress();
  };

  const handleSidePress = (action: () => void) => {
    Haptics.selectionAsync();
    action();
  };

  return (
    <View className="absolute bottom-0 w-full h-[88px] bg-bg/90 border-t border-border px-md pb-md pt-sm flex-row justify-around items-center z-50">
      <Pressable 
        onPress={() => handleSidePress(leftItem.onPress)}
        className="items-center justify-center w-16 active:opacity-50"
        accessibilityRole="tab"
        accessibilityLabel={leftItem.label}
      >
        <MaterialIcons name={leftItem.icon} size={24} color={colors.textSecondary} />
        <Text className="text-[11px] font-medium text-text-secondary mt-1" style={{ letterSpacing: 0.06 }}>{leftItem.label}</Text>
      </Pressable>

      <Pressable 
        onPress={handlePrimaryPress}
        className={`flex-row items-center justify-center gap-2 bg-text-primary rounded-full px-6 py-3 shadow-lg active:opacity-80 ${!reduceMotion ? 'active:scale-95' : ''}`}
        accessibilityRole="button"
        accessibilityLabel={primaryLabel}
      >
        {primaryIcon && <MaterialIcons name={primaryIcon} size={18} color={colors.bg} />}
        <Text className="text-bg font-semibold text-[15px]" style={{ letterSpacing: -0.24 }}>{primaryLabel}</Text>
      </Pressable>

      <Pressable 
        onPress={() => handleSidePress(rightItem.onPress)}
        className="items-center justify-center w-16 active:opacity-50"
        accessibilityRole="tab"
        accessibilityLabel={rightItem.label}
      >
        <MaterialIcons name={rightItem.icon} size={24} color={colors.textSecondary} />
        <Text className="text-[11px] font-medium text-text-secondary mt-1" style={{ letterSpacing: 0.06 }}>{rightItem.label}</Text>
      </Pressable>
    </View>
  );
}
