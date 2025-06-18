import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Platform,
  Modal,
  Image,
  Animated,
  Keyboard,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Feather,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import ConfettiCannon from "react-native-confetti-cannon";
import NetInfo from "@react-native-community/netinfo";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import RNPickerSelect from "react-native-picker-select";
import * as Notifications from "expo-notifications";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import Svg, { Circle, Path } from "react-native-svg";

// ✅ POPRAWNE IMPORTY z folderów src/
import { ErrorBoundary } from "./src/components/ErrorBoundary";
import { DailyScreen } from "./src/screens/DailyScreen";
import { WeeklyScreen } from "./src/screens/WeeklyScreen";
import { ProgressScreen } from "./src/screens/ProgressScreen";
import { NotesScreen } from "./src/screens/NotesScreen";
import { AchievementsScreen } from "./src/screens/AchievementsScreen";
import { FamilyScreen } from "./src/screens/FamilyScreen";
import { QuickActions } from "./src/components/QuickActions";
import { DogAvatar } from "./src/components/DogAvatar";

import {
  dogThemeColors,
  timeSlotColors,
  trainingStages,
  weeklyPlans,
  dailyRoutine,
  achievements,
  commonUKBreeds,
  breedTips,
  MAX_WEEKS,
} from "./src/constants";
import { getCurrentDate, getCurrentTime, isValidDate } from "./src/utils/date";
import { deepEqual } from "./src/utils/deepEqual";
import {
  getCurrentStage,
  calcDogAge,
  calculateStreak,
  showToast,
  imageToBase64,
} from "./src/utils/helpers";
import { db } from "./src/firebase/config";
import { styles } from "./src/styles/styles";


// ========== CONSTANTS ==========
const APP_VERSION = "2.0.0 - Puppy Edition";
const BUILD_DATE = "2025-06-16";

