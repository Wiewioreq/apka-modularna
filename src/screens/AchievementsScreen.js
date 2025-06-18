import React from "react";
import {
  View,
  ScrollView,
  Text,
} from "react-native";
import { AchievementBadge } from "../components/AchievementBadge";
import { StreakCounter } from "../components/StreakCounter";
import { dogThemeColors, achievements } from "../constants";
import { styles } from "../styles/styles";

export const AchievementsScreen = ({
  unlockedAchievements,
  currentStreak,
  bestStreak,
}) => {
  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
      <View style={styles.enhancedSection}>
        <Text style={styles.enhancedSectionTitle}>
          <Text style={{ fontSize: 20, marginRight: 8 }}>🏆</Text> Training Achievements
        </Text>
        <View style={styles.enhancedAchievementsGrid}>
          {achievements.map((achievement) => (
            <AchievementBadge
              key={achievement.id}
              achievement={achievement}
              unlocked={unlockedAchievements.includes(achievement.id)}
            />
          ))}
        </View>

        <StreakCounter currentStreak={currentStreak} bestStreak={bestStreak} />

        <View style={styles.enhancedAchievementStats}>
          <Text style={styles.enhancedAchievementStatsTitle}>🎯 Your Training Progress</Text>
          <Text style={styles.enhancedAchievementStatsText}>
            🏆 {unlockedAchievements.length} of {achievements.length} achievements unlocked
          </Text>
          <View style={styles.enhancedProgressBarContainer}>
            <View
              style={[
                styles.enhancedProgressBar,
                { width: `${(unlockedAchievements.length / achievements.length) * 100}%` },
              ]}
            />
          </View>
          {unlockedAchievements.length === achievements.length && (
            <Text style={{ textAlign: "center", marginTop: 16, fontSize: 18, color: dogThemeColors.success }}>
              🎉 Pawsome! You've unlocked everything! 🐕‍🦺
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
};