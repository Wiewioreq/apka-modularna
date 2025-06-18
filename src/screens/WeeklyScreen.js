import React from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";
import { ProgressRing } from "../components/ProgressRing";
import { PhotoProgress } from "../components/PhotoProgress";
import { dogThemeColors, trainingStages, weeklyPlans, MAX_WEEKS } from "../constants";
import { getCurrentStage } from "../utils/helpers";
import { styles } from "../styles/styles";

export const WeeklyScreen = ({
  currentWeek,
  setCurrentWeek,
  completionRate,
  completedActivities,
  toggleActivity,
  progressPhotos,
  handlePhotoAdded,
}) => {
  const currentStage = getCurrentStage(currentWeek);

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
      <View style={styles.enhancedSection}>
        <View style={styles.weekNavigation}>
          <TouchableOpacity
            onPress={() => setCurrentWeek((w) => Math.max(1, w - 1))}
            disabled={currentWeek === 1}
            style={[styles.weekNavButton, currentWeek === 1 && styles.weekNavDisabled]}
            activeOpacity={0.7}
          >
            <Text style={styles.weekNavText}>⬅️ Prev</Text>
          </TouchableOpacity>
          
          <View style={styles.weekTitleContainer}>
            <Text style={styles.weekTitle}>Week {currentWeek}</Text>
          </View>
          
          <TouchableOpacity
            onPress={() => setCurrentWeek((w) => Math.min(MAX_WEEKS, w + 1))}
            disabled={currentWeek === MAX_WEEKS}
            style={[styles.weekNavButton, currentWeek === MAX_WEEKS && styles.weekNavDisabled]}
            activeOpacity={0.7}
          >
            <Text style={styles.weekNavText}>Next ➡️</Text>
          </TouchableOpacity>
        </View>

        {/* Enhanced Stage Indicator with Dog Theme */}
        <View
          style={[
            styles.enhancedStageIndicator,
            {
              backgroundColor: trainingStages[currentStage]?.color || "#f3f4f6",
              borderColor: trainingStages[currentStage]?.borderColor || "#d1d5db",
            },
          ]}
        >
          <Text
            style={[
              styles.enhancedStageText,
              { color: trainingStages[currentStage]?.textColor || "#374151" },
            ]}
          >
            {trainingStages[currentStage]?.emoji} {trainingStages[currentStage]?.name} • {trainingStages[currentStage]?.range}
          </Text>
        </View>

        <View style={styles.enhancedProgressContainer}>
          <View style={styles.progressHeader}>
            <Text style={{ fontSize: 24, marginRight: 8 }}>🎯</Text>
            <Text style={styles.progressTitle}>Week {currentWeek} Progress</Text>
          </View>
          <View style={styles.progressStats}>
            <ProgressRing progress={completionRate} size={80} />
          </View>
        </View>

        <Text style={styles.enhancedSectionTitle}>
          <Text style={{ fontSize: 20, marginRight: 8 }}>🏆</Text> This Week's Training Goals
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

        <PhotoProgress week={currentWeek} photos={progressPhotos} onPhotoAdded={handlePhotoAdded} />
      </View>
    </ScrollView>
  );
};