// ========== CUSTOM DOG TRAINING THEMED ICONS ==========
const DogHouseIcon = ({ size = 22, color = "#000" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M2 12l10-8 10 8v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8z"
      stroke={color}
      strokeWidth="2.5"
      fill="none"
    />
    <Circle cx="12" cy="16" r="1.5" fill={color} />
    <Path d="M8 12h8" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <Circle cx="9" cy="8" r="0.5" fill={color} />
    <Circle cx="15" cy="8" r="0.5" fill={color} />
  </Svg>
);

const PawIcon = ({ size = 22, color = "#000" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="18" r="2.5" fill={color} />
    <Circle cx="8" cy="14" r="1.8" fill={color} />
    <Circle cx="16" cy="14" r="1.8" fill={color} />
    <Circle cx="10" cy="10" r="1.2" fill={color} />
    <Circle cx="14" cy="10" r="1.2" fill={color} />
  </Svg>
);

const TrophyIcon = ({ size = 22, color = "#000" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <Path
      d="M6 9a6 6 0 0 0 12 0"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      fill={color}
      fillOpacity="0.1"
    />
    <Path d="M12 15v6M8 21h8" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    <Circle cx="12" cy="9" r="1" fill={color} />
  </Svg>
);

const DogFamilyIcon = ({ size = 22, color = "#000" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="8" r="3.5" stroke={color} strokeWidth="2.5" fill="none"/>
    <Path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke={color} strokeWidth="2.5"/>
    <Path d="M9 5l-1.5-2.5M15 5l1.5-2.5" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <Circle cx="5" cy="10" r="2.5" stroke={color} strokeWidth="2" fill="none"/>
    <Circle cx="19" cy="10" r="2.5" stroke={color} strokeWidth="2" fill="none"/>
    <Circle cx="9.5" cy="7" r="0.5" fill={color} />
    <Circle cx="14.5" cy="7" r="0.5" fill={color} />
  </Svg>
);

const CalendarPawIcon = ({ size = 22, color = "#000" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <Circle cx="12" cy="16" r="1.5" fill={color} />
    <Circle cx="10" cy="14" r="0.7" fill={color} />
    <Circle cx="14" cy="14" r="0.7" fill={color} />
    <Circle cx="11" cy="13" r="0.4" fill={color} />
    <Circle cx="13" cy="13" r="0.4" fill={color} />
  </Svg>
);

const NotesBoneIcon = ({ size = 22, color = "#000" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 4h18v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4z"
      stroke={color}
      strokeWidth="2.5"
      fill="none"
    />
    <Path d="M8 8h8M8 12h6M8 16h4" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <Path d="M16 14h2a1 1 0 1 1 0 2h-2a1 1 0 1 1 0-2z" stroke={color} strokeWidth="1.5" fill={color} fillOpacity="0.3"/>
  </Svg>
);

async function updateDogInfoStorageAndFirestore(familyId, name, breed, dob) {
  await AsyncStorage.setItem("dogName", name);
  await AsyncStorage.setItem("dogBreed", breed);
  await AsyncStorage.setItem("dogDob", dob);
  if (familyId) {
    await db.collection("families").doc(familyId).set(
      { dogName: name, dogBreed: breed, dogDob: dob },
      { merge: true }
    );
  }
}

// ========== MAIN APP COMPONENT ==========
function MainNavigator() {
  const [isOffline, setIsOffline] = useState(false);

  // Core state
  const [familyId, setFamilyId] = useState(null);
  const [dogName, setDogName] = useState(null);
  const [dogBreed, setDogBreed] = useState(null);
  const [dogDob, setDogDob] = useState(null);

  // Input states
  const [inputId, setInputId] = useState("");
  const [inputDog, setInputDog] = useState("");
  const [inputBreed, setInputBreed] = useState("");
  const [inputBreedOther, setInputBreedOther] = useState("");
  const [inputDob, setInputDob] = useState("");

  // UI states
  const [showDogInput, setShowDogInput] = useState(false);
  const [familyDogLoading, setFamilyDogLoading] = useState(true);
  const [checkingFamilyId, setCheckingFamilyId] = useState(false);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [manualSyncRequested, setManualSyncRequested] = useState(false);

  // Edit modal states
  const [editDogModal, setEditDogModal] = useState(false);
  const [editDogName, setEditDogName] = useState("");
  const [editDogBreed, setEditDogBreed] = useState("");
  const [editDogDob, setEditDogDob] = useState("");
  const [editDogBreedOther, setEditDogBreedOther] = useState("");

  // App data states
  const [currentWeek, setCurrentWeek] = useState(1);
  const [completedActivities, setCompletedActivities] = useState([]);
  const [dailyNotes, setDailyNotes] = useState({});
  const [viewMode, setViewMode] = useState("daily");
  const [selectedDate, setSelectedDate] = useState(() => getCurrentDate());
  const [completedDailyByDate, setCompletedDailyByDate] = useState({});

  // New feature states
  const [progressPhotos, setProgressPhotos] = useState([]);
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [quickNoteText, setQuickNoteText] = useState("");
  const [showQuickNote, setShowQuickNote] = useState(false);

  // Calendar notes feature states
  const [calendarNotes, setCalendarNotes] = useState({});
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [currentNoteDate, setCurrentNoteDate] = useState(null);
  const [noteInputText, setNoteInputText] = useState("");
  const [visibleNotes, setVisibleNotes] = useState({});

  // Family and notes states
  const [family, setFamily] = useState([
    { id: 1, name: "🏆 Primary Trainer", editing: false },
    { id: 2, name: "👨‍👩‍👧‍👦 Family Member 2", editing: false },
    { id: 3, name: "👨‍👩‍👧‍👦 Family Member 3", editing: false },
  ]);
  const [newFamilyName, setNewFamilyName] = useState("");
  const [editFamilyName, setEditFamilyName] = useState({});
  const [editingMemberId, setEditingMemberId] = useState(null);

  const [sharedNotes, setSharedNotes] = useState([]);
  const [newSharedNote, setNewSharedNote] = useState("");
  const [notesLoading, setNotesLoading] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editingNoteText, setEditingNoteText] = useState("");
  const [currentUserName, setCurrentUserName] = useState("🐕 Wiewioreq");

  // Celebration states
  const [showDailyConfetti, setShowDailyConfetti] = useState(false);
  const [showWeeklyConfetti, setShowWeeklyConfetti] = useState(false);
  const [currentDogAge, setCurrentDogAge] = useState(() => calcDogAge(dogDob, 0, new Date()));

  // Refs for cleanup and optimization
  const syncTimeout = useRef();
  const lastSyncedData = useRef({});
  const dobInputRef = useRef(null);

  // Add these with your other state declarations in MainApp function:
  const [celebratedWeeks, setCelebratedWeeks] = useState([]);
  const [celebratedDays, setCelebratedDays] = useState([]);

  // ========== UPDATED NAVIGATION TABS WITH COMPLETE DOG TRAINING THEME ==========
  const navigationTabs = [
    { key: "daily", iconLib: "custom", iconName: "home", CustomIcon: DogHouseIcon, label: "🏠 Home" },
    { key: "weekly", iconLib: "custom", iconName: "calendar", CustomIcon: CalendarPawIcon, label: "📅 Weekly" },
    { key: "progress", iconLib: "custom", iconName: "paw", CustomIcon: PawIcon, label: "📈 Progress" },
    { key: "notes", iconLib: "custom", iconName: "notes", CustomIcon: NotesBoneIcon, label: "📝 Notes" },
    { key: "achievements", iconLib: "custom", iconName: "trophy", CustomIcon: TrophyIcon, label: "🏆 Awards" },
    { key: "family", iconLib: "custom", iconName: "family", CustomIcon: DogFamilyIcon, label: "👨‍👩‍👧‍👦 Pack" }
  ];

  // Auto-delete notes for previous days
  useEffect(() => {
    const today = getCurrentDate();
    let changed = false;
    const newNotes = { ...calendarNotes };
    Object.keys(newNotes).forEach(date => {
      if (date < today) {
        delete newNotes[date];
        changed = true;
      }
    });
    if (changed) {
      setCalendarNotes(newNotes);
      if (familyId) {
        db.collection("families").doc(familyId).set({ calendarNotes: newNotes }, { merge: true });
      }
    }
  }, [calendarNotes, familyId]);

  // Modal open handler
  const handleOpenNoteModal = useCallback((date, text = "") => {
    setCurrentNoteDate(date);
    setNoteInputText(text);
    setShowNoteModal(true);
  }, []);

  // Modal save handler
  const handleSaveNote = async () => {
    if (noteInputText.trim()) {
      const newNotes = {
        ...calendarNotes,
        [currentNoteDate]: { text: noteInputText.trim(), savedAt: Date.now() }
      };
      setCalendarNotes(newNotes);
      setShowNoteModal(false);
      setVisibleNotes((prev) => ({ ...prev, [currentNoteDate]: true }));
      if (familyId) {
        await db.collection("families").doc(familyId).set(
          { calendarNotes: newNotes },
          { merge: true }
        );
      }
    } else {
      setShowNoteModal(false);
    }
    Keyboard.dismiss();
  };

  // Setup notifications with dog theme
  useEffect(() => {
    const setupNotifications = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted" || !dogName) return;

      await Notifications.cancelAllScheduledNotificationsAsync();

      await Notifications.scheduleNotificationAsync({
        content: {
          title: `🌅 Good morning!`,
          body: `Time for ${dogName}'s morning training session! 🐕`,
          sound: true,
        },
        trigger: {
          hour: 8,
          minute: 0,
          repeats: true,
        },
      });

      await Notifications.scheduleNotificationAsync({
        content: {
          title: `🌙 Evening training time!`,
          body: `Don't forget ${dogName}'s evening practice! 🎾`,
          sound: true,
        },
        trigger: {
          hour: 18,
          minute: 0,
          repeats: true,
        },
      });
    };

    if (dogName) {
      setupNotifications();
    }
  }, [dogName]);

  // Network status effect
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOffline(!state.isConnected);
    });
    NetInfo.fetch().then((state) => setIsOffline(!state.isConnected));
    return () => unsubscribe();
  }, []);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (syncTimeout.current) {
        clearTimeout(syncTimeout.current);
      }
    };
  }, []);

  // Initial data loading with dog theme
  useEffect(() => {
    (async () => {
      try {
        const id = await AsyncStorage.getItem("familyId");
        const dog = await AsyncStorage.getItem("dogName");
        const breed = await AsyncStorage.getItem("dogBreed");
        const dob = await AsyncStorage.getItem("dogDob");
        const username = await AsyncStorage.getItem("memberName");
        const photos = await AsyncStorage.getItem("progressPhotos");
        const achievements = await AsyncStorage.getItem("unlockedAchievements");

        if (id) setFamilyId(id);
        if (dog) setDogName(dog);
        if (breed) setDogBreed(breed);
        if (dob) setDogDob(dob);
        if (username) setCurrentUserName(username);
        if (photos) setProgressPhotos(JSON.parse(photos));
        if (achievements) setUnlockedAchievements(JSON.parse(achievements));
      } catch (e) {
        console.error("Error loading app data:", e);
      }

      try {
        const cdbd = await AsyncStorage.getItem("completedDailyByDate");
        if (cdbd) {
          const parsedData = JSON.parse(cdbd);
          setCompletedDailyByDate(parsedData);
        }
      } catch (e) {
        console.error("Failed to parse completedDailyByDate:", e);
      } finally {
        setFamilyDogLoading(false);
      }
    })();
  }, []);

  // Set current user name in AsyncStorage when it changes
  useEffect(() => {
    if (currentUserName) {
      AsyncStorage.setItem("memberName", currentUserName);
    }
  }, [currentUserName]);

  // Save photos and achievements to AsyncStorage
  useEffect(() => {
    AsyncStorage.setItem("progressPhotos", JSON.stringify(progressPhotos));
  }, [progressPhotos]);

  useEffect(() => {
    AsyncStorage.setItem("unlockedAchievements", JSON.stringify(unlockedAchievements));
  }, [unlockedAchievements]);

  // New manual sync function with dog theme
  const forceSyncToFirebase = useCallback(async () => {
    if (!familyId) {
      showToast("🏠 No family pack set", "error");
      return;
    }
    
    try {
      setSyncing(true);
      setManualSyncRequested(true);
      
      const dataToSync = {
        currentWeek,
        completedActivities,
        dailyNotes,
        dogName,
        dogBreed,
        dogDob,
        family,
        sharedNotes,
        completedDailyByDate,
        progressPhotos,
        unlockedAchievements,
        calendarNotes,
      };
      
      await db.collection("families").doc(familyId).set(dataToSync, { merge: true });
      lastSyncedData.current = { ...dataToSync };
      
      // Also fetch the latest data
      const docSnap = await db.collection("families").doc(familyId).get();
      if (docSnap.exists) {
        const data = docSnap.data();
        
        // Update with the latest data from Firestore
        if (data.currentWeek !== undefined) setCurrentWeek(data.currentWeek);
        if (data.completedActivities) setCompletedActivities(data.completedActivities);
        if (data.dailyNotes) setDailyNotes(data.dailyNotes);
        if (data.family) setFamily(data.family);
        if (data.sharedNotes) setSharedNotes(data.sharedNotes);
        if (data.dogName) setDogName(data.dogName);
        if (data.dogBreed) setDogBreed(data.dogBreed);
        if (data.dogDob) setDogDob(data.dogDob);
        if (data.completedDailyByDate) setCompletedDailyByDate(data.completedDailyByDate);
        if (data.progressPhotos) setProgressPhotos(data.progressPhotos);
        if (data.unlockedAchievements) setUnlockedAchievements(data.unlockedAchievements);
        if (data.calendarNotes) setCalendarNotes(data.calendarNotes);
      }

      showToast("🔄 Pack data synced successfully!", "success");
      
      // Save to AsyncStorage
      await AsyncStorage.setItem("completedDailyByDate", JSON.stringify(completedDailyByDate));
    } catch (e) {
      console.error("Failed to force sync:", e);
      showToast("🌐 Sync failed: " + e.message, "error");
    } finally {
      setSyncing(false);
      setManualSyncRequested(false);
    }
  }, [
    familyId, 
    currentWeek, 
    completedActivities, 
    dailyNotes, 
    dogName, 
    dogBreed, 
    dogDob, 
    family, 
    sharedNotes, 
    completedDailyByDate, 
    progressPhotos, 
    unlockedAchievements, 
    calendarNotes
  ]);

  // Optimized Firebase sync with deep comparison and dog theme
  const syncToFirebase = useCallback(
    async (data) => {
      if (!familyId || !data) return;

      if (deepEqual(lastSyncedData.current, data) && !manualSyncRequested) {
        setSyncing(false);
        return;
      }

      try {
        setSyncing(true);
        await db.collection("families").doc(familyId).set(data, { merge: true });
        lastSyncedData.current = { ...data };
        console.log("🐕 Pack data synced to Firebase successfully");
      } catch (e) {
        console.error("Failed to sync to Firebase:", e);
        if (!isOffline) {
          Alert.alert("🌐 Sync Error", "Failed to save changes to your pack. Please check your connection! 📶");
        }
      } finally {
        setSyncing(false);
        setManualSyncRequested(false);
      }
    },
    [familyId, isOffline, manualSyncRequested]
  );

  // Consolidated debounced sync effect
  useEffect(() => {
    if (loading || !familyId) return;

    const dataToSync = {
      currentWeek,
      completedActivities,
      dailyNotes,
      dogName,
      dogBreed,
      dogDob,
      family,
      sharedNotes,
      completedDailyByDate,
      progressPhotos,
      unlockedAchievements,
      calendarNotes,
    };

    if (syncTimeout.current) {
      clearTimeout(syncTimeout.current);
    }

    syncTimeout.current = setTimeout(() => {
      syncToFirebase(dataToSync);
      AsyncStorage.setItem("completedDailyByDate", JSON.stringify(completedDailyByDate)).catch((e) =>
        console.error("AsyncStorage save error", e)
      );
    }, manualSyncRequested ? 0 : 500);
  }, [
    currentWeek,
    completedActivities,
    dailyNotes,
    dogName,
    dogBreed,
    dogDob,
    family,
    sharedNotes,
    completedDailyByDate,
    progressPhotos,
    unlockedAchievements,
    calendarNotes,
    syncToFirebase,
    loading,
    familyId,
    manualSyncRequested,
  ]);

