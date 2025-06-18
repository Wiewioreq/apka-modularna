import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { dogThemeColors } from '../constants/colors';
import { 
  DogHouseIcon, 
  CalendarPawIcon, 
  PawIcon, 
  NotesBoneIcon, 
  TrophyIcon, 
  DogFamilyIcon 
} from './CustomIcons';

const NavigationTabs = ({ viewMode, setViewMode }) => {
  const navigationTabs = [
    { key: "daily", iconLib: "custom", iconName: "home", CustomIcon: DogHouseIcon, label: "🏠 Home" },
    { key: "weekly", iconLib: "custom", iconName: "calendar", CustomIcon: CalendarPawIcon, label: "📅 Weekly" },
    { key: "progress", iconLib: "custom", iconName: "paw", CustomIcon: PawIcon, label: "📈 Progress" },
    { key: "notes", iconLib: "custom", iconName: "notes", CustomIcon: NotesBoneIcon, label: "📝 Notes" },
    { key: "achievements", iconLib: "custom", iconName: "trophy", CustomIcon: TrophyIcon, label: "🏆 Awards" },
    { key: "family", iconLib: "custom", iconName: "family", CustomIcon: DogFamilyIcon, label: "👨‍👩‍👧‍👦 Pack" }
  ];

  return (
    <View style={styles.enhancedNavigationContainer}>
      {navigationTabs.map((tab) => {
        const isActive = viewMode === tab.key;
        
        const renderIcon = () => {
          const iconColor = isActive ? dogThemeColors.light : dogThemeColors.mediumText;
          
          if (tab.iconLib === "custom" && tab.CustomIcon) {
            return <tab.CustomIcon size={22} color={iconColor} />;
          }
        };

        return (
          <TouchableOpacity
            key={tab.key}
            style={[styles.navTab, isActive && styles.enhancedNavTabActive]}
            onPress={() => setViewMode(tab.key)}
            activeOpacity={0.7}
          >
            {renderIcon()}
            <Text style={[
              styles.navTabText,
              { color: isActive ? dogThemeColors.light : dogThemeColors.mediumText }
            ]}>
              {tab.label}
            </Text>
            {isActive && (
              <View style={styles.activeTabIndicator} />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  enhancedNavigationContainer: {
    backgroundColor: dogThemeColors.cardBg,
    borderRadius: 16,
    padding: 6,
    marginBottom: 20,
    shadowColor: dogThemeColors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2,
    borderColor: dogThemeColors.lightAccent,
    flexDirection: "row",
  },
  navTab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 2,
    borderRadius: 12,
    marginHorizontal: 1,
  },
  navTabText: {
    fontSize: 9,
    fontWeight: "600",
    marginTop: 2,
    textAlign: "center",
  },
  enhancedNavTabActive: {
    backgroundColor: dogThemeColors.primary,
    shadowColor: dogThemeColors.secondary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  activeTabIndicator: {
    position: "absolute",
    bottom: 0,
    left: "25%",
    right: "25%",
    height: 3,
    borderRadius: 2,
    backgroundColor: dogThemeColors.accent,
  },
});

export default NavigationTabs;