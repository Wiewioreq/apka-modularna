import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { dogThemeColors } from '../constants/colors';

const LoadingScreen = ({ text = "Loading your pup's data..." }) => {
  return (
    <View style={styles.loadingContainer}>
      <Text style={{ fontSize: 48, marginBottom: 16 }}>🐕</Text>
      <ActivityIndicator size="large" color={dogThemeColors.primary} />
      <Text style={styles.loadingText}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: dogThemeColors.light,
  },
  loadingText: {
    fontSize: 18,
    color: dogThemeColors.mediumText,
    marginTop: 12,
  },
});

export default LoadingScreen;