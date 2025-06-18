import { Alert } from "react-native";
import * as FileSystem from "expo-file-system";
import { dailyRoutine } from "../constants";

export const getCurrentStage = (week) => {
  if (week <= 4) return 1;
  if (week <= 16) return 2;
  if (week <= 26) return 3;
  if (week <= 39) return 4;
  if (week <= 52) return 5;
  return 5; // Cap at stage 5
};

export function calcDogAge(dob, weekOffset = 0, nowDate) {
  if (!dob) return "";
  const dobDate = new Date(dob);
  if (isNaN(dobDate)) return "";
  let baseTime = nowDate ? nowDate.getTime() : Date.now();
  let virtualDate = new Date(dobDate.getTime() + weekOffset * 7 * 24 * 60 * 60 * 1000);
  let diff = baseTime - virtualDate.getTime();
  if (diff < 0) diff = 0;
  let ageDate = new Date(diff);
  let years = ageDate.getUTCFullYear() - 1970;
  let months = ageDate.getUTCMonth();
  let days = ageDate.getUTCDate() - 1;
  let weeks = Math.floor(days / 7);
  let ageStr = "";
  if (years > 0) ageStr += `${years}y `;
  if (months > 0) ageStr += `${months}m `;
  if (weeks > 0) ageStr += `${weeks}w`;
  if (!ageStr) ageStr = "🐶 New puppy";
  return ageStr.trim();
}

export const calculateStreak = (completedDailyByDate) => {
  const dates = Object.keys(completedDailyByDate).sort().reverse();
  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 0;

  const today = new Date();

  for (let i = 0; i < dates.length; i++) {
    const date = dates[i];
    const completedTasks = completedDailyByDate[date] || [];
    const allDailyKeys = Object.entries(dailyRoutine).flatMap(([slot, acts]) =>
      acts.map((activity) => `daily-${slot}-${activity}`)
    );

    const isComplete = completedTasks.length >= allDailyKeys.length * 0.8;

    if (isComplete) {
      tempStreak++;
      if (i === 0 || dates[i - 1] === today.toISOString().slice(0, 10)) {
        currentStreak = tempStreak;
      }
    } else {
      bestStreak = Math.max(bestStreak, tempStreak);
      tempStreak = 0;
    }
  }

  bestStreak = Math.max(bestStreak, tempStreak);
  return { currentStreak, bestStreak };
};

export const showToast = (message, type = "info") => {
  const titles = {
    success: "Woof! Success! 🎉",
    error: "Oops! 🐕",
    info: "Pupdate! 🐶"
  };
  
  Alert.alert(titles[type], message, [{ text: "Got it!" }]);
};

// Convert image to base64
export const imageToBase64 = async (uri) => {
  try {
    const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
    return { base64, type: uri.split('.').pop() || 'jpg' };
  } catch (error) {
    console.error("Error converting image to base64:", error);
    return null;
  }
};