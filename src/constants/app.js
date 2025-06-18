// TailWag Tracker - Original App Constants & Functions (Exact Copy)
// Updated: 2025-06-15 16:05:01 UTC by Wiewioreq

import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";

export const APP_VERSION = "2.0.0 - Puppy Edition";
export const BUILD_DATE = "2025-06-13";

export const getCurrentDate = () => new Date().toISOString().slice(0, 10);
export const getCurrentTime = () => new Date().toTimeString().slice(0, 8);

export const commonUKBreeds = [
  "🐕 Labrador Retriever",
  "🐕‍🦺 Cocker Spaniel", 
  "🐕 French Bulldog",
  "🐕 Bulldog",
  "🌭 Dachshund",
  "🐕‍🦺 German Shepherd",
  "🐕 Jack Russell Terrier",
  "💪 Staffordshire Bull Terrier",
  "🐕‍🦺 Border Collie",
  "🐕 Golden Retriever",
];

export const breedTips = {
  "🐕 Labrador Retriever": [
    "🏊‍♂️ Labs love water – include swimming in their routine!",
    "🦴 They respond well to food rewards but watch their weight.",
    "🎾 Labs are natural retrievers - use fetch games for training.",
  ],
  "🐕‍🦺 Cocker Spaniel": [
    "⚡ Spaniels are energetic and need regular, varied exercise.",
    "🧠 Mental stimulation is crucial for this clever breed.",
    "🕵️ Use their hunting instincts with hide-and-seek games.",
  ],
  "🐕 French Bulldog": [
    "🌡️ Short walks suit their breathing; avoid heat.",
    "👥 They thrive on companionship and gentle training.",
    "🏠 Focus on indoor activities during hot weather.",
  ],
  "🐕 Bulldog": [
    "⏰ Keep sessions short and allow rest breaks.",
    "🌡️ Monitor for overheating, especially in warm weather.",
    "✨ Use positive reinforcement with patience.",
  ],
  "🌭 Dachshund": [
    "🦴 Protect their back: avoid stairs and jumping.",
    "⏱️ Short, positive training sessions work best.",
    "🏠 Use ramps instead of stairs to protect their spine.",
  ],
  "🐕‍🦺 German Shepherd": [
    "🏃‍♂️ GSDs need jobs: try agility or advanced obedience.",
    "👥 Early and ongoing socialisation is key.",
    "🧠 Challenge their intelligence with complex tasks.",
  ],
  "🐕 Jack Russell Terrier": [
    "🧩 Channel their energy into games and puzzles.",
    "📏 Consistent boundaries are essential.",
    "🧠 Provide plenty of mental stimulation daily.",
  ],
  "💪 Staffordshire Bull Terrier": [
    "✨ They excel with positive reinforcement.",
    "🎮 Plenty of social play helps prevent boredom.",
    "💪 Focus on building confidence through training.",
  ],
  "🐕‍🦺 Border Collie": [
    "🏆 They thrive on advanced tricks and mental work.",
    "📋 Provide daily tasks to keep them busy.",
    "🏃‍♂️ Border Collies need both physical and mental exercise.",
  ],
  "🐕 Golden Retriever": [
    "🎾 Retrievers love to carry and fetch – use this in games.",
    "👥 Social, gentle training is most effective.",
    "🏫 They excel in group training environments.",
  ],
  "Advanced Training": [
    "🏆 Focus on consistency - advanced dogs need regular practice",
    "🧠 Challenge their mind with complex puzzles and tasks",
    "🎯 Set specific goals for each training session",
    "⚡ Advanced dogs respond well to variable reward schedules",
    "🎪 Incorporate trick chains and sequence training",
    "🏃‍♂️ Use environmental challenges to build confidence",
    "👥 Practice skills in different locations with distractions",
    "🧘‍♂️ Include impulse control and patience exercises",
  ],
};

