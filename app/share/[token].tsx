import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchSharedTasks } from '../../utils/shareTask';
import { useTasks } from '../../db/TaskContext';
import { createTask } from '../../db/taskRepository';
import { useTheme } from '../../theme';
import * as Haptics from 'expo-haptics';
import { nanoid } from 'nanoid/non-secure';

export default function SharePreviewScreen() {
  const { token } = useLocalSearchParams<{ token: string }>();
  const router = useRouter();
  const { colors, accent } = useTheme();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      fetchSharedTasks(token)
        .then((data) => {
          setTasks(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [token]);

  const handleImport = async () => {
    try {
      Haptics.selectionAsync();
      for (const t of tasks) {
        await createTask({
          ...t,
          id: nanoid(), // new local id
          status: 'confirmed',
          source: 'Manual' // As per requirement: Import creates task copies: `status = 'confirmed'`, `source = 'Manual'`
        });
      }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      alert('Tasks imported successfully!');
      router.replace('/(tabs)/calendar');
    } catch (e) {
      alert('Failed to import tasks.');
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-bg items-center justify-center">
        <ActivityIndicator color={accent} size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-bg items-center justify-center px-md">
        <Text className="text-[17px] text-[#FF3B30] text-center mb-md">{error}</Text>
        <Pressable onPress={() => router.replace('/')} className="bg-surface py-3 px-6 rounded-xl">
          <Text className="text-text-primary font-medium text-[15px]">Go Home</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-bg px-md" edges={['top']}>
      <Text className="text-[34px] font-bold text-text-primary mb-md pt-md">
        Shared Schedule
      </Text>
      <Text className="text-[15px] text-text-secondary mb-xl">
        You've received {tasks.length} task{tasks.length === 1 ? '' : 's'} to import.
      </Text>

      <View className="flex-1">
        {tasks.map((task, index) => (
          <View key={index} className="bg-surface p-md rounded-xl mb-md border border-border">
            <Text className="text-[17px] text-text-primary font-medium mb-1">{task.title}</Text>
            {task.course_code && (
              <Text className="text-[13px] text-text-secondary">{task.course_code}</Text>
            )}
          </View>
        ))}
      </View>

      <View className="pb-xl">
        <Pressable 
          onPress={handleImport}
          className="w-full py-4 rounded-xl items-center mb-sm"
          style={{ backgroundColor: accent }}
        >
          <Text className="text-[#fff] font-semibold text-[17px]">Import All</Text>
        </Pressable>
        <Pressable 
          onPress={() => router.replace('/')}
          className="w-full py-4 rounded-xl items-center bg-surface"
        >
          <Text className="text-text-primary font-medium text-[17px]">Cancel</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
