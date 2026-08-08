import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Modal, AccessibilityInfo } from 'react-native';
import { useTheme } from '../theme';
import { Task } from '../db/types';
import Animated, { useSharedValue, useAnimatedProps, withTiming, Easing, runOnJS, cancelAnimation } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { MaterialIcons } from '@expo/vector-icons';
import { useTasks } from '../db/TaskContext';
import Svg, { Circle } from 'react-native-svg';

interface FocusTimerOverlayProps {
  task: Task | null;
  visible: boolean;
  onClose: () => void;
}

const TOTAL_SECONDS = 25 * 60; // 25 minutes
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const SIZE = 280;
const STROKE_WIDTH = 12;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function FocusTimerOverlay({ task, visible, onClose }: FocusTimerOverlayProps) {
  const { colors, accent } = useTheme();
  const { updateTaskStatus } = useTasks();
  
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS);
  const [isRunning, setIsRunning] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  
  const progress = useSharedValue(1);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  // Sync Reanimated ring with time
  useEffect(() => {
    if (visible) {
      const targetProgress = timeLeft / TOTAL_SECONDS;
      if (reduceMotion) {
        progress.value = targetProgress;
      } else {
        progress.value = withTiming(targetProgress, { duration: 1000, easing: Easing.linear });
      }
    }
  }, [timeLeft, visible, reduceMotion, progress]);

  // Reset when opening a new task
  useEffect(() => {
    if (visible) {
      setTimeLeft(TOTAL_SECONDS);
      progress.value = 1;
      setIsRunning(false);
    }
  }, [visible, task, progress]);

  const handleComplete = () => {
    setIsRunning(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // ponytail: status enum has no 'in_progress' — 'confirmed' is the active state
    if (task) updateTaskStatus(task.id, 'confirmed');
    onClose();
  };

  const handleToggle = () => {
    Haptics.selectionAsync();
    setIsRunning(!isRunning);
  };

  const handleCancel = () => {
    Haptics.selectionAsync();
    setIsRunning(false);
    onClose();
  };

  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: CIRCUMFERENCE * (1 - progress.value)
    };
  });

  if (!task) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={handleCancel}>
      <View className="flex-1 items-center justify-center bg-bg px-md">
        
        <Text className="text-[22px] font-bold text-text-primary mb-xl text-center px-4" style={{ letterSpacing: 0.35 }}>
          {task.title}
        </Text>

        <View className="w-72 h-72 items-center justify-center mb-xl relative">
          <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} style={{ transform: [{ rotate: '-90deg' }] }}>
            {/* Background Ring */}
            <Circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              stroke={colors.border}
              strokeWidth={STROKE_WIDTH}
              fill="transparent"
              opacity={0.5}
            />
            {/* Progress Ring */}
            <AnimatedCircle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              stroke={accent}
              strokeWidth={STROKE_WIDTH}
              fill="transparent"
              strokeDasharray={CIRCUMFERENCE}
              animatedProps={animatedProps}
              strokeLinecap="round"
            />
          </Svg>
          <View className="absolute inset-0 items-center justify-center">
            <Text className="text-[64px] font-bold text-text-primary tabular-nums" style={{ letterSpacing: -1 }}>
              {timeString}
            </Text>
          </View>
        </View>

        {/* Controls */}
        <View className="flex-row items-center justify-center gap-x-6 w-full px-xl">
          <Pressable 
            onPress={handleCancel}
            className="w-16 h-16 rounded-full bg-surface items-center justify-center active:opacity-70"
          >
            <MaterialIcons name="close" size={28} color={colors.textSecondary} />
          </Pressable>

          <Pressable 
            onPress={handleToggle}
            className="w-20 h-20 rounded-full items-center justify-center active:scale-95"
            style={{ backgroundColor: accent }}
          >
            <MaterialIcons name={isRunning ? "pause" : "play-arrow"} size={40} color="#FFFFFF" />
          </Pressable>

          <View className="w-16 h-16" /> {/* Placeholder for balance */}
        </View>

      </View>
    </Modal>
  );
}
