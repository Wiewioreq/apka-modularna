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
      d="M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1-2-2z"
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

// ========== MAIN APP COMPONENT ==========
function MainNavigator() {
  // Skip first weekly celebration on mount
  const isFirstWeeklyRun = useRef(true);

  const [isOffline, setIsOffline] = useState(false);

  // Core state
  const [familyId, setFamilyId] = useState<string | null>(null);
  const [dogName, setDogName] = useState<string | null>(null);
  const [dogBreed, setDogBreed] = useState<string | null>(null);
  const [dogDob, setDogDob] = useState<string | null>(null);

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
  const [currentWeek, setCurrentWeek] = useState<number>(1);
  const [completedActivities, setCompletedActivities] = useState<string[]>([]);
  const [dailyNotes, setDailyNotes] = useState<Record<string, string>>({});
  const [viewMode, setViewMode] = useState<"daily" | "weekly" | "progress" | "notes" | "achievements" | "family">("daily");
  const [selectedDate, setSelectedDate] = useState(() => getCurrentDate());
  const [completedDailyByDate, setCompletedDailyByDate] = useState<Record<string, string[]>>({});

  // New feature states
  const [progressPhotos, setProgressPhotos] = useState<any[]>([]);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [quickNoteText, setQuickNoteText] = useState("");
  const [showQuickNote, setShowQuickNote] = useState(false);

  // Calendar notes feature states
  const [calendarNotes, setCalendarNotes] = useState<Record<string, { text: string; savedAt: number }>>({});
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [currentNoteDate, setCurrentNoteDate] = useState<string | null>(null);
  const [noteInputText, setNoteInputText] = useState("");
  const [visibleNotes, setVisibleNotes] = useState<Record<string, boolean>>({});

  // Family and notes states
  const [family, setFamily] = useState<Array<{ id: number; name: string; editing: boolean }>>([
    { id: 1, name: "🏆 Primary Trainer", editing: false },
    { id: 2, name: "👨‍👩‍👧‍👦 Family Member 2", editing: false },
    { id: 3, name: "👨‍👩‍👧‍👦 Family Member 3", editing: false },
  ]);
  const [newFamilyName, setNewFamilyName] = useState("");
  const [editFamilyName, setEditFamilyName] = useState<Record<number, string>>({});
  const [editingMemberId, setEditingMemberId] = useState<number | null>(null);

  const [sharedNotes, setSharedNotes] = useState<any[]>([]);
  const [newSharedNote, setNewSharedNote] = useState("");
  const [notesLoading, setNotesLoading] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingNoteText, setEditingNoteText] = useState("");
  const [currentUserName, setCurrentUserName] = useState("🐕 Wiewioreq");

  // Celebration states
  const [showDailyConfetti, setShowDailyConfetti] = useState(false);
  const [showWeeklyConfetti, setShowWeeklyConfetti] = useState(false);
  const [currentDogAge, setCurrentDogAge] = useState(() => calcDogAge(dogDob, 0, new Date()));

  // Refs for cleanup and optimization
  const syncTimeout = useRef<NodeJS.Timeout>();
  const lastSyncedData = useRef<any>({});
  const dobInputRef = useRef<any>(null);

  // Celebration trackers
  const [celebratedWeeks, setCelebratedWeeks] = useState<string[]>([]);
  const [celebratedDays, setCelebratedDays] = useState<string[]>([]);

  // Navigation tabs
  const navigationTabs = [
    { key: "daily", iconLib: "custom", iconName: "home", CustomIcon: DogHouseIcon, label: "🏠 Home" },
    { key: "weekly", iconLib: "custom", iconName: "calendar", CustomIcon: CalendarPawIcon, label: "📅 Weekly" },
    { key: "progress", iconLib: "custom", iconName: "paw", CustomIcon: PawIcon, label: "📈 Progress" },
    { key: "notes", iconLib: "custom", iconName: "notes", CustomIcon: NotesBoneIcon, label: "📝 Notes" },
    { key: "achievements", iconLib: "custom", iconName: "trophy", CustomIcon: TrophyIcon, label: "🏆 Awards" },
    { key: "family", iconLib: "custom", iconName: "family", CustomIcon: DogFamilyIcon, label: "👨‍👩‍👧‍👦 Pack" }
  ];

  // Auto-delete old calendar notes
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

  // Note modal
  const handleOpenNoteModal = useCallback((date: string, text = "") => {
    setCurrentNoteDate(date);
    setNoteInputText(text);
    setShowNoteModal(true);
  }, []);

  const handleSaveNote = async () => {
    if (noteInputText.trim()) {
      const newNotes = {
        ...calendarNotes,
        [currentNoteDate!]: { text: noteInputText.trim(), savedAt: Date.now() }
      };
      setCalendarNotes(newNotes);
      setShowNoteModal(false);
      setVisibleNotes(prev => ({ ...prev, [currentNoteDate!]: true }));
      if (familyId) {
        await db.collection("families").doc(familyId).set({ calendarNotes: newNotes }, { merge: true });
      }
    } else {
      setShowNoteModal(false);
    }
    Keyboard.dismiss();
  };

  // Notifications
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
        trigger: { hour: 8, minute: 0, repeats: true },
      });
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `🌙 Evening training time!`,
          body: `Don't forget ${dogName}'s evening practice! 🎾`,
          sound: true,
        },
        trigger: { hour: 18, minute: 0, repeats: true },
      });
    };
    if (dogName) setupNotifications();
  }, [dogName]);

  // Network status
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => setIsOffline(!state.isConnected));
    NetInfo.fetch().then(state => setIsOffline(!state.isConnected));
    return () => unsubscribe();
  }, []);

  // Cleanup timeouts
  useEffect(() => () => {
    if (syncTimeout.current) clearTimeout(syncTimeout.current);
  }, []);

  // Initial data load
  useEffect(() => {
    (async () => {
      try {
        const id = await AsyncStorage.getItem("familyId");
        const dog = await AsyncStorage.getItem("dogName");
        const breed = await AsyncStorage.getItem("dogBreed");
        const dob = await AsyncStorage.getItem("dogDob");
        const username = await AsyncStorage.getItem("memberName");
        const photos = await AsyncStorage.getItem("progressPhotos");
        const ach = await AsyncStorage.getItem("unlockedAchievements");
        if (id) setFamilyId(id);
        if (dog) setDogName(dog);
        if (breed) setDogBreed(breed);
        if (dob) setDogDob(dob);
        if (username) setCurrentUserName(username);
        if (photos) setProgressPhotos(JSON.parse(photos));
        if (ach) setUnlockedAchievements(JSON.parse(ach));
      } catch (e) {
        console.error("Error loading app data:", e);
      }
      try {
        const cdbd = await AsyncStorage.getItem("completedDailyByDate");
        if (cdbd) setCompletedDailyByDate(JSON.parse(cdbd));
      } catch (e) {
        console.error("Failed to parse completedDailyByDate:", e);
      } finally {
        setFamilyDogLoading(false);
      }
    })();
  }, []);

  // Persist user name
  useEffect(() => {
    if (currentUserName) AsyncStorage.setItem("memberName", currentUserName);
  }, [currentUserName]);

  // Persist photos & achievements
  useEffect(() => {
    AsyncStorage.setItem("progressPhotos", JSON.stringify(progressPhotos));
  }, [progressPhotos]);
  useEffect(() => {
    AsyncStorage.setItem("unlockedAchievements", JSON.stringify(unlockedAchievements));
  }, [unlockedAchievements]);

  // Force sync
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
      const docSnap = await db.collection("families").doc(familyId).get();
      if (docSnap.exists) {
        const data = docSnap.data()!;
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
      await AsyncStorage.setItem("completedDailyByDate", JSON.stringify(completedDailyByDate));
    } catch (e: any) {
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

  // Optimized sync
  const syncToFirebase = useCallback(async (data: any) => {
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
  }, [familyId, isOffline, manualSyncRequested]);

  // Debounced auto-sync
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
    if (syncTimeout.current) clearTimeout(syncTimeout.current);
    syncTimeout.current = setTimeout(() => {
      syncToFirebase(dataToSync);
      AsyncStorage.setItem("completedDailyByDate", JSON.stringify(completedDailyByDate)).catch(e =>
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
    manualSyncRequested
  ]);

  // Firestore real-time listener
  useEffect(() => {
    if (!familyId) return;
    setLoading(true);
    setNotesLoading(true);
    const unsubscribe = db
      .collection("families")
      .doc(familyId)
      .onSnapshot(
        docSnap => {
          if (docSnap.exists) {
            const data = docSnap.data()!;
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
              AsyncStorage.setItem("completedDailyByDate", JSON.stringify(data.completedDailyByDate)).catch(e =>
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
        err => {
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

  // Dog age updates
  useEffect(() => {
    if (!dogDob) return;
    const interval = setInterval(() => {
      setCurrentDogAge(calcDogAge(dogDob, 0, new Date()));
    }, 60 * 1000);
    setCurrentDogAge(calcDogAge(dogDob, 0, new Date()));
    return () => clearInterval(interval);
  }, [dogDob]);

  // Achievement checks
  useEffect(() => {
    const checkAchievements = () => {
      const newAchievements: string[] = [];
      const { currentStreak } = calculateStreak(completedDailyByDate);
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
      const todayIso = new Date().toISOString().slice(0, 10);
      const completedToday = completedDailyByDate[todayIso] || [];
      const allDailyKeys = Object.entries(dailyRoutine).flatMap(([slot, acts]) =>
        acts.map(activity => `daily-${slot}-${activity}`)
      );
      if (completedToday.length >= allDailyKeys.length && !unlockedAchievements.includes("all_daily")) {
        newAchievements.push("all_daily");
      }
      const weekActs = weeklyPlans[currentWeek] || [];
      const weekCompleted = weekActs.filter(act => completedActivities.includes(`${currentWeek}-${act}`));
      if (
        weekCompleted.length === weekActs.length &&
        weekActs.length > 0 &&
        !unlockedAchievements.includes("week_perfect")
      ) {
        newAchievements.push("week_perfect");
      }
      if (newAchievements.length > 0) {
        setUnlockedAchievements(prev => [...prev, ...newAchievements]);
        newAchievements.forEach(id => {
          const ach = achievements.find(a => a.id === id);
          if (ach) showToast(`🏆 Achievement Unlocked: ${ach.title} 🐕`, "success");
        });
      }
    };
    checkAchievements();
  }, [currentWeek, completedActivities, completedDailyByDate, progressPhotos, unlockedAchievements]);

  // Daily confetti effect
  useEffect(() => {
    const today = getCurrentDate();
    const completedTodayCount = (completedDailyByDate[today] || []).length;
    const allDailyKeys = Object.entries(dailyRoutine).flatMap(([slot, acts]) =>
      acts.map(act => `daily-${slot}-${act}`)
    );
    const dailyRate = allDailyKeys.length ? completedTodayCount / allDailyKeys.length : 0;
    if (dailyRate === 1 && !celebratedDays.includes(today) && !showDailyConfetti) {
      setShowDailyConfetti(true);
      setCelebratedDays(prev => [...prev, today]);
      showToast("🎉 Daily training complete! Your pup earned extra treats! 🦴", "success");
      setTimeout(() => setShowDailyConfetti(false), 3500);
    }
  }, [completedDailyByDate, celebratedDays, showDailyConfetti]);

  // Weekly confetti effect (skip first mount)
  useEffect(() => {
    const weekActs = weeklyPlans[currentWeek] || [];
    const allDone = weekActs.every(act => completedActivities.includes(`${currentWeek}-${act}`));
    const weekKey = `week-${currentWeek}`;
    if (isFirstWeeklyRun.current) {
      isFirstWeeklyRun.current = false;
      return;
    }
    if (allDone && !celebratedWeeks.includes(weekKey) && !showWeeklyConfetti && weekActs.length > 0) {
      setShowWeeklyConfetti(true);
      setCelebratedWeeks(prev => [...prev, weekKey]);
      showToast("🏆 Week complete! Your pup is ready for the next challenge! 🐕‍🦺", "success");
      setTimeout(() => setShowWeeklyConfetti(false), 3500);
    }
  }, [currentWeek, completedActivities, showWeeklyConfetti, celebratedWeeks]);

  // Handlers: handleFamilyIdSubmit, handleDogDetailsSubmit, toggleActivity, toggleDailyActivity,
  // addNote, handleAddSharedNote, saveNoteEdit, handleEditFamilyMember, handleSaveFamilyMember,
  // handleRemoveFamilyMember, handleAddFamilyMember, openEditDogModal, saveDogInfo, handleLogout,
  // handlePhotoAdded, handleQuickAddNote, handleQuickTakePhoto, handleQuickMarkComplete,
  // handleQuickNoteSubmit
  // ... (identical to prior definitions) ...

  // Loading & setup screens
  if (familyDogLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ fontSize: 48, marginBottom: 16 }}>🐕</Text>
        <ActivityIndicator size="large" color={dogThemeColors.primary} />
        <Text style={styles.loadingText}>Loading your pup's data...</Text>
      </View>
    );
  }

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
            onValueChange={setInputBreed}
            value={inputBreed}
            placeholder={{ label: "🐕 Select Dog Breed...", value: "" }}
            items={[
              ...commonUKBreeds.map(b => ({ label: b, value: b })),
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

  // ========== MAIN APP RENDER ==========
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
          {showDailyConfetti && <ConfettiCannon count={200} origin={{ x: -10, y: 0 }} fallSpeed={2000} fadeOut autoStart />}
          {showWeeklyConfetti && <ConfettiCannon count={300} origin={{ x: -10, y: 0 }} fallSpeed={2500} fadeOut autoStart />}

          {/* Header */}
          <View style={styles.enhancedHeaderContainer}>
            <View style={styles.headerTop}>
              <View style={styles.dogInfoContainer}>
                <DogAvatar dogName={dogName!} dogBreed={dogBreed!} />
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

          {/* Navigation */}
          <View style={styles.enhancedNavigationContainer}>
            {navigationTabs.map(tab => {
              const isActive = viewMode === tab.key;
              const iconColor = isActive ? dogThemeColors.light : dogThemeColors.mediumText;
              const renderIcon = () =>
                tab.iconLib === "custom" && tab.CustomIcon
                  ? <tab.CustomIcon size={22} color={iconColor} />
                  : React.createElement(tab.iconLib === "Feather" ? Feather : MaterialCommunityIcons, {
                      name: tab.iconName,
                      size: 22,
                      color: iconColor,
                    });

              return (
                <TouchableOpacity
                  key={tab.key}
                  style={[styles.navTab, isActive && styles.enhancedNavTabActive]}
                  onPress={() => setViewMode(tab.key)}
                  activeOpacity={0.7}
                >
                  {renderIcon()}
                  <Text style={[styles.navTabText, { color: iconColor }]}>{tab.label}</Text>
                  {isActive && <View style={styles.activeTabIndicator} />}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Screens */}
          {viewMode === "daily" && (
            <DailyScreen
              dailyRate={(completedDailyByDate[getCurrentDate()] || []).length /
                Object.entries(dailyRoutine).flatMap(([slot, acts]) =>
                  acts.map(activity => `daily-${slot}-${activity}`)
                ).length}
              completedDailyByDate={completedDailyByDate}
              toggleDailyActivity={toggleDailyActivity}
              currentWeek={currentWeek}
              weeklyPlans={weeklyPlans}
              completedActivities={completedActivities}
              toggleActivity={toggleActivity}
              selectedDate={selectedDate}
              dailyNotes={dailyNotes}
              addNote={addNote}
              dogBreed={dogBreed!}
              completionRate={
                weeklyPlans[currentWeek]
                  ? weeklyPlans[currentWeek].filter(act =>
                      completedActivities.includes(`${currentWeek}-${act}`)
                    ).length / weeklyPlans[currentWeek].length
                  : 0
              }
              currentStreak={calculateStreak(completedDailyByDate).currentStreak}
              bestStreak={calculateStreak(completedDailyByDate).bestStreak}
            />
          )}
          {viewMode === "weekly" && (
            <WeeklyScreen
              currentWeek={currentWeek}
              setCurrentWeek={setCurrentWeek}
              completionRate={
                weeklyPlans[currentWeek]
                  ? weeklyPlans[currentWeek].filter(act =>
                      completedActivities.includes(`${currentWeek}-${act}`)
                    ).length / weeklyPlans[currentWeek].length
                  : 0
              }
              completedActivities={completedActivities}
              toggleActivity={toggleActivity}
              progressPhotos={progressPhotos}
              handlePhotoAdded={handlePhotoAdded}
            />
          )}
          {viewMode === "progress" && (
            <ProgressScreen
              currentWeek={currentWeek}
              completionRate={
                weeklyPlans[currentWeek]
                  ? weeklyPlans[currentWeek].filter(act =>
                      completedActivities.includes(`${currentWeek}-${act}`)
                    ).length / weeklyPlans[currentWeek].length
                  : 0
              }
              dailyRate={(completedDailyByDate[getCurrentDate()] || []).length /
                Object.entries(dailyRoutine).flatMap(([slot, acts]) =>
                  acts.map(activity => `daily-${slot}-${activity}`)
                ).length}
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
              currentStreak={calculateStreak(completedDailyByDate).currentStreak}
              bestStreak={calculateStreak(completedDailyByDate).bestStreak}
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

        {/* Quick Actions */}
        <QuickActions
          onAddNote={handleQuickAddNote}
          onTakePhoto={handleQuickTakePhoto}
          onMarkComplete={handleQuickMarkComplete}
        />

        {/* Sync indicator */}
        {syncing && (
          <View style={styles.syncIndicator}>
            <Text style={{ fontSize: 16, marginRight: 6 }}>🔄</Text>
            <Text style={styles.syncText}>Syncing with pack...</Text>
          </View>
        )}
      </View>

      {/* Edit Dog Modal */}
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
                onValueChange={setEditDogBreed}
                value={editDogBreed}
                placeholder={{ label: "🐕 Select Dog Breed...", value: "" }}
                items={[
                  ...commonUKBreeds.map(b => ({ label: b, value: b })),
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

      {/* Quick Note Modal */}
      <Modal visible={showQuickNote} animationType="slide" transparent>
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

      {/* Calendar Note Modal */}
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
              <TouchableOpacity onPress={handleSaveNote} style={styles.noteModalSave}>
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