export const trainingStages = {
  1: {
    name: "🐶 Puppy Foundation (Weeks 1-4)",
    range: "8-12 weeks",
    color: "#E6F3E6",
    borderColor: "#228B22",
    textColor: "#0F4A0F",
    emoji: "🐶",
  },
  2: {
    name: "🎓 Basic Training (Weeks 5-16)", 
    range: "12-16 weeks",
    color: "#E6F0FF",
    borderColor: "#8B4513",
    textColor: "#1A365D",
    emoji: "🎓",
  },
  3: {
    name: "🏆 Advanced Skills (Weeks 17-26)",
    range: "4-6 months", 
    color: "#FFF0E6",
    borderColor: "#DAA520",
    textColor: "#744210",
    emoji: "🏆",
  },
  4: {
    name: "🐕‍🦺 Young Adult (Weeks 27-39)",
    range: "6-9 months",
    color: "#FFE6E6",
    borderColor: "#FF6347",
    textColor: "#7A1A1A",
    emoji: "🐕‍🦺",
  },
  5: {
    name: "🎯 Mature Dog (Weeks 40-52)",
    range: "9-12 months",
    color: "#F0E6FF",
    borderColor: "#8B4FB3",
    textColor: "#4A1A5A",
    emoji: "🎯",
  },
};

export const timeSlotColors = {
  morning: {
    backgroundColor: "#FFFACD",
    borderColor: "#DAA520",
    iconColor: "#B8860B",
    textColor: "#5D4E37",
    emoji: "🌅",
    title: "Morning Walk & Training"
  },
  midday: {
    backgroundColor: "#E0F6FF",
    borderColor: "#8B4513",
    iconColor: "#8B4513",
    textColor: "#2F1B14",
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
    borderColor: "#228B22",
    iconColor: "#228B22",
    textColor: "#006400",
    emoji: "🎾",
    title: "Play & Bonding Time"
  },
};

