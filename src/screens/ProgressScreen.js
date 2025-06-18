import React from "react";
import {
  View,
  ScrollView,
  Text,
} from "react-native";
import { TrainingCalendar } from "../components/TrainingCalendar";
import { dogThemeColors, weeklyPlans, MAX_WEEKS } from "../constants";
import { styles } from "../styles/styles";

export const ProgressScreen = ({
  currentWeek,
  completionRate,
  dailyRate,
  completedDailyByDate,
  selectedDate,
  setSelectedDate,
  calendarNotes,
  handleOpenNoteModal,
  visibleNotes,
  setVisibleNotes,
  completedActivities,
}) => {
  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
      <View style={styles.enhancedSection}>
        <Text style={styles.enhancedSectionTitle}>
          <Text style={{ fontSize: 20, marginRight: 8 }}>📊</Text> Training Overview
        </Text>
        <View style={styles.overviewStats}>
          <View style={styles.enhancedStatCard}>
            <Text style={{ fontSize: 24, marginBottom: 4 }}>📅</Text>
            <Text style={styles.enhancedStatNumber}>{currentWeek}</Text>
            <Text style={styles.enhancedStatLabel}>Current Week</Text>
          </View>
          <View style={styles.enhancedStatCard}>
            <Text style={{ fontSize: 24, marginBottom: 4 }}>🎯</Text>
            <Text style={styles.enhancedStatNumber}>{Math.round(completionRate * 100)}%</Text>
            <Text style={styles.enhancedStatLabel}>Week Progress</Text>
          </View>
          <View style={styles.enhancedStatCard}>
            <Text style={{ fontSize: 24, marginBottom: 4 }}>✅</Text>
            <Text style={styles.enhancedStatNumber}>{Math.round(dailyRate * 100)}%</Text>
            <Text style={styles.enhancedStatLabel}>Today's Tasks</Text>
          </View>
        </View>
      </View>

      <TrainingCalendar
        completedDailyByDate={completedDailyByDate}
        onDateSelect={setSelectedDate}
        selectedDate={selectedDate}
        calendarNotes={calendarNotes}
        onOpenNoteModal={handleOpenNoteModal}
        visibleNotes={visibleNotes}
        setVisibleNotes={setVisibleNotes}
      />

      <View style={styles.enhancedSection}>
        <Text style={styles.enhancedSectionTitle}>
          <Text style={{ fontSize: 20, marginRight: 8 }}>📈</Text> Weekly Training History
        </Text>
        {[...Array(Math.min(currentWeek, MAX_WEEKS))].map((_, i) => {
          const week = i + 1;
          const weekActivities = weeklyPlans[week] || [];
          const weekCompleted = weekActivities.filter((act) =>
            completedActivities.includes(`${week}-${act}`)
          ).length;
          const weekRate = weekActivities.length > 0 ? weekCompleted / weekActivities.length : 0;

          return (
            <View key={week} style={styles.enhancedWeekHistoryItem}>
              <Text style={styles.weekHistoryTitle}>📅 Week {week}</Text>
              <View style={styles.enhancedProgressBarContainer}>
                <View style={[styles.enhancedProgressBar, { width: `${weekRate * 100}%` }]} />
              </View>
              <Text style={styles.weekHistoryPercent}>{Math.round(weekRate * 100)}%</Text>
              <Text style={{ fontSize: 16, marginLeft: 8 }}>
                {weekRate === 1 ? "🏆" : weekRate > 0.7 ? "⭐" : weekRate > 0.3 ? "📚" : "🎯"}
              </Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};