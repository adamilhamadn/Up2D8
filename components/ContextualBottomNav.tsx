import { View, Text, Pressable, AccessibilityInfo } from 'react-native';
import { useState, useEffect } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../theme';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
type IconName = keyof typeof MaterialIcons.glyphMap;

interface ContextualBottomNavProps extends BottomTabBarProps {
  primaryActions?: Record<string, { label: string; icon?: IconName; onPress: () => void }>;
}

export function ContextualBottomNav({ state, descriptors, navigation, primaryActions }: ContextualBottomNavProps) {
  const { colors, accent } = useTheme();
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => subscription.remove();
  }, []);

  const handlePrimaryPress = (action: () => void) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    action();
  };

  const handleTabPress = (route: any, isFocused: boolean) => {
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      Haptics.selectionAsync();
      navigation.navigate(route.name, route.params);
    }
  };

  const currentRoute = state.routes[state.index];
  const currentRouteName = currentRoute?.name;
  const primaryAction = currentRouteName ? primaryActions?.[currentRouteName] : undefined;

  return (
    <View className="absolute bottom-0 w-full pb-8 pt-2 bg-bg/95 border-t border-border z-50">
      {/* Primary Action Button (Floating above tabs if exists) */}
      {primaryAction && (
        <View className="absolute -top-14 left-0 right-0 items-center justify-center pointer-events-box-none">
          <Pressable 
            onPress={() => handlePrimaryPress(primaryAction.onPress)}
            className={`flex-row items-center justify-center gap-2 bg-text-primary rounded-full px-6 py-3 shadow-lg active:opacity-80 ${!reduceMotion ? 'active:scale-95' : ''}`}
            accessibilityRole="button"
            accessibilityLabel={primaryAction.label}
          >
            {primaryAction.icon && <MaterialIcons name={primaryAction.icon} size={18} color={colors.bg} />}
            <Text className="text-bg font-semibold text-[15px]" style={{ letterSpacing: -0.24 }}>{primaryAction.label}</Text>
          </Pressable>
        </View>
      )}

      {/* Tab Icons */}
      <View className="flex-row justify-around items-center px-2">
        {state.routes.map((route, index) => {
          const descriptor = descriptors[route.key];
          const options = descriptor?.options;
          const label = options?.tabBarLabel !== undefined ? options.tabBarLabel : options?.title !== undefined ? options.title : route.name;
          const isFocused = state.index === index;
          
          let iconName: IconName = 'circle';
          if (route.name === 'drafts') iconName = 'inbox';
          else if (route.name === 'calendar') iconName = 'calendar-today';
          else if (route.name === 'hubs') iconName = 'dashboard';
          else if (route.name === 'settings') iconName = 'settings';

          return (
            <Pressable 
              key={route.key}
              onPress={() => handleTabPress(route, isFocused)}
              className="items-center justify-center w-16 active:opacity-50 py-2"
              accessibilityRole="tab"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={label as string}
            >
              <MaterialIcons 
                name={iconName} 
                size={24} 
                color={isFocused ? accent : colors.textSecondary} 
              />
              <Text 
                className={`text-[11px] font-medium mt-1`}
                style={{ 
                  color: isFocused ? accent : colors.textSecondary,
                  letterSpacing: 0.06 
                }}
              >
                {label as string}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
