import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { dogThemeColors } from '../constants/colors';

const SyncIndicator = ({ syncing }) => {
  if (!syncing) return null;

  return (
    <View style={styles.syncIndicator}>
      <Text style={{ fontSize: 16, marginRight: 6 }}>🔄</Text>
      <Text style={styles.syncText}>Syncing with pack...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  syncIndicator: {
    position: "absolute",
    bottom: 100,
    right: 20,
    backgroundColor: dogThemeColors.primary,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 2,
    borderColor: dogThemeColors.accent,
  },
  syncText: {
    color: dogThemeColors.light,
    fontSize: 14,
    fontWeight: "600",
  },
});

export default SyncIndicator;