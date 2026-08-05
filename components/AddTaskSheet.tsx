import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Modal, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../theme';
import Animated, { FadeIn, SlideInDown, SlideOutDown, FadeOut } from 'react-native-reanimated';
import { createTask } from '../db/taskRepository';
import { useTasks } from '../db/TaskContext';

interface AddTaskSheetProps {
  visible: boolean;
  onClose: () => void;
}

const CATEGORIES = ['Coursework', 'Project', 'Exam', 'Info'] as const;

export function AddTaskSheet({ visible, onClose }: AddTaskSheetProps) {
  const { colors, accent } = useTheme();
  const { refreshTasks } = useTasks();

  const [mode, setMode] = useState<'quick' | 'full'>('quick');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<typeof CATEGORIES[number] | null>(null);
  const [course, setCourse] = useState('');
  const [description, setDescription] = useState('');
  // For due date, a native picker would require an external library in Expo without native code.
  // We will use a simplified text input for date for now or leave it empty in this mock.
  const [dateStr, setDateStr] = useState('');

  // Reset form when opened
  useEffect(() => {
    if (visible) {
      setMode('quick');
      setTitle('');
      setCategory(null);
      setCourse('');
      setDescription('');
      setDateStr('');
    }
  }, [visible]);

  const handleSubmit = async () => {
    if (!title.trim()) return;
    
    let due_date = null;
    if (dateStr.trim()) {
      // Mock date parsing
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) due_date = d.toISOString();
    }

    try {
      await createTask({
        title: title.trim(),
        category,
        course_code: course.trim() || null,
        description: description.trim() || null,
        due_date,
        source: 'Manual',
        status: 'confirmed',
        confidence_score: 1.0,
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      // In a real app, use a Toast component here: "Added to your schedule."
      await refreshTasks();
      onClose();
    } catch (e) {
      console.error(e);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
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

            <View className="flex-row items-center justify-between mb-md">
              <Text className="text-[22px] font-bold text-text-primary" style={{ letterSpacing: 0.35 }}>
                {mode === 'quick' ? 'Quick Capture' : 'Add Task'}
              </Text>
              {mode === 'quick' && (
                <Pressable onPress={() => setMode('full')} className="p-2">
                  <MaterialIcons name="fullscreen" size={24} color={colors.textSecondary} />
                </Pressable>
              )}
            </View>

            <TextInput
              placeholder="What do you need to do?"
              placeholderTextColor={colors.textTertiary}
              className="text-[17px] text-text-primary bg-surface px-md py-4 rounded-xl mb-md"
              style={{ letterSpacing: -0.41 }}
              value={title}
              onChangeText={setTitle}
              autoFocus
            />

            {mode === 'full' && (
              <Animated.View entering={FadeIn}>
                <View className="flex-row gap-2 mb-md">
                  {CATEGORIES.map(cat => (
                    <Pressable
                      key={cat}
                      onPress={() => setCategory(cat)}
                      className={`px-3 py-2 rounded-lg border border-border ${category === cat ? 'bg-text-primary' : 'bg-transparent'}`}
                    >
                      <Text className={`text-[13px] font-medium ${category === cat ? 'text-bg' : 'text-text-secondary'}`}>
                        {cat}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                <TextInput
                  placeholder="Course (e.g. CS101)"
                  placeholderTextColor={colors.textTertiary}
                  className="text-[15px] text-text-primary bg-surface px-md py-3 rounded-xl mb-md"
                  value={course}
                  onChangeText={setCourse}
                />

                <TextInput
                  placeholder="Due Date (e.g. 2026-10-24)"
                  placeholderTextColor={colors.textTertiary}
                  className="text-[15px] text-text-primary bg-surface px-md py-3 rounded-xl mb-md"
                  value={dateStr}
                  onChangeText={setDateStr}
                />

                <TextInput
                  placeholder="Description..."
                  placeholderTextColor={colors.textTertiary}
                  className="text-[15px] text-text-primary bg-surface px-md py-3 rounded-xl mb-md"
                  multiline
                  numberOfLines={3}
                  value={description}
                  onChangeText={setDescription}
                />
              </Animated.View>
            )}

            <View className="flex-row items-center justify-end mt-sm">
              <Pressable 
                onPress={onClose}
                className="px-6 py-3 mr-2"
              >
                <Text className="text-[15px] font-medium text-text-secondary">Cancel</Text>
              </Pressable>
              <Pressable 
                onPress={handleSubmit}
                className="px-6 py-3 rounded-full opacity-100"
                style={{ backgroundColor: title.trim() ? accent : colors.border }}
                disabled={!title.trim()}
              >
                <Text className="text-[15px] font-semibold text-white">Save</Text>
              </Pressable>
            </View>
          </Animated.View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
