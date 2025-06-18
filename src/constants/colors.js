// ========== DOG TRAINING THEMED COLORS PALETTE ==========
export const dogThemeColors = {
  primary: "#8B4513",           // Saddle Brown - warm and earthy
  secondary: "#D2691E",         // Chocolate - friendly orange-brown
  accent: "#DAA520",            // Goldenrod - golden retriever inspired
  success: "#228B22",           // Forest Green - nature/outdoor training
  warning: "#FF6347",           // Tomato - attention grabbing
  light: "#FFF8DC",             // Cornsilk - warm cream background
  lightAccent: "#F5DEB3",       // Wheat - subtle warm accent
  darkText: "#2F1B14",          // Dark brown
  mediumText: "#8B4513",        // Medium brown
  cardBg: "#FFFAF0",            // Floral white - warm card background
  pawPrint: "#CD853F",          // Peru - paw print color
};

export const timeSlotColors = {
  morning: {
    backgroundColor: "#FFFACD",
    borderColor: dogThemeColors.accent,
    iconColor: "#B8860B",
    textColor: "#5D4E37",
    emoji: "🌅",
    title: "Morning Walk & Training"
  },
  midday: {
    backgroundColor: "#E0F6FF",
    borderColor: dogThemeColors.primary,
    iconColor: dogThemeColors.primary,
    textColor: dogThemeColors.darkText,
    emoji: "☀️",
    title: "Midday Activities"
  },
  evening: {
    backgroundColor: "#E6E6FA",
    borderColor: "#6A5ACD",
    iconColor: "#483D8B",
    textColor: "#2F2F4F",
    emoji: "🌆",
    title: "Evening Session"
  },
  play: {
    backgroundColor: "#F0FFF0",
    borderColor: dogThemeColors.success,
    iconColor: "#228B22",
    textColor: "#006400",
    emoji: "🎾",
    title: "Play & Bonding Time"
  },
};