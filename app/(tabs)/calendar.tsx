import React, { useState, useMemo } from 'react';
import { View, Text, Pressable, ScrollView, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';
import { useTasks } from '../../db/TaskContext';
import { TaskCard } from '../../components/TaskCard';
import { TaskDetailSheet } from '../../components/TaskDetailSheet';
import { TimelineView } from '../../components/TimelineView';
import { FocusTimerOverlay } from '../../components/FocusTimerOverlay';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Task } from '../../db/types';
import * as Haptics from 'expo-haptics';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, startOfMonth, endOfMonth, isSameMonth } from 'date-fns';

type ViewMode = 'Month' | 'Week' | 'Agenda' | 'Timeline';

export default function CalendarScreen() {
  const { colors, accent } = useTheme();
  const { tasks, updateTaskStatus } = useTasks();
  const [mode, setMode] = useState<ViewMode>('Agenda');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);
  const [focusTask, setFocusTask] = useState<Task | null>(null);
  const [focusVisible, setFocusVisible] = useState(false);

  const displayedTasks = useMemo(() => {
    return tasks
      .filter(t => (showCompleted ? (t.status === 'confirmed' || t.status === 'completed') : t.status === 'confirmed'))
      .sort((a, b) => {
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      });
  }, [tasks, showCompleted]);

  const now = new Date();
  const [currentDate, setCurrentDate] = useState(new Date());
  const monthYear = format(currentDate, 'MMMM yyyy');

  const renderAgenda = () => {
    if (displayedTasks.length === 0) {
      return (
        <Animated.View entering={FadeIn} exiting={FadeOut} className="flex-1 items-center justify-center">
          <Text className="text-text-secondary text-[15px]">No deadlines yet. Paste a syllabus or add one manually.</Text>
        </Animated.View>
      );
    }
    
    return (
      <Animated.ScrollView entering={FadeIn} exiting={FadeOut} className="flex-1 mt-md" contentContainerStyle={{ paddingBottom: 120 }}>
        {displayedTasks.map(task => (
          <TaskCard 
            key={task.id} 
            task={task} 
            onPress={() => setSelectedTask(task)} 
            onLongPress={() => setSelectedTask(task)}
            onComplete={(id) => updateTaskStatus(id, 'completed')}
            onArchive={(id) => updateTaskStatus(id, 'archived')}
          />
        ))}
      </Animated.ScrollView>
    );
  };

  const renderMonth = () => {
    const start = startOfWeek(startOfMonth(currentDate));
    const end = endOfWeek(endOfMonth(currentDate));
    const days = eachDayOfInterval({ start, end });

    return (
      <Animated.View entering={FadeIn} exiting={FadeOut} className="flex-1 mt-md">
        <View className="flex-row justify-between mb-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
            <View key={i} className="flex-1 items-center">
              <Text className="text-[13px] text-text-secondary font-medium">{day}</Text>
            </View>
          ))}
        </View>
        <View className="flex-row flex-wrap bg-surface rounded-xl border border-border overflow-hidden">
          {days.map((day, i) => {
            const isToday = isSameDay(day, now);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const dayTasks = displayedTasks.filter(t => t.due_date && isSameDay(new Date(t.due_date), day));
            
            return (
              <Pressable 
                key={i} 
                className="w-[14.28%] h-14 items-center justify-start py-1 border-b border-r border-border/50"
                onPress={() => { Haptics.selectionAsync(); setMode('Agenda'); }}
              >
                <View className={`w-6 h-6 rounded-full items-center justify-center ${isToday ? 'bg-text-primary' : ''}`}>
                  <Text className={`text-[13px] font-medium ${isToday ? 'text-bg' : (isCurrentMonth ? 'text-text-primary' : 'text-text-tertiary')}`}>
                    {format(day, 'd')}
                  </Text>
                </View>
                <View className="flex-row mt-1 space-x-0.5 max-w-[90%] flex-wrap justify-center overflow-hidden h-3">
                  {dayTasks.slice(0, 3).map((t, idx) => (
                    <View key={idx} className="w-1.5 h-1.5 mx-[1px] rounded-full" style={{ backgroundColor: accent }} />
                  ))}
                </View>
              </Pressable>
            );
          })}
        </View>
      </Animated.View>
    );
  };

  const renderWeek = () => {
    const start = startOfWeek(currentDate);
    const end = endOfWeek(currentDate);
    const days = eachDayOfInterval({ start, end });

    return (
      <Animated.View entering={FadeIn} exiting={FadeOut} className="flex-1 mt-md">
        <View className="flex-row justify-between mb-lg border-b border-border pb-md px-2">
          {days.map((day, i) => {
            const isToday = isSameDay(day, now);
            return (
              <View key={i} className="items-center flex-1">
                <Text className="text-[13px] text-text-secondary mb-2 font-medium">{format(day, 'EEEEE')}</Text>
                <View className={`w-8 h-8 rounded-full items-center justify-center ${isToday ? 'bg-text-primary' : ''}`}>
                  <Text className={`text-[15px] font-medium ${isToday ? 'text-bg' : 'text-text-primary'}`}>
                    {format(day, 'd')}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
        {renderAgenda()}
      </Animated.View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-bg px-md py-md" edges={['top']}>
      <View className="flex-row items-center justify-between mb-md">
        <Text className="text-[34px] font-bold text-text-primary" style={{ letterSpacing: 0.37 }}>
          {monthYear}
        </Text>
        <Pressable 
          onPress={() => setShowCompleted(!showCompleted)} 
          className={`px-3 py-1.5 rounded-full border ${showCompleted ? 'bg-text-primary border-text-primary' : 'border-border'}`}
        >
          <Text className={`text-[11px] font-medium ${showCompleted ? 'text-bg' : 'text-text-secondary'}`}>
            {showCompleted ? 'Hide Completed' : 'Show Completed'}
          </Text>
        </Pressable>
      </View>
      
      {/* View Toggle */}
      <View className="flex-row bg-surface rounded-xl p-1 mb-2">
        {(['Month', 'Week', 'Agenda', 'Timeline'] as ViewMode[]).map((v) => (
          <Pressable
            key={v}
            onPress={() => { Haptics.selectionAsync(); setMode(v); }}
            className={`flex-1 py-2 items-center rounded-lg ${mode === v ? 'bg-text-primary' : 'bg-transparent'}`}
          >
            <Text className={`text-[11px] font-semibold ${mode === v ? 'text-bg' : 'text-text-secondary'}`} numberOfLines={1}>
              {v}
            </Text>
          </Pressable>
        ))}
      </View>

      {mode === 'Month' && renderMonth()}
      {mode === 'Week' && renderWeek()}
      {mode === 'Agenda' && renderAgenda()}
      {mode === 'Timeline' && <TimelineView tasks={tasks.filter(t => t.status === 'confirmed')} />}

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
