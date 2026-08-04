import { View, Text, Pressable, AccessibilityInfo, Dimensions } from 'react-native';
import { useState, useEffect } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../theme';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS, interpolate, Extrapolation } from 'react-native-reanimated';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 80;

interface DraftTaskCardProps {
  title: string;
  confidence: 'high' | 'medium' | 'low';
  dateStr?: string;
  onConfirm: () => void;
  onDismiss: () => void;
}

export function DraftTaskCard({ title, confidence, dateStr, onConfirm, onDismiss }: DraftTaskCardProps) {
  const { colors, accent } = useTheme();
  const isHigh = confidence === 'high';
  const isMedium = confidence === 'medium';
  const [reduceMotion, setReduceMotion] = useState(false);

  // Gesture state
  const translateX = useSharedValue(0);
  const [hapticFired, setHapticFired] = useState(false); // Ref equivalent in JS closure would be better but state works for simple flags, actually Reanimated worklets can't easily set state without runOnJS. Let's use a shared value for the haptic flag.
  const hasFiredHaptic = useSharedValue(0);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => subscription.remove();
  }, []);

  const handlePress = (action: () => void) => {
    Haptics.selectionAsync();
    action();
  };

  const triggerHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const panGesture = Gesture.Pan()
    .enabled(!reduceMotion)
    .activeOffsetX([-10, 10])
    .onUpdate((event) => {
      // Clamp translation to a reasonable maximum
      translateX.value = Math.max(-120, Math.min(120, event.translationX));
      
      // Fire haptic once when threshold is crossed
      if (Math.abs(translateX.value) >= SWIPE_THRESHOLD && hasFiredHaptic.value === 0) {
        hasFiredHaptic.value = 1;
        runOnJS(triggerHaptic)();
      } else if (Math.abs(translateX.value) < SWIPE_THRESHOLD && hasFiredHaptic.value === 1) {
        hasFiredHaptic.value = 0;
      }
    })
    .onEnd(() => {
      if (translateX.value > SWIPE_THRESHOLD) {
        translateX.value = withSpring(SCREEN_WIDTH, { damping: 15, stiffness: 150 });
        runOnJS(onConfirm)();
      } else if (translateX.value < -SWIPE_THRESHOLD) {
        translateX.value = withSpring(-SCREEN_WIDTH, { damping: 15, stiffness: 150 });
        runOnJS(onDismiss)();
      } else {
        translateX.value = withSpring(0, { damping: 15, stiffness: 150 });
      }
      hasFiredHaptic.value = 0;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const rightRevealStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, 80], [0, 1], Extrapolation.CLAMP),
  }));

  const leftRevealStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, -80], [0, 1], Extrapolation.CLAMP),
  }));

  return (
    <View className="mb-md relative">
      {/* Background Reveal Layers */}
      <View className="absolute inset-0 rounded-md overflow-hidden flex-row justify-between">
        {/* Right swipe (Confirm) reveal - left side */}
        <Animated.View 
          className="flex-1 bg-[#34C759] justify-center pl-md"
          style={rightRevealStyle}
        >
          <MaterialIcons name="check" size={24} color="#FFFFFF" />
        </Animated.View>
        
        {/* Left swipe (Dismiss) reveal - right side */}
        <Animated.View 
          className="flex-1 bg-text-secondary justify-center items-end pr-md"
          style={leftRevealStyle}
        >
          <MaterialIcons name="archive" size={24} color="#FFFFFF" />
        </Animated.View>
      </View>

      <GestureDetector gesture={panGesture}>
        <Animated.View 
          className="bg-surface rounded-md border border-border p-md flex flex-col gap-md"
          style={animatedStyle}
        >
          <View className="flex-row items-start justify-between gap-sm">
            <View className="flex-row items-start gap-sm flex-1">
              {isHigh ? (
                <View 
                  className="w-2 h-2 rounded-full bg-text-primary mt-1.5 flex-shrink-0" 
                  accessibilityLabel="High confidence extraction"
                />
              ) : isMedium ? (
                <View 
                  className="w-2 h-2 rounded-full bg-text-primary opacity-50 mt-1.5 flex-shrink-0" 
                  accessibilityLabel="Medium confidence, review needed"
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
                    color={colors.textSecondary} 
                  />
                  <Text className="text-[13px] text-text-secondary">
                    {isHigh ? (dateStr || "") : isMedium ? "Review needed" : "Couldn't find a date"}
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
              accessibilityLabel={isHigh ? `Confirm ${title}` : isMedium ? `Review ${title}` : `Add date for ${title}`}
            >
              <MaterialIcons name={isHigh ? 'check' : 'edit'} size={18} color={accent} />
              <Text className="text-[15px] text-text-primary font-medium">
                {isHigh ? 'Confirm' : isMedium ? 'Review' : 'Add Date'}
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}