// Firebase snapshot listener with optimized updates and dog theme
useEffect(() => {
  if (!familyId) return;

  setLoading(true);
  setNotesLoading(true);

  const unsubscribe = db
    .collection("families")
    .doc(familyId)
    .onSnapshot(
      (docSnap) => {
        if (docSnap.exists) {
          const data = docSnap.data();

          if (data.currentWeek !== undefined && data.currentWeek !== currentWeek) {
            setCurrentWeek(data.currentWeek);
          }

          if (data.completedActivities && !deepEqual(data.completedActivities, completedActivities)) {
            setCompletedActivities(data.completedActivities);
          }

          if (data.dailyNotes && !deepEqual(data.dailyNotes, dailyNotes)) {
            setDailyNotes(data.dailyNotes);
          }

          if (data.family && !deepEqual(data.family, family)) {
            setFamily(data.family);
          }

          if (data.sharedNotes && !deepEqual(data.sharedNotes, sharedNotes)) {
            setSharedNotes(data.sharedNotes);
          }

          if (data.dogName && data.dogName !== dogName) {
            setDogName(data.dogName);
            AsyncStorage.setItem("dogName", data.dogName);
          }

          if (data.dogBreed && data.dogBreed !== dogBreed) {
            setDogBreed(data.dogBreed);
            AsyncStorage.setItem("dogBreed", data.dogBreed);
          }

          if (data.dogDob && data.dogDob !== dogDob) {
            setDogDob(data.dogDob);
            AsyncStorage.setItem("dogDob", data.dogDob);
          }

          if (data.completedDailyByDate && !deepEqual(data.completedDailyByDate, completedDailyByDate)) {
            setCompletedDailyByDate(data.completedDailyByDate);
            AsyncStorage.setItem("completedDailyByDate", JSON.stringify(data.completedDailyByDate)).catch((e) =>
              console.error("AsyncStorage save error", e)
            );
          }

          if (data.progressPhotos && !deepEqual(data.progressPhotos, progressPhotos)) {
            setProgressPhotos(data.progressPhotos);
          }

          if (data.unlockedAchievements && !deepEqual(data.unlockedAchievements, unlockedAchievements)) {
            setUnlockedAchievements(data.unlockedAchievements);
          }

          if (data.calendarNotes && !deepEqual(data.calendarNotes, calendarNotes)) {
            setCalendarNotes(data.calendarNotes);
          }

          lastSyncedData.current = {
            currentWeek: data.currentWeek ?? 1,
            completedActivities: data.completedActivities ?? [],
            dailyNotes: data.dailyNotes ?? {},
            dogName: data.dogName,
            dogBreed: data.dogBreed,
            dogDob: data.dogDob,
            family: data.family ?? [],
            sharedNotes: data.sharedNotes ?? [],
            completedDailyByDate: data.completedDailyByDate ?? {},
            progressPhotos: data.progressPhotos ?? [],
            unlockedAchievements: data.unlockedAchievements ?? [],
            calendarNotes: data.calendarNotes ?? {},
          };
        }
        setLoading(false);
        setNotesLoading(false);
      },
      (err) => {
        setLoading(false);
        setNotesLoading(false);
        console.error("Firestore snapshot error:", err);
        if (!isOffline) {
          Alert.alert("🌐 Pack Sync Error", "Could not sync with your training pack: " + err.message);
        }
      }
    );

  return unsubscribe;
}, [familyId]);

  // Dog age calculation effect
  useEffect(() => {
    if (!dogDob) return;
    const interval = setInterval(() => {
      setCurrentDogAge(calcDogAge(dogDob, 0, new Date()));
    }, 60 * 1000);
    setCurrentDogAge(calcDogAge(dogDob, 0, new Date()));
    return () => clearInterval(interval);
  }, [dogDob]);

  // Achievement checking effect with dog theme celebrations
  useEffect(() => {
    const checkAchievements = () => {
      const newAchievements = [];
      const { currentStreak } = calculateStreak(completedDailyByDate);

      // Check for new achievements
      if (currentWeek >= 1 && !unlockedAchievements.includes("first_week")) {
        newAchievements.push("first_week");
      }

      if (currentStreak >= 7 && !unlockedAchievements.includes("streak_7")) {
        newAchievements.push("streak_7");
      }

      if (currentStreak >= 30 && !unlockedAchievements.includes("streak_30")) {
        newAchievements.push("streak_30");
      }

      if (progressPhotos.length > 0 && !unlockedAchievements.includes("photo_first")) {
        newAchievements.push("photo_first");
      }

      // Check daily completion
      const today = new Date().toISOString().slice(0, 10);
      const completedToday = completedDailyByDate[today] || [];
      const allDailyKeys = Object.entries(dailyRoutine).flatMap(([slot, acts]) =>
        acts.map((activity) => `daily-${slot}-${activity}`)
      );

      if (completedToday.length >= allDailyKeys.length && !unlockedAchievements.includes("all_daily")) {
        newAchievements.push("all_daily");
      }

      // Check week perfect completion
      const currentWeekActivities = weeklyPlans[currentWeek] || [];
      const weekCompleted = currentWeekActivities.filter((act) =>
        completedActivities.includes(`${currentWeek}-${act}`)
      );

      if (
        weekCompleted.length === currentWeekActivities.length &&
        currentWeekActivities.length > 0 &&
        !unlockedAchievements.includes("week_perfect")
      ) {
        newAchievements.push("week_perfect");
      }

      // Add new achievements with dog theme celebration
      if (newAchievements.length > 0) {
        setUnlockedAchievements((prev) => [...prev, ...newAchievements]);
        newAchievements.forEach((achievementId) => {
          const achievement = achievements.find((a) => a.id === achievementId);
          if (achievement) {
            showToast(`🏆 Achievement Unlocked: ${achievement.title} 🐕`, "success");
          }
        });
      }
    };

    checkAchievements();
  }, [currentWeek, completedActivities, completedDailyByDate, progressPhotos, unlockedAchievements]);

  // HANDLER FUNCTIONS

  // Family ID submission with theme
  const handleFamilyIdSubmit = async () => {
    if (!inputId.trim()) return;
    setCheckingFamilyId(true);
    const famId = inputId.trim();

    try {
      const docSnap = await db.collection("families").doc(famId).get();
      if (docSnap.exists) {
        const data = docSnap.data();
        if (data.dogName && data.dogBreed && data.dogDob) {
          await AsyncStorage.setItem("familyId", famId);
          await AsyncStorage.setItem("dogName", data.dogName);
          await AsyncStorage.setItem("dogBreed", data.dogBreed);
          await AsyncStorage.setItem("dogDob", data.dogDob);
          setFamilyId(famId);
          setDogName(data.dogName);
          setDogBreed(data.dogBreed);
          setDogDob(data.dogDob);
          setCheckingFamilyId(false);
          setShowDogInput(false);
        } else {
          Alert.alert(
            "🏠 Family Pack Found",
            "This Family ID exists but is missing some pup info. Please contact your pack leader!"
          );
          setCheckingFamilyId(false);
        }
      } else {
        Alert.alert(
          "🎉 Create New Training Pack?",
          `No training pack found for ID "${famId}". Would you like to create a new pack with this ID?`,
          [
            { text: "❌ Cancel", style: "cancel", onPress: () => setCheckingFamilyId(false) },
            {
              text: "🚀 Create Pack",
              style: "default",
              onPress: () => {
                setShowDogInput(true);
                setCheckingFamilyId(false);
              },
            },
          ]
        );
      }
    } catch (e) {
      Alert.alert("🌐 Connection Issue", e.message);
      setCheckingFamilyId(false);
    }
  };

  // Dog details submission with theme
  const handleDogDetailsSubmit = async () => {
    const breedToSave = inputBreed === "Other" ? inputBreedOther.trim() : inputBreed;

    if (!inputId.trim() || !inputDog.trim() || !breedToSave || !inputDob.trim()) {
      Alert.alert("🐕 Missing Pup Info", "Please fill in all required fields for your furry friend!");
      return;
    }

    if (inputBreed === "Other" && !inputBreedOther.trim()) {
      Alert.alert("🐕‍🦺 Breed Required", "Please tell us what breed your pup is!");
      return;
    }

    if (!isValidDate(inputDob.trim())) {
      Alert.alert("🎂 Invalid Date", "Please enter a valid birthday in YYYY-MM-DD format.");
      return;
    }

    const famId = inputId.trim();
    const dName = inputDog.trim();
    const dBreed = breedToSave;
    const dDob = inputDob.trim();

    try {
      await db.collection("families").doc(famId).set(
        {
          dogName: dName,
          dogBreed: dBreed,
          dogDob: dDob,
          family: [
            { id: 1, name: "🏆 Primary Trainer", editing: false },
            { id: 2, name: "👨‍👩‍👧‍👦 Family Member 2", editing: false },
            { id: 3, name: "👨‍👩‍👧‍👦 Family Member 3", editing: false },
          ],
        },
        { merge: true }
      );

      await AsyncStorage.setItem("familyId", famId);
      await AsyncStorage.setItem("dogName", dName);
      await AsyncStorage.setItem("dogBreed", dBreed);
      await AsyncStorage.setItem("dogDob", dDob);

      setFamilyId(famId);
      setDogName(dName);
      setDogBreed(dBreed);
      setDogDob(dDob);
      setShowDogInput(false);
      
      showToast("🎉 Training pack created! Welcome to the pack!", "success");
    } catch (e) {
      Alert.alert("🌐 Connection Issue", e.message);
    }
  };

  // Activity toggle with celebration
  const toggleActivity = useCallback((week, activity) => {
    const key = `${week}-${activity}`;
    const wasCompleted = completedActivities.includes(key);
    
    setCompletedActivities((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
    
    if (!wasCompleted) {
      showToast(`🎯 Great job completing: ${activity}!`, "success");
    }
  }, [completedActivities]);

  // Daily activity toggle with celebration ONLY on full day completion
  const toggleDailyActivity = useCallback((timeSlot, activity) => {
    const key = `daily-${timeSlot}-${activity}`;
    const today = getCurrentDate();

    setCompletedDailyByDate((prev) => {
      const prevForToday = prev[today] || [];
      const isCompleted = prevForToday.includes(key);
      const newCompletedToday = isCompleted 
        ? prevForToday.filter((k) => k !== key) 
        : [...prevForToday, key];

      // Only check for full completion when adding a task (not removing)
      if (!isCompleted) {
        const allDailyKeys = Object.entries(dailyRoutine).flatMap(([slot, acts]) =>
          acts.map((activity) => `daily-${slot}-${activity}`)
        );
        
        const wasFullyCompleted = prevForToday.length >= allDailyKeys.length;
        const isNowFullyCompleted = newCompletedToday.length >= allDailyKeys.length;

        // Only celebrate when we just completed ALL daily tasks
        if (isNowFullyCompleted && !wasFullyCompleted) {
          showToast("🎉 Pawsome! All daily training completed! Your pup earned extra treats! 🦴", "success");
        }
      }

      return {
        ...prev,
        [today]: newCompletedToday,
      };
    });
  }, []);

  // Notes handling with dog theme
  const addNote = useCallback(
    async (date, note) => {
      const updatedNotes = { ...dailyNotes, [date]: note };
      setDailyNotes(updatedNotes);

      if (familyId) {
        try {
          await db.collection("families").doc(familyId).set({ dailyNotes: updatedNotes }, { merge: true });
        } catch (e) {
          console.error("Failed to save daily note:", e);
          showToast("Failed to save note. Check your connection! 📶", "error");
        }
      }
    },
    [dailyNotes, familyId]
  );

  const handleAddSharedNote = async () => {
    const trimmed = newSharedNote.trim();
    if (!trimmed) return;

    const author = currentUserName || (family && family.length > 0 ? family[0].name : "🐕 Anonymous Trainer");

    const noteObj = {
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      text: trimmed,
      author,
      timestamp: new Date().toISOString(),
      authorId: currentUserName,
    };

    const updatedNotes = [noteObj, ...(sharedNotes || [])];

    setSharedNotes(updatedNotes);
    setNewSharedNote("");

    try {
      await db.collection("families").doc(familyId).set({ sharedNotes: updatedNotes }, { merge: true });
      showToast("📝 Note shared with your pack!", "success");
    } catch (e) {
      console.error("Failed to save shared note:", e);
      Alert.alert("🐕 Oops!", "Failed to save note. Please try again.");
      setSharedNotes(sharedNotes);
      setNewSharedNote(trimmed);
    }
  };

  const saveNoteEdit = async (noteId) => {
    if (!editingNoteText.trim()) {
      Alert.alert("🐕 Empty Note", "Note cannot be empty!");
      return;
    }

    const updatedNotes = sharedNotes.map((note) =>
      note.id === noteId
        ? {
            ...note,
            text: editingNoteText.trim(),
            edited: true,
            editTimestamp: new Date().toISOString(),
          }
        : note
    );

    setSharedNotes(updatedNotes);
    setEditingNoteId(null);
    setEditingNoteText("");

    try {
      await db.collection("families").doc(familyId).set({ sharedNotes: updatedNotes }, { merge: true });
      showToast("✏️ Note updated!", "success");
    } catch (e) {
      console.error("Failed to update note:", e);
      Alert.alert("🐕 Oops!", "Failed to update the note. Please try again.");
    }
  };

  // Family member management with dog theme
  const handleEditFamilyMember = useCallback(
    (id) => {
      setEditingMemberId(id);
      setEditFamilyName({ ...editFamilyName, [id]: family.find((f) => f.id === id)?.name || "" });
    },
    [editFamilyName, family]
  );

  const handleSaveFamilyMember = useCallback((id, newName) => {
    setFamily((family) =>
      family.map((f) => (f.id === id ? { ...f, name: newName || "🐕 Unnamed Pack Member", editing: false } : f))
    );
    setEditingMemberId(null);
    showToast("👥 Pack member updated!", "success");
  }, []);

  const handleRemoveFamilyMember = useCallback((id) => {
    Alert.alert(
      "🐕 Remove Pack Member?",
      "Are you sure you want to remove this member from your training pack?",
      [
        { text: "❌ Cancel", style: "cancel" },
        {
          text: "🗑️ Remove",
          style: "destructive",
          onPress: () => {
            setFamily((family) => family.filter((f) => f.id !== id));
            showToast("👋 Pack member removed", "info");
          },
        },
      ]
    );
  }, []);

  const handleAddFamilyMember = useCallback(() => {
    if (!newFamilyName.trim()) return;
    const memberName = newFamilyName.trim().startsWith("🐕") || newFamilyName.trim().startsWith("👥") 
      ? newFamilyName.trim() 
      : `👥 ${newFamilyName.trim()}`;
      
    setFamily((family) => [...family, { id: Date.now(), name: memberName, editing: false }]);
    setNewFamilyName("");
    showToast("🎉 New pack member added!", "success");
  }, [newFamilyName]);

  // Dog editing modal with proper error handling
  const openEditDogModal = useCallback(() => {
    try {
      const currentName = dogName || "";
      let currentBreed = "";
      let currentBreedOther = "";

      if (dogBreed) {
        // Safely check if the breed is in common breeds
        const isCommonBreed = commonUKBreeds.some(breed => breed === dogBreed);
        
        if (isCommonBreed) {
          currentBreed = dogBreed;
        } else {
          currentBreed = "Other";
          // Safely extract breed name without emoji prefix
          currentBreedOther = dogBreed.replace(/^[🐕🐕‍🦺🌭💪\u{1F400}-\u{1F9FF}]\s*/u, "").trim();
        }
      }

      const currentDob = dogDob || "";

      setEditDogName(currentName);
      setEditDogBreed(currentBreed);
      setEditDogBreedOther(currentBreedOther);
      setEditDogDob(currentDob);
      setEditDogModal(true);
    } catch (e) {
      console.error("Error opening dog edit modal:", e);
      Alert.alert("🐕 Oops!", "Could not open the edit form. Please try again.");
    }
  }, [dogName, dogBreed, dogDob]);

  const saveDogInfo = async () => {
    try {
      const name = (editDogName || "").trim();
      const dob = (editDogDob || "").trim();
      const breedOther = (editDogBreedOther || "").trim();

      let breedToSave = editDogBreed === "Other" ? breedOther : editDogBreed;

      if (!name || !breedToSave || !dob) {
        Alert.alert("🐕 Missing Info", "All fields are required for your pup!");
        return;
      }

      if (editDogBreed === "Other" && !breedOther) {
        Alert.alert("🐕‍🦺 Breed Required", "Please specify your pup's breed.");
        return;
      }

      if (!isValidDate(dob)) {
        Alert.alert("🎂 Invalid Date", "Please enter a valid birthday in YYYY-MM-DD format.");
        return;
      }

      setDogName(name);
      setDogBreed(breedToSave);
      setDogDob(dob);

      await updateDogInfoStorageAndFirestore(familyId, name, breedToSave, dob);
      setEditDogModal(false);
      showToast("🐕 Pup info updated successfully!", "success");
    } catch (e) {
      console.error("Error saving dog info:", e);
      Alert.alert("🌐 Connection Issue", "Failed to save changes. Please try again.");
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      "🔄 Switch Training Pack?",
      "This will log you out and let you join a different training pack.",
      [
        { text: "❌ Cancel", style: "cancel" },
        {
          text: "🔄 Switch Pack",
          style: "default",
          onPress: async () => {
            setFamilyDogLoading(true);
            await AsyncStorage.removeItem("familyId");
            await AsyncStorage.removeItem("dogName");
            await AsyncStorage.removeItem("dogBreed");
            await AsyncStorage.removeItem("dogDob");
            await AsyncStorage.removeItem("completedDailyByDate");
            setFamilyId(null);
            setDogName(null);
            setDogBreed(null);
            setDogDob(null);
            setInputId("");
            setInputDog("");
            setInputBreed("");
            setInputBreedOther("");
            setInputDob("");
            setShowDogInput(false);
            setFamilyDogLoading(false);
            showToast("👋 Switched to new pack setup!", "info");
          },
        },
      ]
    );
  };

  // Photo handlers with celebration
  const handlePhotoAdded = useCallback((newPhoto) => {
    setProgressPhotos((prev) => [...prev, newPhoto]);
    showToast("📸 Amazing progress photo! Your pup is growing! 🐕", "success");
  }, []);

  // Quick action handlers with dog theme
  const handleQuickAddNote = () => {
    setShowQuickNote(true);
  };

  const handleQuickTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("📸 Camera Permission", "We need camera access to capture your pup's pawsome progress!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      try {
        const imageData = await imageToBase64(result.assets[0].uri);
        
        if (imageData) {
          const newPhoto = {
            uri: result.assets[0].uri,
            base64: imageData.base64,
            type: imageData.type,
            timestamp: new Date().toISOString(),
            week: currentWeek,
          };
          handlePhotoAdded(newPhoto);
        } else {
          showToast("Failed to process photo", "error");
        }
      } catch (error) {
        console.error("Error taking photo:", error);
        showToast("Failed to save photo", "error");
      }
    }
  };

  const handleQuickMarkComplete = () => {
    const today = getCurrentDate();
    const completedToday = completedDailyByDate[today] || [];
    const allDailyKeys = Object.entries(dailyRoutine).flatMap(([slot, acts]) =>
      acts.map((activity) => `daily-${slot}-${activity}`)
    );

    if (completedToday.length >= allDailyKeys.length) {
      showToast("🎉 All daily tasks already completed! Your pup is pawsome! 🐕‍🦺", "success");
    } else {
      const remaining = allDailyKeys.filter((key) => !completedToday.includes(key));
      showToast(`🎯 ${remaining.length} training tasks remaining for today! Keep going! 💪`, "info");
    }
  };

  // Quick note modal handler with celebration
  const handleQuickNoteSubmit = async () => {
    if (!quickNoteText.trim()) return;

    await addNote(selectedDate, quickNoteText.trim());
    setQuickNoteText("");
    setShowQuickNote(false);
    showToast("📝 Training note added! Great job keeping track! 🐕", "success");
  };

  // Calculate all the stats with dog theme messaging
  const today = getCurrentDate();
  const completedToday = completedDailyByDate[today] || [];
  const allDailyKeys = Object.entries(dailyRoutine).flatMap(([slot, acts]) =>
    acts.map((activity) => `daily-${slot}-${activity}`)
  );
  const completedDaily = completedToday.length;
  const dailyRate = allDailyKeys.length > 0 ? completedDaily / allDailyKeys.length : 0;

  const completionRate = (() => {
    const currentWeekActivities = weeklyPlans[currentWeek] || [];
    const completed = currentWeekActivities.filter((act) =>
      completedActivities.includes(`${currentWeek}-${act}`)
    ).length;
    return currentWeekActivities.length ? completed / currentWeekActivities.length : 0;
  })();

  const currentStage = getCurrentStage(currentWeek);
  const { currentStreak, bestStreak } = calculateStreak(completedDailyByDate);

  // Fixed confetti effects with celebration tracking
  useEffect(() => {
    const today = getCurrentDate();
    if (dailyRate === 1 && !celebratedDays.includes(today) && !showDailyConfetti) {
      setShowDailyConfetti(true);
      setCelebratedDays(prev => [...prev, today]);
      showToast("🎉 Daily training complete! Your pup earned extra treats! 🦴", "success");
      setTimeout(() => setShowDailyConfetti(false), 3500);
    }
  }, [dailyRate, showDailyConfetti, celebratedDays]);

  useEffect(() => {
    const currentWeekActivities = weeklyPlans[currentWeek] || [];
    const allDone = currentWeekActivities.every((act) =>
      completedActivities.includes(`${currentWeek}-${act}`)
    );
    const weekKey = `week-${currentWeek}`;
    
    if (allDone && !celebratedWeeks.includes(weekKey) && !showWeeklyConfetti && currentWeekActivities.length > 0) {
      setShowWeeklyConfetti(true);
      setCelebratedWeeks(prev => [...prev, weekKey]);
      showToast("🏆 Week complete! Your pup is ready for the next challenge! 🐕‍🦺", "success");
      setTimeout(() => setShowWeeklyConfetti(false), 3500);
    }
  }, [currentWeek, completedActivities, showWeeklyConfetti, celebratedWeeks]);

  // Loading states with dog theme
  if (familyDogLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ fontSize: 48, marginBottom: 16 }}>🐕</Text>
        <ActivityIndicator size="large" color={dogThemeColors.primary} />
        <Text style={styles.loadingText}>Loading your pup's data...</Text>
      </View>
    );
  }

  // Setup screens with dog theme
  if (!familyId || !dogName || !dogBreed || !dogDob) {
    if (!showDogInput) {
      return (
        <View style={styles.setupContainer}>
          <Text style={{ fontSize: 64, marginBottom: 16 }}>🐾</Text>
          <Text style={styles.welcomeTitle}>Welcome to Puppy Training!</Text>
          <Text style={styles.setupText}>
            🏠 Enter your Family ID to sync training data with your pack.
          </Text>
          <Text style={styles.setupSubtext}>
            👨‍👩‍👧‍👦 Use the same Family ID on all your family's devices. Create a new one or enter an existing ID to join your training pack!
          </Text>
          <TextInput
            placeholder="🏷️ Family ID (e.g. ludo-smiths)"
            value={inputId}
            onChangeText={setInputId}
            style={styles.setupInput}
          />
          <TouchableOpacity onPress={handleFamilyIdSubmit} style={styles.setupButton} activeOpacity={0.8}>
            {checkingFamilyId ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.setupButtonText}>🚀 Let's Start Training!</Text>
            )}
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={styles.setupContainer}>
          <Text style={{ fontSize: 64, marginBottom: 16 }}>🐶</Text>
          <Text style={styles.welcomeTitle}>Create Your Training Pack</Text>
          <Text style={styles.setupText}>🐕 Tell us about your furry friend!</Text>
          <TextInput value={inputId} editable={false} style={[styles.setupInput, styles.disabledInput]} />
          <TextInput
            placeholder="🐕 Dog Name (e.g. Ludo)"
            value={inputDog}
            onChangeText={setInputDog}
            style={styles.setupInput}
          />
          <RNPickerSelect
            onValueChange={(value) => setInputBreed(value)}
            value={inputBreed}
            placeholder={{ label: "🐕 Select Dog Breed...", value: "" }}
            items={[
              ...commonUKBreeds.map((breed) => ({ label: breed, value: breed })),
              { label: "🐕 Other", value: "Other" },
            ]}
            style={{
              inputIOS: styles.pickerInput,
              inputAndroid: styles.pickerInput,
            }}
          />
          {inputBreed === "Other" && (
            <TextInput
              placeholder="✏️ Type breed"
              value={inputBreedOther}
              onChangeText={setInputBreedOther}
              style={styles.setupInput}
            />
          )}
          <TextInput
            placeholder="🎂 Date of Birth (YYYY-MM-DD)"
            value={inputDob}
            onChangeText={setInputDob}
            keyboardType={Platform.OS === "ios" ? "numbers-and-punctuation" : "numeric"}
            style={styles.setupInput}
            ref={dobInputRef}
            maxLength={10}
          />
          <TouchableOpacity onPress={handleDogDetailsSubmit} style={styles.setupButton} activeOpacity={0.8}>
            <Text style={styles.setupButtonText}>🎉 Create Training Pack</Text>
          </TouchableOpacity>
        </View>
      );
    }
  }

  // ========== MAIN APP CONTENT ==========
  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.mainContent}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {isOffline && (
            <View style={styles.offlineBanner}>
              <Text style={{ fontSize: 20, marginRight: 8 }}>📶</Text>
              <Text style={styles.offlineText}>You're offline. Changes will sync when back online! 🐕</Text>
            </View>
          )}

          {showDailyConfetti && (
            <ConfettiCannon count={200} origin={{ x: -10, y: 0 }} fallSpeed={2000} fadeOut autoStart />
          )}
          {showWeeklyConfetti && (
            <ConfettiCannon count={300} origin={{ x: -10, y: 0 }} fallSpeed={2500} fadeOut autoStart />
          )}

          {/* ENHANCED Header with complete dog theme */}
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

          {/* Enhanced Navigation with Dog Theme */}
          <View style={styles.enhancedNavigationContainer}>
            {navigationTabs.map((tab) => {
              const isActive = viewMode === tab.key;
              
              const renderIcon = () => {
                const iconColor = isActive ? dogThemeColors.light : dogThemeColors.mediumText;
                
                if (tab.iconLib === "custom" && tab.CustomIcon) {
                  return <tab.CustomIcon size={22} color={iconColor} />;
                } else {
                  const IconComponent = tab.iconLib;
                  return (
                    <IconComponent 
                      name={tab.iconName} 
                      size={22} 
                      color={iconColor} 
                    />
                  );
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

          {/* Main content by viewMode with Dog Theme */}
          {viewMode === "daily" && (
            <DailyScreen
              dailyRate={dailyRate}
              completedDailyByDate={completedDailyByDate}
              toggleDailyActivity={toggleDailyActivity}
              currentWeek={currentWeek}
              weeklyPlans={weeklyPlans}
              completedActivities={completedActivities}
              toggleActivity={toggleActivity}
              selectedDate={selectedDate}
              dailyNotes={dailyNotes}
              addNote={addNote}
              dogBreed={dogBreed}
              completionRate={completionRate}
              currentStreak={currentStreak}
              bestStreak={bestStreak}
            />
          )}

          {viewMode === "weekly" && (
            <WeeklyScreen
              currentWeek={currentWeek}
              setCurrentWeek={setCurrentWeek}
              completionRate={completionRate}
              completedActivities={completedActivities}
              toggleActivity={toggleActivity}
              progressPhotos={progressPhotos}
              handlePhotoAdded={handlePhotoAdded}
            />
          )}

          {viewMode === "progress" && (
            <ProgressScreen
              currentWeek={currentWeek}
              completionRate={completionRate}
              dailyRate={dailyRate}
              completedDailyByDate={completedDailyByDate}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              calendarNotes={calendarNotes}
              handleOpenNoteModal={handleOpenNoteModal}
              visibleNotes={visibleNotes}
              setVisibleNotes={setVisibleNotes}
              completedActivities={completedActivities}
            />
          )}

          {viewMode === "notes" && (
            <NotesScreen
              newSharedNote={newSharedNote}
              setNewSharedNote={setNewSharedNote}
              handleAddSharedNote={handleAddSharedNote}
              sharedNotes={sharedNotes}
              notesLoading={notesLoading}
              editingNoteId={editingNoteId}
              setEditingNoteId={setEditingNoteId}
              editingNoteText={editingNoteText}
              setEditingNoteText={setEditingNoteText}
              saveNoteEdit={saveNoteEdit}
              currentUserName={currentUserName}
            />
          )}

          {viewMode === "achievements" && (
            <AchievementsScreen
              unlockedAchievements={unlockedAchievements}
              currentStreak={currentStreak}
              bestStreak={bestStreak}
            />
          )}

          {viewMode === "family" && (
            <FamilyScreen
              family={family}
              editingMemberId={editingMemberId}
              editFamilyName={editFamilyName}
              setEditFamilyName={setEditFamilyName}
              handleEditFamilyMember={handleEditFamilyMember}
              handleSaveFamilyMember={handleSaveFamilyMember}
              handleRemoveFamilyMember={handleRemoveFamilyMember}
              newFamilyName={newFamilyName}
              setNewFamilyName={setNewFamilyName}
              handleAddFamilyMember={handleAddFamilyMember}
              setEditingMemberId={setEditingMemberId}
            />
          )}
        </ScrollView>

        {/* Quick Actions Floating Button with Dog Theme */}
        <QuickActions onAddNote={handleQuickAddNote} onTakePhoto={handleQuickTakePhoto} onMarkComplete={handleQuickMarkComplete} />

        {/* Sync indicator with Dog Theme */}
        {syncing && (
          <View style={styles.syncIndicator}>
            <Text style={{ fontSize: 16, marginRight: 6 }}>🔄</Text>
            <Text style={styles.syncText}>Syncing with pack...</Text>
          </View>
        )}
      </View>

      {/* Dog edit modal with theme */}
      <Modal visible={editDogModal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.enhancedModalContainer}>
          <View style={styles.enhancedModalHeader}>
            <TouchableOpacity onPress={() => setEditDogModal(false)}>
              <Text style={{ fontSize: 20 }}>❌</Text>
            </TouchableOpacity>
            <Text style={styles.enhancedModalTitle}>🐕 Edit Pup Info</Text>
            <TouchableOpacity onPress={saveDogInfo}>
              <Text style={styles.enhancedModalSave}>💾 Save</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.enhancedModalContent}>
            <View style={styles.enhancedModalSection}>
              <Text style={styles.enhancedModalLabel}>🐕 Dog Name</Text>
              <TextInput
                style={styles.enhancedModalInput}
                value={editDogName}
                onChangeText={setEditDogName}
                placeholder="Dog Name"
              />
            </View>
            <View style={styles.enhancedModalSection}>
              <Text style={styles.enhancedModalLabel}>🐕‍🦺 Breed</Text>
              <RNPickerSelect
                onValueChange={(value) => setEditDogBreed(value)}
                value={editDogBreed}
                placeholder={{ label: "🐕 Select Dog Breed...", value: "" }}
                items={[
                  ...commonUKBreeds.map((breed) => ({ label: breed, value: breed })),
                  { label: "🐕 Other", value: "Other" },
                ]}
                style={{
                  inputIOS: styles.enhancedModalPickerInput,
                  inputAndroid: styles.enhancedModalPickerInput,
                }}
              />
              {editDogBreed === "Other" && (
                <TextInput
                  style={[styles.enhancedModalInput, styles.modalInputMarginTop]}
                  value={editDogBreedOther}
                  onChangeText={setEditDogBreedOther}
                  placeholder="✏️ Specify breed"
                />
              )}
            </View>
            <View style={styles.enhancedModalSection}>
              <Text style={styles.enhancedModalLabel}>🎂 Date of Birth (YYYY-MM-DD)</Text>
              <TextInput
                style={styles.enhancedModalInput}
                value={editDogDob}
                onChangeText={setEditDogDob}
                placeholder="YYYY-MM-DD"
                keyboardType={Platform.OS === "ios" ? "numbers-and-punctuation" : "numeric"}
                maxLength={10}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Quick Note Modal with Dog Theme */}
      <Modal visible={showQuickNote} animationType="slide" transparent={true}>
        <View style={styles.quickNoteOverlay}>
          <View style={styles.enhancedQuickNoteModal}>
            <View style={styles.quickNoteHeader}>
              <Text style={styles.enhancedQuickNoteTitle}>📝 Quick Training Note</Text>
              <TouchableOpacity onPress={() => setShowQuickNote(false)}>
                <Text style={{ fontSize: 18 }}>❌</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.enhancedQuickNoteInput}
              placeholder="🐕 Add a quick training note..."
              value={quickNoteText}
              onChangeText={setQuickNoteText}
              multiline
              numberOfLines={4}
              autoFocus
            />
            <View style={styles.quickNoteActions}>
              <TouchableOpacity style={styles.enhancedQuickNoteCancel} onPress={() => setShowQuickNote(false)}>
                <Text style={styles.quickNoteCancelText}>❌ Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.enhancedQuickNoteSave} onPress={handleQuickNoteSubmit}>
                <Text style={styles.enhancedQuickNoteSaveText}>💾 Save Note</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Calendar Note Modal with Dog Theme */}
      <Modal visible={showNoteModal} transparent animationType="fade">
        <View style={styles.noteModalOverlay}>
          <View style={styles.noteModalContainer}>
            <Text style={styles.noteModalTitle}>
              📝 Add note for {currentNoteDate}
            </Text>
            <TextInput
              value={noteInputText}
              onChangeText={setNoteInputText}
              placeholder="🐕 Training note..."
              style={styles.noteModalInput}
              multiline
            />
            <View style={styles.noteModalActions}>
              <TouchableOpacity
                onPress={() => { setShowNoteModal(false); Keyboard.dismiss(); }}
                style={styles.noteModalCancel}
              >
                <Text style={styles.noteModalCancelText}>❌ Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSaveNote}
                style={styles.noteModalSave}
              >
                <Text style={styles.noteModalSaveText}>💾 Save Note</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

export default MainNavigator;