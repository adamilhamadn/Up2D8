import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { DraftTaskCard } from '../components/DraftTaskCard';
import { ContextualBottomNav } from '../components/ContextualBottomNav';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../theme';

export default function DraftsInbox() {
  const { colors } = useTheme();
  
  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      <View className="flex-row items-center justify-between px-md py-md border-b border-border z-40">
        <Pressable 
          className="w-11 h-11 items-center justify-center rounded-full active:opacity-50" 
          onPress={() => Haptics.selectionAsync()}
          accessibilityRole="button"
          accessibilityLabel="Open menu"
        >
          <MaterialIcons name="menu" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text className="text-[22px] font-bold tracking-tight text-text-primary" style={{ letterSpacing: 0.35 }}>Drafts</Text>
        <Pressable 
          className="w-11 h-11 items-center justify-center rounded-full active:opacity-50" 
          onPress={() => Haptics.selectionAsync()}
          accessibilityRole="button"
          accessibilityLabel="More options"
        >
          <MaterialIcons name="more-vert" size={24} color={colors.textPrimary} />
        </Pressable>
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

        <View className="flex-col gap-md">
          <DraftTaskCard 
            title="CS101 Final Project" 
            confidence="high" 
            dateStr="Oct 24, 11:59 PM" 
            onConfirm={() => {}} 
            onDismiss={() => {}} 
          />
          <DraftTaskCard 
            title="Math Homework 4" 
            confidence="low" 
            onConfirm={() => {}} 
            onDismiss={() => {}} 
          />
          <DraftTaskCard 
            title="English Essay Draft" 
            confidence="medium" 
            dateStr="Oct 28, 5:00 PM" 
            onConfirm={() => {}} 
            onDismiss={() => {}} 
          />
        </View>
      </ScrollView>

      <ContextualBottomNav 
        primaryLabel="Confirm All (2)"
        onPrimaryPress={() => {}}
        leftItem={{ icon: "calendar-today", label: "Timeline", onPress: () => {} }}
        rightItem={{ icon: "settings", label: "Settings", onPress: () => {} }}
      />
    </SafeAreaView>
  );
}
