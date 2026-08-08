import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, AccessibilityInfo } from 'react-native';
import { useTheme } from '../theme';
import { Task } from '../db/types';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, withSpring, Easing, runOnJS, interpolate, Extrapolation } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';

interface TaskCardProps {
  task: Task;
  onPress?: () => void;
  onLongPress?: () => void;
  onComplete?: (taskId: string) => void;
  onArchive?: (taskId: string) => void;
}

const SWIPE_THRESHOLD = -80;
const OFFSCREEN_DISTANCE = -999;

export function TaskCard({ task, onPress, onLongPress, onComplete, onArchive }: TaskCardProps) {
  const { colors, accent } = useTheme();
  const [reduceMotion, setReduceMotion] = useState(false);
  const [isCompleted, setIsCompleted] = useState(task.status === 'completed');

  const checkScale = useSharedValue(isCompleted ? 1 : 0);
  const strikeProgress = useSharedValue(isCompleted ? 1 : 0);
  const cardOpacity = useSharedValue(1);
  const translateX = useSharedValue(0);
  const hasFiredHaptic = useSharedValue(0);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
  }, []);

  const triggerHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleComplete = () => {
    if (isCompleted) return; // Prevent double trigger
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setIsCompleted(true);
    
    const duration = reduceMotion ? 0 : 200;
    
    checkScale.value = withSpring(1, { damping: 15, stiffness: 150 });
    strikeProgress.value = withTiming(1, { duration, easing: Easing.out(Easing.ease) }, () => {
      cardOpacity.value = withTiming(0, { duration });
      if (onComplete) {
        setTimeout(() => onComplete(task.id), duration + 300);
      }
    });
  };

  const panGesture = Gesture.Pan()
    .enabled(!reduceMotion && !isCompleted)
    .activeOffsetX([-10, 10])
    .onUpdate((event) => {
      // Only allow swipe left (archive)
      if (event.translationX > 0) {
        translateX.value = 0;
        return;
      }
      translateX.value = Math.max(-120, event.translationX);
      
      if (translateX.value <= SWIPE_THRESHOLD && hasFiredHaptic.value === 0) {
        hasFiredHaptic.value = 1;
        runOnJS(triggerHaptic)();
      } else if (translateX.value > SWIPE_THRESHOLD && hasFiredHaptic.value === 1) {
        hasFiredHaptic.value = 0;
      }
    })
    .onEnd(() => {
      if (translateX.value <= SWIPE_THRESHOLD) {
        translateX.value = withSpring(OFFSCREEN_DISTANCE, { damping: 15, stiffness: 150 });
        if (onArchive) {
          runOnJS(onArchive)(task.id);
        }
      } else {
        translateX.value = withSpring(0, { damping: 15, stiffness: 150 });
      }
      hasFiredHaptic.value = 0;
    });

  const swipeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const revealStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, SWIPE_THRESHOLD], [0, 1], Extrapolation.CLAMP),
  }));

  const checkAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }]
  }));

  const strikeAnimStyle = useAnimatedStyle(() => ({
    width: `${strikeProgress.value * 100}%`,
    opacity: strikeProgress.value > 0 ? 1 : 0
  }));

  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
  }));

  const getUrgency = (dueDateStr: string | null | undefined) => {
    if (!dueDateStr) return { color: colors.textTertiary, opacity: 1 };
    const now = new Date();
    const due = new Date(dueDateStr);
    const diffHours = (due.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (diffHours < 0) return { color: '#FF3B30', opacity: 1 }; // Overdue
    if (diffHours < 24) return { color: accent, opacity: 1 }; // Critical
    if (diffHours < 72) return { color: accent, opacity: 0.6 }; // Impending
    return { color: colors.textTertiary, opacity: 1 }; // Upcoming
  };

  const urgency = getUrgency(task.due_date);

  let timeStr = '';
  if (task.due_date) {
    const d = new Date(task.due_date);
    timeStr = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }

  return (
    <Animated.View style={cardStyle} className="mb-sm relative">
      {/* Archive Reveal Layer */}
      <View className="absolute inset-0 rounded-xl overflow-hidden flex-row justify-end items-center pr-md bg-text-secondary">
        <Animated.View style={revealStyle}>
          <MaterialIcons name="archive" size={24} color="#FFFFFF" />
        </Animated.View>
      </View>

      <GestureDetector gesture={panGesture}>
        <Animated.View style={swipeAnimatedStyle}>
          <Pressable 
            onPress={onPress}
            onLongPress={onLongPress}
            className="bg-surface rounded-xl p-md flex-row items-start active:opacity-70 border border-border"
          >
            <Pressable 
              onPress={handleComplete}
              className="w-6 h-6 rounded-full border-2 mr-md mt-0.5 items-center justify-center overflow-hidden"
              style={{ borderColor: isCompleted ? accent : colors.border }}
            >
              <Animated.View style={[checkAnimStyle, { backgroundColor: accent, width: 24, height: 24, position: 'absolute' }]} />
              {isCompleted && <MaterialIcons name="check" size={16} color={colors.bg} style={{ zIndex: 1 }} />}
            </Pressable>
            
            <View className="flex-1">
              <View className="flex-row items-center justify-between mb-1">
                <View className="flex-1 relative justify-center">
                  <Text 
                    className={`text-[17px] pr-2 ${isCompleted ? 'text-text-tertiary' : 'text-text-primary'}`} 
                    style={{ letterSpacing: -0.41 }} 
                    numberOfLines={2}
                  >
                    {task.title}
                  </Text>
                  <Animated.View 
                    className="absolute h-[1.5px] bg-text-tertiary top-1/2 left-0" 
                    style={strikeAnimStyle} 
                  />
                </View>
                {/* Urgency dot */}
                <View className="w-2 h-2 rounded-full" style={{ backgroundColor: urgency.color, opacity: urgency.opacity }} />
              </View>
              <View className="flex-row items-center">
                {task.category && (
                  <View 
                    className="w-2 h-2 rounded-full mr-2" 
                    style={{ backgroundColor: { Coursework: '#007AFF', Exam: '#FF3B30', Project: '#FF9500', Info: '#8E8E93' }[task.category] ?? colors.textSecondary }} 
                  />
                )}
                {task.course_code && (
                  <Text className="text-[13px] text-text-secondary mr-2 font-medium">{task.course_code}</Text>
                )}
                {timeStr ? (
                  <Text className="text-[13px] text-text-secondary">{timeStr}</Text>
                ) : null}
              </View>
            </View>
          </Pressable>
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
}
