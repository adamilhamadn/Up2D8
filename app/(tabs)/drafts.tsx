import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { DraftTaskCard } from '../../components/DraftTaskCard';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../theme';
import { useTasks } from '../../db/TaskContext';
import { useEffect, useState, useRef } from 'react';
import { ActivityIndicator } from 'react-native';
import { processSmartPaste } from '../../utils/smartPaste';
import { processSmartUpload } from '../../utils/smartUpload';
import { createTask } from '../../db/taskRepository';

export default function DraftsInbox() {
  const { colors, accent } = useTheme();
  const { tasks, updateTaskStatus } = useTasks();
  const drafts = tasks
    .filter(t => t.status === 'draft')
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  
  const [isPasting, setIsPasting] = useState(false);

  const handleSmartPaste = async () => {
    setIsPasting(true);
    try {
      const newTask = await processSmartPaste();
      if (newTask) {
        await createTask(newTask);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        // Note: In a real app we'd trigger a toast here
        alert("Task extracted");
      }
    } catch (e: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      alert(e.message || "Couldn't understand text");
    } finally {
      setIsPasting(false);
    }
  };

  const handleSmartUpload = async () => {
    setIsPasting(true); // Reusing loading state for simplicity
    try {
      const newTask = await processSmartUpload();
      if (newTask) {
        await createTask(newTask);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        alert("Task extracted");
      }
    } catch (e: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      alert(e.message || "Couldn't read this image. Try a clearer screenshot.");
    } finally {
      setIsPasting(false);
    }
  };

  // Handle milestone celebration — fire only on transition from >0 to 0 drafts
  const prevDraftCount = useRef(drafts.length);
  useEffect(() => {
    if (prevDraftCount.current > 0 && drafts.length === 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    prevDraftCount.current = drafts.length;
  }, [drafts.length]);

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      <View className="flex-row items-center justify-center px-md py-md border-b border-border z-40">
        <Text className="text-[22px] font-bold tracking-tight text-text-primary" style={{ letterSpacing: 0.35 }}>Drafts</Text>
      </View>

      <ScrollView 
        className="flex-1 px-md py-lg"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View className="mb-lg">
          <Text 
            className="text-[15px] text-text-secondary leading-snug"
            style={{ letterSpacing: -0.24 }}
          >
            Review and confirm AI-extracted deadlines before they hit your calendar.
          </Text>
        </View>

        {drafts.length === 0 ? (
          <View className="flex-1 items-center justify-center mt-xl">
            <MaterialIcons name="check-circle-outline" size={64} color={colors.textSecondary} />
            <Text className="text-[17px] text-text-primary font-medium mt-4">You're all caught up!</Text>
            <Text className="text-[15px] text-text-secondary mt-1">All clear! Nothing to review.</Text>
          </View>
        ) : (
          <View className="flex-col gap-md">
            {drafts.map(task => {
              let confidence: 'high' | 'medium' | 'low' = 'low';
              if (task.confidence_score !== null && task.confidence_score !== undefined) {
                if (task.confidence_score >= 0.8) confidence = 'high';
                else if (task.confidence_score >= 0.5) confidence = 'medium';
              }

              let dateStr = task.due_date;
              if (dateStr) {
                dateStr = new Date(dateStr).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
              }

              return (
                <DraftTaskCard 
                  key={task.id}
                  title={task.title} 
                  confidence={confidence} 
                  dateStr={dateStr || undefined}
                  onConfirm={() => updateTaskStatus(task.id, 'confirmed')} 
                  onDismiss={() => updateTaskStatus(task.id, 'archived')} 
                />
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Smart Paste / Upload FABs */}
      <View className="absolute bottom-6 right-6 gap-y-4 items-end z-50">
        <Pressable 
          onPress={handleSmartUpload}
          disabled={isPasting}
          className="w-12 h-12 rounded-full items-center justify-center shadow-md bg-surface border border-border"
        >
          {isPasting ? (
            <ActivityIndicator color={accent} size="small" />
          ) : (
            <MaterialIcons name="image" size={20} color={accent} />
          )}
        </Pressable>

        <Pressable 
          onPress={handleSmartPaste}
          disabled={isPasting}
          className="w-14 h-14 rounded-full items-center justify-center shadow-lg"
          style={{ backgroundColor: accent }}
        >
          {isPasting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <MaterialIcons name="auto-awesome" size={24} color="#fff" />
          )}
        </Pressable>
      </View>

    </SafeAreaView>
  );
}
