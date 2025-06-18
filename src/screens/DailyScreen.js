import React from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { ProgressRing } from "../components/ProgressRing";
import { SmartTips } from "../components/SmartTips";
import { StreakCounter } from "../components/StreakCounter";
import { dogThemeColors, timeSlotColors, dailyRoutine } from "../constants";
import { getCurrentDate } from "../utils/date";
import { styles } from "../styles/styles";

export const DailyScreen = ({
  dailyRate,
  completedDailyByDate,
  toggleDailyActivity,
  currentWeek,
  weeklyPlans,
  completedActivities,
  toggleActivity,
  selectedDate,
  dailyNotes,
  addNote,
  dogBreed,
  completionRate,
  currentStreak,
  bestStreak,
}) => {
  const today = getCurrentDate();
  const completedToday = completedDailyByDate[today] || [];

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
      <View style={styles.enhancedProgressContainer}>
        <View style={styles.progressHeader}>
          <Text style={{ fontSize: 24, marginRight: 8 }}>🌅</Text>
          <Text style={styles.progressTitle}>Today's Training Progress</Text>
        </View>
        <View style={styles.progressStats}>
          <ProgressRing progress={dailyRate} size={80} />
        </View>
      </View>

      {/* Enhanced Time Slot Rendering with Dog Theme */}
      {Object.entries(dailyRoutine).map(([timeSlot, acts]) => {
        const colors = timeSlotColors[timeSlot] || timeSlotColors.morning;
        return (
          <View
            key={timeSlot}
            style={[
              styles.enhancedTimeSlotContainer,
              {
                backgroundColor: colors.backgroundColor,
                borderLeftColor: colors.borderColor,
              },
            ]}
          >
            <Text style={[styles.timeSlotTitle, { color: colors.textColor }]}>
              <Text style={{ fontSize: 20 }}>{colors.emoji}</Text> {colors.title}
            </Text>
            {acts.map((activity, idx) => (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.enhancedActivityRow,
                  { backgroundColor: completedToday.includes(`daily-${timeSlot}-${activity}`) ? colors.borderColor + "20" : dogThemeColors.cardBg },
                ]}
                onPress={() => toggleDailyActivity(timeSlot, activity)}
                activeOpacity={0.8}
              >
                <Text style={{ fontSize: 20, marginRight: 12 }}>
                  {completedToday.includes(`daily-${timeSlot}-${activity}`) ? "✅" : "⭕"}
                </Text>
                <Text
                  style={[
                    styles.activityText,
                    { color: colors.textColor },
                    completedToday.includes(`daily-${timeSlot}-${activity}`) && styles.activityCompleted,
                  ]}
                >
                  {activity}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        );
      })}

      <View style={styles.enhancedSection}>
        <Text style={styles.enhancedSectionTitle}>
          <Text style={{ fontSize: 20, marginRight: 8 }}>⭐</Text> Week {currentWeek} Training Focus
        </Text>
        {(weeklyPlans[currentWeek] || []).map((activity, idx) => (
          <TouchableOpacity key={idx} style={styles.enhancedActivityRow} onPress={() => toggleActivity(currentWeek, activity)} activeOpacity={0.8}>
            <Text style={{ fontSize: 20, marginRight: 12 }}>
              {completedActivities.includes(`${currentWeek}-${activity}`) ? "🎯" : "⭕"}
            </Text>
            <Text
              style={[
                styles.activityText,
                completedActivities.includes(`${currentWeek}-${activity}`) && styles.activityCompleted,
              ]}
            >
              {activity}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.enhancedSection}>
        <Text style={styles.enhancedSectionTitle}>
          <Text style={{ fontSize: 20, marginRight: 8 }}>📝</Text> Today's Training Notes
        </Text>
        <TextInput
          style={styles.enhancedNoteInput}
          placeholder="🐕 Add a note about today's training session..."
          value={dailyNotes[selectedDate] || ""}
          onChangeText={(text) => addNote(selectedDate, text)}
          multiline
          numberOfLines={3}
        />
      </View>

      <SmartTips dogBreed={dogBreed} currentWeek={currentWeek} completionRate={completionRate} recentActivities={completedActivities} />

      <StreakCounter currentStreak={currentStreak} bestStreak={bestStreak} />
    </ScrollView>
  );
};