import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useTheme } from '../theme';
import { Task } from '../db/types';
import Animated, { FadeIn, FadeOut, useSharedValue, useAnimatedStyle, withSpring, runOnJS } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';

interface Block {
  id: string;
  taskId: string;
  title: string;
  start: number; // in hours, e.g. 10.5 = 10:30 AM
  end: number;
}

const DraggableBlock = ({ block, accent, updateBlock, onRemove }: { block: Block, accent: string, updateBlock: (id: string, newStart: number) => void, onRemove: (id: string) => void }) => {
  const translateY = useSharedValue(0);
  const startY = (block.start - 6) * 60;
  const height = (block.end - block.start) * 60;

  const panGesture = Gesture.Pan()
    .onStart(() => {
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
    })
    .onUpdate((e) => {
      translateY.value = e.translationY;
    })
    .onEnd((e) => {
      const newStartY = startY + translateY.value;
      // Snap to 15 min intervals (15px)
      const snappedY = Math.max(0, Math.round(newStartY / 15) * 15);
      const newStartHour = (snappedY / 60) + 6;
      
      translateY.value = withSpring(0, { damping: 15, stiffness: 150 });
      if (newStartHour !== block.start) {
        runOnJS(Haptics.selectionAsync)();
        runOnJS(updateBlock)(block.id, newStartHour);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    top: startY,
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View 
        className="absolute left-12 right-2 rounded-lg p-2 border-l-4 flex-row justify-between"
        style={[animatedStyle, { height, backgroundColor: accent + '20', borderColor: accent }]}
      >
        <Text className="text-[13px] font-semibold flex-1" style={{ color: accent }}>{block.title}</Text>
        <Pressable onPress={() => onRemove(block.id)} className="p-1 -m-1">
          <Text className="text-[11px]" style={{ color: accent }}>✕</Text>
        </Pressable>
      </Animated.View>
    </GestureDetector>
  );
};

export function TimelineView({ tasks }: { tasks: Task[] }) {
  const { colors, accent } = useTheme();

  const hours = Array.from({ length: 19 }, (_, i) => i + 6); // 6 AM to 12 AM (24:00)

  const [timeBlocks, setTimeBlocks] = useState<Block[]>([
    { id: '1', taskId: tasks[0]?.id || 't1', title: tasks[0]?.title || 'Study Session', start: 10.5, end: 12 },
    { id: '2', taskId: tasks[1]?.id || 't2', title: tasks[1]?.title || 'Project Work', start: 14, end: 16.5 },
  ]);

  const updateBlock = (id: string, newStartHour: number) => {
    setTimeBlocks(prev => prev.map(b => {
      if (b.id === id) {
        const duration = b.end - b.start;
        return { ...b, start: newStartHour, end: newStartHour + duration };
      }
      return b;
    }));
  };

  const removeBlock = (id: string) => {
    Haptics.selectionAsync();
    setTimeBlocks(prev => prev.filter(b => b.id !== id));
  };

  const addBlock = (task: Task) => {
    Haptics.selectionAsync();
    if (timeBlocks.some(b => b.taskId === task.id)) return; // Already on timeline
    
    // Add to 9 AM default
    setTimeBlocks(prev => [...prev, {
      id: Math.random().toString(),
      taskId: task.id,
      title: task.title,
      start: 9,
      end: 10
    }]);
  };

  const now = new Date();
  const currentHour = now.getHours() + now.getMinutes() / 60;
  const showNowLine = currentHour >= 6 && currentHour <= 24;

  const unblockedTasks = tasks.filter(t => !timeBlocks.some(b => b.taskId === t.id));

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut} className="flex-1 mt-md flex-row">
      
      {/* Side Panel (Unblocked Tasks) */}
      <View className="w-1/3 border-r border-border pr-2">
        <Text className="text-[13px] font-semibold text-text-secondary uppercase mb-sm">Unblocked</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          {unblockedTasks.map(task => (
            <Pressable 
              key={task.id} 
              onPress={() => addBlock(task)}
              className="bg-surface p-2 rounded-lg mb-2 border border-border active:opacity-70"
            >
              <Text className="text-[13px] text-text-primary font-medium" numberOfLines={2}>{task.title}</Text>
            </Pressable>
          ))}
          {unblockedTasks.length === 0 && (
            <Text className="text-[11px] text-text-tertiary mt-2">All tasks blocked!</Text>
          )}
          {unblockedTasks.length > 0 && (
            <Text className="text-[11px] text-text-tertiary mt-2">Tap to block</Text>
          )}
        </ScrollView>
      </View>

      {/* Timeline Grid */}
      <View className="flex-1 pl-2 relative">
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          {hours.map(hour => (
            <View key={hour} className="flex-row h-[60px]">
              <Text className="text-[11px] text-text-secondary w-10 mt-[-7px]">
                {hour === 24 ? '12 AM' : hour > 12 ? `${hour - 12} PM` : hour === 12 ? '12 PM' : `${hour} AM`}
              </Text>
              <View className="flex-1 border-t border-border border-dashed relative">
                {/* 30-min gridline */}
                <View className="absolute top-[30px] left-0 right-0 h-[1px] border-t border-border opacity-30 border-dashed" />
              </View>
            </View>
          ))}

          {/* Render TimeBlocks */}
          {timeBlocks.map(block => (
            <DraggableBlock 
              key={block.id} 
              block={block} 
              accent={accent} 
              updateBlock={updateBlock} 
              onRemove={removeBlock} 
            />
          ))}

          {/* Now Line */}
          {showNowLine && (
            <View 
              className="absolute left-12 right-0 h-[2px] z-10 flex-row items-center pointer-events-none"
              style={{ top: (currentHour - 6) * 60, backgroundColor: accent }}
            >
              <View className="w-2 h-2 rounded-full absolute -left-1" style={{ backgroundColor: accent }} />
            </View>
          )}
        </ScrollView>
      </View>
    </Animated.View>
  );
}
