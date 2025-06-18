import React from "react";
import { View, Text } from "react-native";
import { breedTips, dogThemeColors } from "../constants";

const styles = {
  tipsContainer: {
    backgroundColor: dogThemeColors.cardBg,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: dogThemeColors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 2,
    borderColor: dogThemeColors.lightAccent,
  },
  tipsHeader: {
    fontSize: 20,
    fontWeight: "700",
    color: dogThemeColors.darkText,
    marginBottom: 16,
  },
  tipCard: {
    backgroundColor: dogThemeColors.lightAccent,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: dogThemeColors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: dogThemeColors.accent,
    borderWidth: 1,
    borderColor: dogThemeColors.accent,
  },
  tipHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: dogThemeColors.darkText,
    marginLeft: 10,
  },
  tipContent: {
    fontSize: 15,
    color: dogThemeColors.mediumText,
    lineHeight: 22,
    fontWeight: "500",
  },
};

export const SmartTips = ({ dogBreed, currentWeek, completionRate, recentActivities }) => {
  const generateTips = () => {
    const tips = [];

    // Safely handle breed tips lookup
    if (dogBreed) {
      let breedTipsToUse = null;
      
      // Try exact match first
      if (breedTips[dogBreed]) {
        breedTipsToUse = breedTips[dogBreed];
      } else {
        // Try to find by removing emoji prefix
        const cleanBreed = dogBreed.replace(/^[🐕🐕‍🦺🌭💪\u{1F400}-\u{1F9FF}]\s*/u, "").trim();
        
        // Look for partial matches in breed tips keys
        const matchingKey = Object.keys(breedTips).find(key => 
          key.toLowerCase().includes(cleanBreed.toLowerCase()) ||
          cleanBreed.toLowerCase().includes(key.replace(/^[🐕🐕‍🦺🌭💪\u{1F400}-\u{1F9FF}]\s*/u, "").toLowerCase())
        );
        
        if (matchingKey) {
          breedTipsToUse = breedTips[matchingKey];
        }
      }
      
      if (breedTipsToUse && breedTipsToUse.length > 0) {
        const cleanBreedName = dogBreed.replace(/^[🐕🐕‍🦺🌭💪\u{1F400}-\u{1F9FF}]\s*/u, "").trim();
        tips.push({
          type: "breed",
          icon: "🐕",
          title: `${cleanBreedName} Training Tip`,
          content: breedTipsToUse[Math.floor(Math.random() * breedTipsToUse.length)],
        });
      }
    }

    // Advanced training tips for higher weeks
    if (currentWeek >= 17 && breedTips["Advanced Training"]) {
      tips.push({
        type: "advanced",
        icon: "🎯",
        title: "Advanced Training Tip",
        content: breedTips["Advanced Training"][Math.floor(Math.random() * breedTips["Advanced Training"].length)],
      });
    }

    if (completionRate < 0.5) {
      tips.push({
        type: "motivation",
        icon: "💪",
        title: "Keep Going, You've Got This!",
        content: "🏃‍♂️ Try shorter, more frequent training sessions. Even 5 minutes twice a day makes a tail-wagging difference!",
      });
    } else if (completionRate > 0.8) {
      tips.push({
        type: "achievement",
        icon: "⭐",
        title: "Amazing Progress!",
        content: "🎾 You're doing pawsome! Consider adding some advanced tricks to keep your furry friend challenged.",
      });
    }

    if (currentWeek <= 4) {
      tips.push({
        type: "foundation",
        icon: "🏠",
        title: "Building Strong Foundations",
        content: "🍖 Focus on creating positive associations with training. Keep sessions short and always end on a high note!",
      });
    }

    return tips.slice(0, 2);
  };

  const tips = generateTips();
  return (
    <View style={styles.tipsContainer}>
      <Text style={styles.tipsHeader}>💡 Pawsome Training Tips</Text>
      {tips.map((tip, index) => (
        <View key={index} style={styles.tipCard}>
          <View style={styles.tipHeader}>
            <Text style={{ fontSize: 24 }}>{tip.icon}</Text>
            <Text style={styles.tipTitle}>{tip.title}</Text>
          </View>
          <Text style={styles.tipContent}>{tip.content}</Text>
        </View>
      ))}
    </View>
  );
};