export const weeklyPlans = {
  1: ["🏠 Name recognition", "🏠 Crate training", "🚽 Potty training"],
  2: ["🪑 Sit & Down", "👋 Handling paws/ears/mouth", "🦮 Intro to leash"],
  3: ["🐕 Meet calm dogs", "🔊 New surfaces & sounds", "⏱️ Short training sessions"],
  4: ["📢 Basic recall (indoors)", "🏠 Continue potty/crate", "🚶‍♂️ Social walk (carry if needed)"],
  5: ["✋ Wait & Leave it", "🦮 Loose-leash walking", "🧩 Puzzle toy intro"],
  6: ["⏸️ Sit-Stay & Down-Stay", "📢 Recall indoors", "🚗 Traffic & bike exposure"],
  7: ["🪀 Tug with drop-it", "🔍 Find-it game", "🔊 New sounds/social areas"],
  8: ["📚 Reinforce all basics", "🧩 Puzzle time", "🏠 Crate review"],
  9: ["📢 Recall w/ distractions", "⏸️ Advanced stays", "🎯 Marker word training"],
  10: ["📍 Place command", "🧩 Puzzle toy advanced", "🔄 Spin trick"],
  11: ["👃 Scent games", "🤝 Shake trick", "📚 Review leash & crate"],
  12: ["🙇‍♂️ Bow trick", "🎯 New distractions", "🎯 Clicker practice"],
  13: ["🎯 Mix tricks: combo day", "🥾 Trail walk intro", "😌 Social calm practice"],
  14: ["⏱️ Stays with duration", "🦮 Heel in quiet area", "🥣 Slow feeder puzzle"],
  15: ["🎯 Clicker games", "🎮 Play with purpose", "📍 Place & Stay combo"],
  16: ["☕ Dog-friendly cafe visit", "📢 New location recall", "🪀 Tug with control"],
  17: ["🎯 Advanced recall training", "🚶‍♂️ Off-leash walking prep", "🧠 Complex puzzle solving"],
  18: ["🏃‍♂️ Agility course basics", "👥 Dog park socialization", "🎪 Trick combinations"],
  19: ["🔍 Advanced scent work", "⏰ Extended stay commands", "🚗 Car travel training"],
  20: ["🎾 Fetch with commands", "🧘‍♂️ Impulse control exercises", "🏠 Boundary training"],
  21: ["🦮 Service dog basics", "📞 Response to name from distance", "🎯 Target training"],
  22: ["🌟 Show off skills", "👨‍👩‍👧‍👦 Family obedience", "🎪 Performance tricks"],
  23: ["🏃‍♂️ Running companion training", "🦴 Advanced food puzzles", "📐 Precision commands"],
  24: ["🚶‍♂️ Urban environment skills", "🔊 Noise desensitization", "🎯 Distance commands"],
  25: ["🏆 Competition preparation", "🧠 Problem-solving tasks", "⚡ Quick response training"],
  26: ["🎪 Advanced trick mastery", "🦮 Public access skills", "📚 Skills assessment"],
  27: ["🐕‍🦺 Adult dog responsibilities", "🏠 Household management", "👥 Leadership training"],
  28: ["🎯 Precision obedience", "🏃‍♂️ Exercise routines", "🧠 Mental stimulation games"],
  29: ["🦮 Advanced leash skills", "🏞️ Outdoor adventures", "🎪 Entertainment tricks"],
  30: ["👥 Social etiquette", "🏠 Home alone training", "🔍 Search and find games"],
  31: ["🏆 Skill refinement", "🚗 Travel preparation", "📚 Knowledge consolidation"],
  32: ["🎾 Sport training basics", "🧘‍♂️ Relaxation techniques", "🎯 Focus exercises"],
  33: ["🏃‍♂️ Fitness training", "🧠 Advanced puzzles", "👨‍👩‍👧‍👦 Family integration"],
  34: ["🦮 Therapy dog prep", "💼 Work environment skills", "🎪 Public demonstrations"],
  35: ["🏞️ Nature skills", "🔊 Sound training", "⚡ Emergency commands"],
  36: ["🎯 Specialized training", "🏠 Property protection", "📐 Precise positioning"],
  37: ["🧠 Intelligence tests", "🎾 Advanced games", "👥 Stranger interaction"],
  38: ["🏆 Skill competitions", "🚶‍♂️ Perfect heel", "🔍 Detection training"],
  39: ["🎪 Master performer", "🦮 Guide dog skills", "📚 Complete assessment"],
  40: ["🐕 Mature dog skills", "🏠 Household guardian", "👥 Pack leadership"],
  41: ["🎯 Expert obedience", "🏃‍♂️ Endurance training", "🧠 Complex problems"],
  42: ["🦮 Professional skills", "🎪 Entertainment mastery", "🔍 Expert searching"],
  43: ["🏆 Champion training", "🚗 Travel expert", "📚 Skill maintenance"],
  44: ["👥 Social ambassador", "🏞️ Outdoor expert", "🎾 Game master"],
  45: ["🧘‍♂️ Zen training", "💼 Working dog skills", "⚡ Instant response"],
  46: ["🎯 Precision master", "🏠 Home management", "🔊 Communication expert"],
  47: ["🧠 Genius level tasks", "🎪 Performance artist", "👨‍👩‍👧‍👦 Family cornerstone"],
  48: ["🏆 Award worthy skills", "🦮 Service excellence", "📐 Perfect execution"],
  49: ["🎾 Lifetime athlete", "🔍 Detection expert", "🏞️ Adventure companion"],
  50: ["🐕‍🦺 Senior preparation", "👥 Wisdom sharing", "🧘‍♂️ Peaceful mastery"],
  51: ["🏠 Legacy training", "📚 Knowledge transfer", "🎯 Lifetime achievement"],
  52: ["🎉 One year celebration", "🏆 Master graduate", "💝 Lifetime companion"],
};

