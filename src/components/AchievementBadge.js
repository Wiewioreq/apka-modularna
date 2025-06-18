import React from "react";
import { View, Text } from "react-native";
import { dogThemeColors } from "../constants";

const styles = {
  achievementBadge: {
    width: "48%",
    backgroundColor: dogThemeColors.lightAccent,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: dogThemeColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2,
    borderColor: "#ccc",
  },
  achievementUnlocked: {
    backgroundColor: "#FFF8DC",
    borderColor: dogThemeColors.accent,
    shadowColor: dogThemeColors.accent,
    shadowOpacity: 0.25,
  },
  achievementTitle: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginTop: 8,
    fontWeight: "700",
  },
  achievementTitleUnlocked: {
    color: dogThemeColors.primary,
  },
  achievementDescription: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginTop: 4,
  },
  achievementDescriptionUnlocked: {
    color: dogThemeColors.mediumText,
  },
  achievementUnlockedText: {
    fontSize: 12,
    color: dogThemeColors.success,
    textAlign: "center",
    marginTop: 4,
    fontWeight: "bold",
  },
};

export const AchievementBadge = ({ achievement, unlocked }) => (
  <View style={[styles.achievementBadge, unlocked && styles.achievementUnlocked]}>
    <Text style={{ fontSize: 36, marginBottom: 8 }}>{achievement.icon}</Text>
    <Text style={[styles.achievementTitle, unlocked && styles.achievementTitleUnlocked]}>
      {achievement.title}
    </Text>
    <Text style={[styles.achievementDescription, unlocked && styles.achievementDescriptionUnlocked]}>
      {achievement.description}
    </Text>
    {unlocked && (
      <Text style={styles.achievementUnlockedText}>🎉 Unlocked!</Text>
    )}
  </View>
);