import React from "react";
import { View, Text } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { dogThemeColors } from "../constants";

export const ProgressRing = ({ progress, size = 100, strokeWidth = 8 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - progress * circumference;

  // Create color based on progress with dog theme
  const getColor = () => {
    if (progress < 0.3) return dogThemeColors.warning;
    if (progress < 0.7) return dogThemeColors.secondary;
    return dogThemeColors.success;
  };
  
  const color = getColor();

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Svg width={size} height={size}>
        <Circle
          stroke={dogThemeColors.lightAccent}
          fill="transparent"
          strokeWidth={strokeWidth - 2}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <Circle
          stroke={color}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          r={radius}
          cx={size / 2}
          cy={size / 2}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={{ 
        position: "absolute", 
        backgroundColor: dogThemeColors.cardBg, 
        width: size - strokeWidth * 4,
        height: size - strokeWidth * 4,
        borderRadius: (size - strokeWidth * 4) / 2,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: dogThemeColors.primary,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        borderWidth: 2,
        borderColor: color,
      }}>
        <Text style={{ fontSize: 16, fontWeight: "800", color: color }}>
          {Math.round(progress * 100)}%
        </Text>
        <Text style={{ fontSize: 10, color: dogThemeColors.mediumText, marginTop: 2 }}>
          🎯 Done
        </Text>
      </View>
    </View>
  );
};