import React from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../theme';
import Animated, { FadeIn, SlideInDown, SlideOutDown, FadeOut } from 'react-native-reanimated';
import { Task } from '../db/types';
import { useState, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { createReminder } from '../db/reminderRepository';
import * as Haptics from 'expo-haptics';
import { generateShareLink } from '../utils/shareTask';

interface TaskDetailSheetProps {
  task: Task | null;
  visible: boolean;
  onClose: () => void;
  onEdit: () => void;
  onRemind: () => void;
  onComplete: () => void;
  onDelete: () => void;
  onStartFocus: () => void;
}

export function TaskDetailSheet({ task, visible, onClose, onEdit, onRemind, onComplete, onDelete, onStartFocus }: TaskDetailSheetProps) {
  const { colors, accent } = useTheme();
  const [showReminder, setShowReminder] = useState(false);

  useEffect(() => {
    if (!visible) {
      setShowReminder(false);
    }
  }, [visible]);

  if (!visible || !task) return null;

  const categoryColors: Record<string, string> = {
    Coursework: '#007AFF',
    Exam: '#FF3B30',
    Project: '#FF9500',
    Info: '#8E8E93',
  };
  const catColor = task.category ? categoryColors[task.category] : colors.textSecondary;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Animated.View 
        entering={FadeIn.duration(200)} 
        exiting={FadeOut.duration(200)}
        className="flex-1 bg-black/50 justify-end"
      >
        <Pressable className="flex-1" onPress={onClose} />
        <Animated.View 
          entering={SlideInDown.springify().damping(15).stiffness(150)}
          exiting={SlideOutDown.duration(200)}
          className="bg-surface-raised rounded-t-[24px] p-md pb-xl shadow-lg"
        >
          {/* Handle Bar */}
          <View className="items-center mb-md">
            <View className="w-12 h-1.5 bg-border rounded-full" />
          </View>

          <View className="flex-row items-center justify-between mb-sm">
            <View className="flex-row items-center flex-1 pr-4">
              <View className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: catColor }} />
              <Text className="text-[22px] font-bold text-text-primary flex-shrink" numberOfLines={2}>
                {task.title}
              </Text>
            </View>
            <Pressable onPress={onClose} className="p-2 bg-surface rounded-full">
              <MaterialIcons name="close" size={20} color={colors.textSecondary} />
            </Pressable>
          </View>

          {task.course_code && (
            <Text className="text-[15px] font-medium text-text-secondary mb-1">{task.course_code}</Text>
          )}

          {task.due_date && (
            <View className="flex-row items-center mb-md">
              <MaterialIcons name="event" size={16} color={colors.textSecondary} style={{ marginRight: 4 }} />
              <Text className="text-[15px] text-text-secondary">
                {new Date(task.due_date).toLocaleString('en-US', { month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
              </Text>
            </View>
          )}

          {task.description && (
            <View className="bg-surface p-md rounded-xl mb-md">
              <Text className="text-[15px] text-text-primary leading-snug">{task.description}</Text>
            </View>
          )}

          {showReminder ? (
            <View className="mt-sm">
              <Text className="text-[17px] font-bold text-text-primary mb-md">Set Reminder</Text>
              <View className="flex-row flex-wrap gap-2">
                {['1 hour before', '1 day before', 'At due time'].map(label => (
                  <Pressable 
                    key={label}
                    onPress={async () => {
                      Haptics.selectionAsync();
                      const { status } = await Notifications.requestPermissionsAsync();
                      if (status !== 'granted') {
                        alert('Need notification permissions!');
                        return;
                      }

                      if (!task.due_date) {
                        alert('Task has no due date!');
                        return;
                      }

                      let triggerDate = new Date(task.due_date);
                      if (label === '1 hour before') {
                        triggerDate = new Date(triggerDate.getTime() - 3600 * 1000);
                      } else if (label === '1 day before') {
                        triggerDate = new Date(triggerDate.getTime() - 86400 * 1000);
                      }
                      
                      if (triggerDate.getTime() <= Date.now()) {
                        alert('That time has already passed!');
                        return;
                      }

                      const identifier = await Notifications.scheduleNotificationAsync({
                        content: {
                          title: task.title,
                          body: label === 'At due time' ? 'Due now!' : `Due in ${label.replace(' before', '')}`,
                          data: { taskId: task.id },
                        },
                        trigger: triggerDate,
                      });

                      await createReminder({
                        task_id: task.id,
                        os_notification_id: identifier,
                        scheduled_for: triggerDate.toISOString(),
                        status: 'active'
                      });

                      alert(`You'll get a reminder ${label}.`);
                      setShowReminder(false);
                    }}
                    className="flex-1 bg-surface py-3 rounded-xl items-center justify-center min-w-[140px]"
                  >
                    <Text className="text-text-primary font-medium text-[15px]">{label}</Text>
                  </Pressable>
                ))}
                <Pressable onPress={() => setShowReminder(false)} className="w-full bg-border py-3 rounded-xl items-center mt-2">
                  <Text className="text-text-primary font-medium text-[15px]">Cancel</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <View className="flex-row flex-wrap gap-2 mt-sm">
              <Pressable onPress={() => { onClose(); onComplete(); }} className="flex-1 bg-text-primary py-3 rounded-xl items-center flex-row justify-center min-w-[140px]">
                <MaterialIcons name="check" size={20} color={colors.bg} style={{ marginRight: 8 }} />
                <Text className="text-bg font-semibold text-[15px]">Complete</Text>
              </Pressable>
              <Pressable onPress={() => { Haptics.selectionAsync(); setShowReminder(true); }} className="flex-1 bg-surface py-3 rounded-xl items-center flex-row justify-center min-w-[140px]">
                <MaterialIcons name="notifications" size={20} color={colors.textPrimary} style={{ marginRight: 8 }} />
                <Text className="text-text-primary font-medium text-[15px]">Remind Me</Text>
              </Pressable>
              <Pressable onPress={() => { onClose(); onEdit(); }} className="flex-1 bg-surface py-3 rounded-xl items-center flex-row justify-center min-w-[140px]">
                <MaterialIcons name="edit" size={20} color={colors.textPrimary} style={{ marginRight: 8 }} />
                <Text className="text-text-primary font-medium text-[15px]">Edit</Text>
              </Pressable>
              <Pressable onPress={() => { onClose(); onStartFocus(); }} className="flex-1 bg-surface py-3 rounded-xl items-center flex-row justify-center min-w-[140px]">
                <MaterialIcons name="timer" size={20} color={colors.textPrimary} style={{ marginRight: 8 }} />
                <Text className="text-text-primary font-medium text-[15px]">Start Focus</Text>
              </Pressable>
              <Pressable onPress={async () => { 
                try {
                  await generateShareLink([task.id]);
                  alert("Link copied! Send it to your friends.");
                } catch (e) {
                  alert("Failed to generate link.");
                }
              }} className="flex-1 bg-surface py-3 rounded-xl items-center flex-row justify-center min-w-[140px]">
                <MaterialIcons name="share" size={20} color={colors.textPrimary} style={{ marginRight: 8 }} />
                <Text className="text-text-primary font-medium text-[15px]">Share</Text>
              </Pressable>
              <Pressable onPress={() => { onClose(); onDelete(); }} className="flex-1 bg-[#FF3B30]/10 py-3 rounded-xl items-center flex-row justify-center min-w-[140px]">
                <MaterialIcons name="delete-outline" size={20} color="#FF3B30" style={{ marginRight: 8 }} />
                <Text className="text-[#FF3B30] font-medium text-[15px]">Delete</Text>
              </Pressable>
            </View>
          )}
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}
