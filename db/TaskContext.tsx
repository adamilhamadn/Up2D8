import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Task } from './types';
import { getTasks, updateTask, createTask } from './taskRepository';
import { nanoid } from 'nanoid/non-secure';

interface TaskContextType {
  tasks: Task[];
  refreshTasks: () => Promise<void>;
  updateTaskStatus: (id: string, status: Task['status']) => Promise<void>;
  bulkConfirmHighConfidence: () => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);

  const refreshTasks = useCallback(async () => {
    try {
      const allTasks = await getTasks();
      setTasks(allTasks);
    } catch (e) {
      console.error('Failed to fetch tasks:', e);
    }
  }, []);

  const updateTaskStatus = async (id: string, status: Task['status']) => {
    await updateTask(id, { status });
    await refreshTasks();
  };

  const bulkConfirmHighConfidence = async () => {
    const draftsToConfirm = tasks.filter(t => t.status === 'draft' && (t.confidence_score ?? 0) >= 0.7);
    for (const task of draftsToConfirm) {
      await updateTask(task.id, { status: 'confirmed' });
    }
    await refreshTasks();
  };

  // Seed database on first launch
  useEffect(() => {
    const seedIfNeeded = async () => {
      try {
        const allTasks = await getTasks();
        if (allTasks.length === 0) {
          const now = new Date();
          const tomorrow = new Date(now);
          tomorrow.setDate(tomorrow.getDate() + 1);
          
          await createTask({
            title: 'Synthetic Math Assignment',
            description: 'Chapter 4 problems',
            category: 'Coursework',
            due_date: tomorrow.toISOString(),
            confidence_score: 0.9,
            source: 'Manual',
            status: 'draft'
          });

          await createTask({
            title: 'Synthetic Physics Lab Report',
            category: 'Coursework',
            due_date: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            confidence_score: 0.6,
            source: 'Manual',
            status: 'draft'
          });

          await createTask({
            title: 'Synthetic History Essay Draft',
            category: 'Project',
            due_date: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            confidence_score: 0.8,
            source: 'Manual',
            status: 'draft'
          });
        }
        await refreshTasks();
      } catch (e) {
        console.error('Failed to seed tasks:', e);
      }
    };
    seedIfNeeded();
  }, [refreshTasks]);

  return (
    <TaskContext.Provider value={{ tasks, refreshTasks, updateTaskStatus, bulkConfirmHighConfidence }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTasks must be used within TaskProvider');
  return context;
}
