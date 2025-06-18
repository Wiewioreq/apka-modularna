import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { dogThemeColors } from '../constants/colors';
import { getCurrentDate, getCurrentTime } from '../utils/date';
import DogAvatar from './DogAvatar';

const AppHeader = ({ 
  dogName, 
  dogBreed, 
  currentDogAge, 
  openEditDogModal, 
  handleLogout, 
  forceSyncToFirebase, 
  syncing, 
  isOffline 
}) => {
  return (
    <View style={styles.enhancedHeaderContainer}>
      <View style={styles.headerTop}>
        <View style={styles.dogInfoContainer}>
          <DogAvatar dogName={dogName} dogBreed={dogBreed} />
          <View style={styles.dogInfo}>
            <Text style={styles.enhancedDogName}>🐕 {dogName}</Text>
            <Text style={styles.dogDetails}>
              {dogBreed} &nbsp;&bull;&nbsp; {currentDogAge}
            </Text>
          </View>
        </View>
        <View style={styles.dateTimeContainer}>
          <Text style={styles.currentDate}>📅 {getCurrentDate()}</Text>
          <Text style={styles.currentTime}>🕐 {getCurrentTime()}</Text>
          <TouchableOpacity 
            style={styles.forceSyncButton} 
            onPress={forceSyncToFirebase}
            disabled={syncing || isOffline}
          >
            <Text style={{ fontSize: 16, marginRight: 4 }}>🔄</Text>
            <Text style={styles.forceSyncText}>Force Sync</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.headerBottom}>
        <TouchableOpacity onPress={openEditDogModal} style={styles.editButton} activeOpacity={0.7}>
          <Text style={{ fontSize: 16, marginRight: 6 }}>✏️</Text>
          <Text style={styles.editButtonText}>Edit Pup Info</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton} activeOpacity={0.8}>
          <Text style={{ fontSize: 16, marginRight: 6 }}>🔄</Text>
          <Text style={styles.logoutText}>Switch Pack</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  enhancedHeaderContainer: {
    marginBottom: 20,
    backgroundColor: dogThemeColors.cardBg,
    borderRadius: 20,
    padding: 20,
    shadowColor: dogThemeColors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 2,
    borderColor: dogThemeColors.lightAccent,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  dogInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  dogInfo: {
    flex: 1,
    justifyContent: "center",
  },
  enhancedDogName: {
    fontSize: 18,
    fontWeight: "700",
    color: dogThemeColors.darkText,
    letterSpacing: 0.3,
  },
  dogDetails: {
    fontSize: 14,
    color: dogThemeColors.mediumText,
    marginTop: 2,
    fontWeight: "500",
  },
  dateTimeContainer: {
    alignItems: "flex-end",
    backgroundColor: dogThemeColors.lightAccent,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: dogThemeColors.accent,
    minWidth: 140,
  },
  currentDate: {
    fontSize: 16,
    fontWeight: "700",
    color: dogThemeColors.darkText,
  },
  currentTime: {
    fontSize: 14,
    color: dogThemeColors.mediumText,
    marginTop: 2,
    fontWeight: "500",
  },
  forceSyncButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: dogThemeColors.cardBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 6,
    borderWidth: 1,
    borderColor: dogThemeColors.accent,
  },
  forceSyncText: {
    color: dogThemeColors.primary,
    fontSize: 12,
    fontWeight: "500",
  },
  headerBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: dogThemeColors.lightAccent,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: dogThemeColors.accent,
    marginRight: 12,
  },
  editButtonText: {
    color: dogThemeColors.primary,
    fontSize: 14,
    fontWeight: "500",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFE6E6",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: dogThemeColors.warning,
  },
  logoutText: {
    color: dogThemeColors.warning,
    fontSize: 14,
    fontWeight: "500",
  },
});

export default AppHeader;