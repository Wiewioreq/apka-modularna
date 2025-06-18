import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { dogThemeColors } from '../constants/colors';

const OfflineBanner = () => {
  return (
    <View style={styles.offlineBanner}>
      <Text style={{ fontSize: 20, marginRight: 8 }}>📶</Text>
      <Text style={styles.offlineText}>You're offline. Changes will sync when back online! 🐕</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  offlineBanner: {
    backgroundColor: dogThemeColors.warning,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#FF4444",
  },
  offlineText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
  },
});

export default OfflineBanner;