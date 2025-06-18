import React, { useState } from "react";
import { View, TouchableOpacity, Text, Animated } from "react-native";
import { dogThemeColors } from "../constants";

const styles = {
  quickActionsContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    alignItems: "center",
  },
  actionButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  actionButtonInner: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: "#fff",
  },
  mainButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: dogThemeColors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 3,
    borderColor: dogThemeColors.accent,
  },
};

export const QuickActions = ({ onAddNote, onTakePhoto, onMarkComplete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const toggleMenu = () => {
    const toValue = isOpen ? 0 : 1;

    Animated.timing(animation, {
      toValue,
      duration: 200,
      useNativeDriver: true,
    }).start();

    setIsOpen(!isOpen);
  };

  const actionButtons = [
    {
      icon: "📝",
      action: onAddNote,
      color: dogThemeColors.accent,
      shadowColor: dogThemeColors.accent,
      label: "Note"
    },
    {
      icon: "📸",
      action: onTakePhoto,
      color: dogThemeColors.secondary,
      shadowColor: dogThemeColors.secondary,
      label: "Photo"
    },
    {
      icon: "✅",
      action: onMarkComplete,
      color: dogThemeColors.success,
      shadowColor: dogThemeColors.success,
      label: "Check"
    },
  ];

  return (
    <View style={styles.quickActionsContainer}>
      {isOpen && actionButtons.map((button, index) => (
        <Animated.View
          key={index}
          style={[
            styles.actionButton,
            {
              transform: [
                {
                  translateY: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -(65 * (index + 1))],
                  }),
                },
                {
                  scale: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.actionButtonInner,
              {
                backgroundColor: button.color,
                shadowColor: button.shadowColor,
              },
            ]}
            onPress={() => {
              button.action();
              toggleMenu();
            }}
            activeOpacity={0.8}
          >
            <Text style={{ fontSize: 20 }}>{button.icon}</Text>
          </TouchableOpacity>
        </Animated.View>
      ))}

      <TouchableOpacity style={styles.mainButton} onPress={toggleMenu} activeOpacity={0.8}>
        <Animated.View
          style={{
            transform: [
              {
                rotate: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0deg", "45deg"],
                }),
              },
            ],
          }}
        >
          <Text style={{ fontSize: 28, color: dogThemeColors.light }}>🐾</Text>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};