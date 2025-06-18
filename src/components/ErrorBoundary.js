import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { dogThemeColors } from "../constants";

const styles = {
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    backgroundColor: dogThemeColors.light,
  },
  errorTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: dogThemeColors.darkText,
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  errorText: {
    fontSize: 18,
    color: dogThemeColors.mediumText,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 26,
  },
  errorButton: {
    backgroundColor: dogThemeColors.primary,
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: dogThemeColors.accent,
  },
  errorButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: dogThemeColors.light,
  },
};

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("App Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={{ fontSize: 48 }}>🐕</Text>
          <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
          <Text style={styles.errorText}>Don't worry, even the best-trained dogs have accidents!</Text>
          <TouchableOpacity
            style={styles.errorButton}
            onPress={() => this.setState({ hasError: false })}
          >
            <Text style={styles.errorButtonText}>🔄 Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}