export const dailyRoutine = {
  morning: ["🚽 Potty break", "🍽️ Breakfast", "📚 Basic commands review"],
  midday: ["🎓 Primary training focus", "👥 Socialization/Exposure", "🧠 Mental stimulation"],
  evening: ["📢 Recall practice", "📚 Command reinforcement", "😌 Cool down"],
  play: ["🎮 Structured play", "❤️ Bonding time", "🏃‍♂️ Free play"],
};

export const achievements = [
  { id: "first_week", title: "🎉 First Week Graduate!", description: "Completed your first week of training", icon: "🐶" },
  { id: "streak_7", title: "⚡ Week Warrior", description: "7 days training streak", icon: "🔥" },
  { id: "streak_30", title: "🏆 Monthly Master", description: "30 days training streak", icon: "👑" },
  { id: "all_daily", title: "⭐ Daily Champion", description: "Completed all daily tasks", icon: "🌟" },
  { id: "photo_first", title: "📸 Picture Pawfect", description: "Added your first progress photo", icon: "📷" },
  { id: "week_perfect", title: "💯 Perfect Week", description: "Completed all activities in a week", icon: "🎯" },
  { id: "month_6", title: "🎯 6 Month Milestone", description: "Completed 26 weeks of training", icon: "🎯" },
  { id: "year_complete", title: "🏆 Full Year Champion", description: "Completed all 52 weeks", icon: "👑" },
  { id: "advanced_master", title: "🧠 Advanced Master", description: "Completed advanced training phase", icon: "🧠" },
];

export const MAX_WEEKS = 52;

// UTILITY FUNCTIONS (EXACT ORIGINAL)
export const getCurrentStage = (week) => {
  if (week <= 4) return 1;
  if (week <= 16) return 2;
  if (week <= 26) return 3;
  if (week <= 39) return 4;
  if (week <= 52) return 5;
  return 5; // Cap at stage 5
};

export const isValidDate = (dateString) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return false;
  const date = new Date(dateString + "T00:00:00.000Z");
  return !isNaN(date) && dateString === date.toISOString().slice(0, 10);
};

export const deepEqual = (obj1, obj2) => {
  if (obj1 === obj2) return true;
  if (obj1 == null || obj2 == null) return false;
  if (typeof obj1 !== typeof obj2) return false;

  if (typeof obj1 !== "object") return obj1 === obj2;

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (let key of keys1) {
    if (!keys2.includes(key)) return false;
    if (!deepEqual(obj1[key], obj2[key])) return false;
  }

  return true;
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

export async function updateDogInfoStorageAndFirestore(familyId, name, breed, dob, db = null) {
  await AsyncStorage.setItem("dogName", name);
  await AsyncStorage.setItem("dogBreed", breed);
  await AsyncStorage.setItem("dogDob", dob);
  if (familyId && db) {
    await db.collection("families").doc(familyId).set(
      { dogName: name, dogBreed: breed, dogDob: dob },
      { merge: true }
    );
  }
}

export const showToast = (message, type = "info") => {
  const titles = {
    success: "Woof! Success! 🎉",
    error: "Oops! 🐕",
    info: "Pupdate! 🐶"
  };
  
  Alert.alert(titles[type], message, [{ text: "Got it!" }]);
};

// NEW FUNCTION: Convert image to base64
export const imageToBase64 = async (uri) => {
  try {
    const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
    return { base64, type: uri.split('.').pop() || 'jpg' };
  } catch (error) {
    console.error("Error converting image to base64:", error);
    return null;
  }
};

export default {
  APP_VERSION,
  BUILD_DATE,
  getCurrentDate,
  getCurrentTime,
  commonUKBreeds,
  breedTips,
  trainingStages,
  timeSlotColors,
  weeklyPlans,
  dailyRoutine,
  achievements,
  MAX_WEEKS,
  getCurrentStage,
  isValidDate,
  deepEqual,
  calcDogAge,
  calculateStreak,
  updateDogInfoStorageAndFirestore,
  showToast,
  imageToBase64,
};

console.log("✅ Original app constants & functions restored at 2025-06-15 16:05:01 UTC by Wiewioreq");