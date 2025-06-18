import React from "react";
import { View, Text } from "react-native";
import { dogThemeColors } from "../constants";

const styles = {
  streakContainer: {
    backgroundColor: dogThemeColors.cardBg,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-around",
    shadowColor: dogThemeColors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 2,
    borderColor: dogThemeColors.lightAccent,
  },
  streakItem: {
    alignItems: "center",
    backgroundColor: dogThemeColors.lightAccent,
    padding: 16,
    borderRadius: 16,
    minWidth: 120,
    borderWidth: 2,
    borderColor: dogThemeColors.accent,
  },
  streakNumber: {
    fontSize: 32,
    fontWeight: "800",
    color: dogThemeColors.primary,
    marginTop: 8,
  },
  streakLabel: {
    fontSize: 14,
    color: dogThemeColors.primary,
    marginTop: 6,
    fontWeight: "700",
    textAlign: "center",
  },
  streakSubLabel: {
    fontSize: 11,
    color: dogThemeColors.mediumText,
    marginTop: 2,
    textAlign: "center",
  },
};

export const StreakCounter = ({ currentStreak, bestStreak }) => {
  return (
    <View style={styles.streakContainer}>
      <View style={styles.streakItem}>
        <Text style={{ fontSize: 32 }}>🔥</Text>
        <Text style={styles.streakNumber}>{currentStreak}</Text>
        <Text style={styles.streakLabel}>Current Streak</Text>
        <Text style={styles.streakSubLabel}>days training</Text>
      </View>
      <View style={styles.streakItem}>
        <Text style={{ fontSize: 32 }}>🏆</Text>
        <Text style={styles.streakNumber}>{bestStreak}</Text>
        <Text style={styles.streakLabel}>Best Streak</Text>
        <Text style={styles.streakSubLabel}>personal record</Text>
      </View>
    </View>
  );
};