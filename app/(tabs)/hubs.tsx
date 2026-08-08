import React, { useState } from 'react';
import { View, Text, Pressable, TextInput, ScrollView, Animated as RNAnimated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';
import { useTasks } from '../../db/TaskContext';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { FocusTimerOverlay } from '../../components/FocusTimerOverlay';
import { TaskCard } from '../../components/TaskCard';
import { TaskDetailSheet } from '../../components/TaskDetailSheet';
import { Task } from '../../db/types';
import { generateShareLink } from '../../utils/shareTask';
import { ActivityIndicator } from 'react-native';

const CATEGORIES = [
  { name: 'Coursework', icon: 'assignment', color: '#007AFF' },
  { name: 'Project', icon: 'build', color: '#FF9500' },
  { name: 'Exam', icon: 'school', color: '#FF3B30' },
  { name: 'Info', icon: 'info', color: '#8E8E93' },
];

function HubCard({ category, count, color, icon, progress, onPress }: any) {
  const { colors } = useTheme();
  const scaleAnim = React.useRef(new RNAnimated.Value(1)).current;

  const handlePressIn = () => {
    RNAnimated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    RNAnimated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={() => { Haptics.selectionAsync(); onPress(); }}
      className="w-[47%] bg-surface rounded-2xl p-4 mb-4 border border-border"
    >
      <RNAnimated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <View className="flex-row items-start justify-between mb-8">
          <View className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: color + '20' }}>
            <MaterialIcons name={icon} size={20} color={color} />
          </View>
          <View className="w-8 h-8 rounded-full border-4 items-center justify-center" style={{ borderColor: color + '40' }}>
             <Text className="text-[9px] font-bold" style={{ color }}>{progress}%</Text>
          </View>
        </View>
        <Text className="text-[17px] font-bold text-text-primary mb-1">{category}</Text>
        <Text className="text-[13px] text-text-secondary">{count} Active</Text>
      </RNAnimated.View>
    </Pressable>
  );
}

export default function HubsScreen() {
  const { colors } = useTheme();
  const { tasks, updateTaskStatus } = useTasks();
  const [search, setSearch] = useState('');
  const [selectedHub, setSelectedHub] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [focusTask, setFocusTask] = useState<Task | null>(null);
  const [focusVisible, setFocusVisible] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const confirmedTasks = tasks.filter(t => t.status === 'confirmed' || t.status === 'completed');

  if (selectedHub) {
    return (
      <SafeAreaView className="flex-1 bg-bg px-md py-md" edges={['top']}>
        <View className="flex-row items-center justify-between mb-lg">
          <View className="flex-row items-center">
            <Pressable onPress={() => setSelectedHub(null)} className="mr-md p-2 -ml-2">
              <MaterialIcons name="arrow-back" size={24} color={colors.textPrimary} />
            </Pressable>
            <Text className="text-[28px] font-bold text-text-primary" style={{ letterSpacing: 0.35 }}>
              {selectedHub}
            </Text>
          </View>
          <Pressable 
            disabled={isSharing || confirmedTasks.filter(t => t.category === selectedHub).length === 0}
            onPress={async () => {
              const ids = confirmedTasks.filter(t => t.category === selectedHub).map(t => t.id);
              if (ids.length === 0) return;
              setIsSharing(true);
              try {
                await generateShareLink(ids);
                alert("Link copied! Send it to your friends.");
              } catch (e) {
                alert("Failed to generate link.");
              } finally {
                setIsSharing(false);
              }
            }}
            className="p-2"
          >
            {isSharing ? (
              <ActivityIndicator size="small" color={colors.textPrimary} />
            ) : (
              <MaterialIcons name="share" size={24} color={colors.textPrimary} />
            )}
          </Pressable>
        </View>
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
          {confirmedTasks.filter(t => t.category === selectedHub).map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onPress={() => setSelectedTask(task)} 
              onLongPress={() => setSelectedTask(task)}
              onComplete={(id) => updateTaskStatus(id, 'completed')}
              onArchive={(id) => updateTaskStatus(id, 'archived')}
            />
          ))}
          {confirmedTasks.filter(t => t.category === selectedHub).length === 0 && (
            <View className="flex-1 items-center justify-center pt-xl">
              <Text className="text-text-secondary text-[15px]">No {selectedHub} yet.</Text>
            </View>
          )}
        </ScrollView>
        <TaskDetailSheet
          task={selectedTask}
          visible={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onEdit={() => setSelectedTask(null)}
          onRemind={() => setSelectedTask(null)}
          onComplete={() => { if(selectedTask) updateTaskStatus(selectedTask.id, 'completed'); setSelectedTask(null); }}
          onDelete={() => { if(selectedTask) updateTaskStatus(selectedTask.id, 'archived'); setSelectedTask(null); }}
          onStartFocus={() => { setFocusTask(selectedTask); setFocusVisible(true); }}
        />
        <FocusTimerOverlay 
          task={focusTask}
          visible={focusVisible}
          onClose={() => { setFocusVisible(false); setTimeout(() => setFocusTask(null), 300); }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-bg px-md py-md" edges={['top']}>
      <Text className="text-[34px] font-bold text-text-primary mb-md" style={{ letterSpacing: 0.37 }}>
        Hubs
      </Text>

      {/* Search Bar */}
      <View className="flex-row items-center bg-surface px-md py-3 rounded-xl mb-lg border border-border">
        <MaterialIcons name="search" size={20} color={colors.textSecondary} style={{ marginRight: 8 }} />
        <TextInput
          placeholder="Search deadlines..."
          placeholderTextColor={colors.textTertiary}
          className="flex-1 text-[15px] text-text-primary"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-row flex-wrap justify-between">
          {CATEGORIES
            .filter(cat => !search || cat.name.toLowerCase().includes(search.toLowerCase()))
            .map(cat => {
            const catTasks = confirmedTasks.filter(t => t.category === cat.name);
            const completedCount = tasks.filter(t => t.category === cat.name && t.status === 'completed').length;
            const totalCount = catTasks.length + completedCount;
            const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
            return (
              <HubCard 
                key={cat.name}
                category={cat.name}
                count={catTasks.length}
                color={cat.color}
                icon={cat.icon}
                progress={progress}
                onPress={() => setSelectedHub(cat.name)}
              />
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
