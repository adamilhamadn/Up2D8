import { Tabs } from 'expo-router';
import { ContextualBottomNav } from '../../components/ContextualBottomNav';
import { useTheme } from '../../theme';
import { TaskProvider, useTasks } from '../../db/TaskContext';
import * as Haptics from 'expo-haptics';
import { AddTaskSheet } from '../../components/AddTaskSheet';
import { useState } from 'react';

function TabsWithContext() {
  const { colors } = useTheme();
  const { tasks, bulkConfirmHighConfidence } = useTasks();
  const [isAddTaskVisible, setAddTaskVisible] = useState(false);

  const draftsToConfirm = tasks.filter(t => t.status === 'draft' && (t.confidence_score ?? 0) >= 0.7);

  return (
    <>
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.bg },
      }}
      tabBar={(props) => (
        <ContextualBottomNav 
          {...(props as any)} 
          primaryActions={{
            drafts: {
              label: `Confirm All (${draftsToConfirm.length})`,
              icon: 'fact-check',
              onPress: () => {
                if (draftsToConfirm.length > 0) {
                  bulkConfirmHighConfidence();
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                } else {
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                }
              }
            },
            calendar: {
              label: 'Add Task',
              icon: 'add',
              onPress: () => setAddTaskVisible(true)
            }
          }}
        />
      )}
    >
      <Tabs.Screen name="drafts" options={{ title: 'Drafts' }} />
      <Tabs.Screen name="calendar" options={{ title: 'Calendar' }} />
      <Tabs.Screen name="hubs" options={{ title: 'Hubs' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
    </Tabs>
    <AddTaskSheet visible={isAddTaskVisible} onClose={() => setAddTaskVisible(false)} />
    </>
  );
}

export default function TabsLayout() {
  return (
    <TaskProvider>
      <TabsWithContext />
    </TaskProvider>
  );
}
