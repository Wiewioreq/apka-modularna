import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ErrorBoundary } from "./src/components/ErrorBoundary";
import MainNavigator from "./MainNavigator";

export default function App() {
  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <MainNavigator />
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}