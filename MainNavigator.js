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
  Keyboard,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import ConfettiCannon from "react-native-confetti-cannon";
import NetInfo from "@react-native-community/netinfo";
import { SafeAreaView } from "react-native-safe-area-context";
import RNPickerSelect from "react-native-picker-select";
import * as Notifications from "expo-notifications";
import * as ImagePicker from "expo-image-picker";
import Svg, { Circle, Path } from "react-native-svg";
import { storage, db } from "./src/firebase/config";
import { v4 as uuidv4 } from "uuid";

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
  weeklyPlans,
  dailyRoutine,
  achievements,
  commonUKBreeds,
} from "./src/constants";
import { getCurrentDate, getCurrentTime, isValidDate } from "./src/utils/date";
import { deepEqual } from "./src/utils/deepEqual";
import {
  getCurrentStage,
  calcDogAge,
  calculateStreak,
  showToast,
} from "./src/utils/helpers";
import { styles } from "./src/styles/styles";

// ========== CONSTANTS ==========
const APP_VERSION = "2.0.0 - Puppy Edition";
const BUILD_DATE = "2025-06-16";

// ========== CUSTOM ICONS ==========
const DogHouseIcon = ({ size = 22, color = "#000" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M2 12l10-8 10 8v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8z"
      stroke={color}
      strokeWidth="2.5"
      fill="none"
    />
    <Circle cx="12" cy="16" r="1.5" fill={color} />
    <Path d="M8 12h8" stroke={color} strokeWidth="2" strokeLinecap="round" />
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
    <Path d="M12 15v6M8 21h8" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <Circle cx="12" cy="9" r="1" fill={color} />
  </Svg>
);
const DogFamilyIcon = ({ size = 22, color = "#000" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="8" r="3.5" stroke={color} strokeWidth="2.5" fill="none" />
    <Path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke={color} strokeWidth="2.5" />
    <Path d="M9 5l-1.5-2.5M15 5l1.5-2.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Circle cx="5" cy="10" r="2.5" stroke={color} strokeWidth="2" fill="none" />
    <Circle cx="19" cy="10" r="2.5" stroke={color} strokeWidth="2" fill="none" />
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
    <Path d="M8 8h8M8 12h6M8 16h4" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path
      d="M16 14h2a1 1 0 1 1 0 2h-2a1 1 0 1 1 0-2z"
      stroke={color}
      strokeWidth="1.5"
      fill={color}
      fillOpacity="0.3"
    />
  </Svg>
);

// Helper: update dog info in AsyncStorage + Firestore
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

export default function MainNavigator() {
  // Connectivity
  const [isOffline, setIsOffline] = useState(false);

  // Core state
  const [familyId, setFamilyId] = useState(null);
  const [dogName, setDogName] = useState(null);
  const [dogBreed, setDogBreed] = useState(null);
  const [dogDob, setDogDob] = useState(null);

  // Setup inputs
  const [inputId, setInputId] = useState("");
  const [inputDog, setInputDog] = useState("");
  const [inputBreed, setInputBreed] = useState("");
  const [inputBreedOther, setInputBreedOther] = useState("");
  const [inputDob, setInputDob] = useState("");

  // UI/loading flags
  const [showDogInput, setShowDogInput] = useState(false);
  const [familyDogLoading, setFamilyDogLoading] = useState(true);
  const [checkingFamilyId, setCheckingFamilyId] = useState(false);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [manualSyncRequested, setManualSyncRequested] = useState(false);

  // Edit pup modal
  const [editDogModal, setEditDogModal] = useState(false);
  const [editDogName, setEditDogName] = useState("");
  const [editDogBreed, setEditDogBreed] = useState("");
  const [editDogBreedOther, setEditDogBreedOther] = useState("");
  const [editDogDob, setEditDogDob] = useState("");

  // Training data
  const [currentWeek, setCurrentWeek] = useState(1);
  const [completedActivities, setCompletedActivities] = useState([]);
  const [dailyNotes, setDailyNotes] = useState({});
  const [viewMode, setViewMode] = useState("daily");
  const [selectedDate, setSelectedDate] = useState(() => getCurrentDate());
  const [completedDailyByDate, setCompletedDailyByDate] = useState({});

  // Photos & Achievements
  const [progressPhotos, setProgressPhotos] = useState([]);
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [quickNoteText, setQuickNoteText] = useState("");
  const [showQuickNote, setShowQuickNote] = useState(false);

  // Calendar notes
  const [calendarNotes, setCalendarNotes] = useState({});
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [currentNoteDate, setCurrentNoteDate] = useState(null);
  const [noteInputText, setNoteInputText] = useState("");
  const [visibleNotes, setVisibleNotes] = useState({});

  // Family & shared notes
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
  const [currentUserName, setCurrentUserName] = useState(() =>
    "🐕 " + (AsyncStorage.getItem("memberName") || "Trainer")
  );

  // Celebrations & age
  const [showDailyConfetti, setShowDailyConfetti] = useState(false);
  const [showWeeklyConfetti, setShowWeeklyConfetti] = useState(false);
  const [currentDogAge, setCurrentDogAge] = useState(() =>
    calcDogAge(dogDob, 0, new Date())
  );

  // Refs
  const syncTimeout = useRef();
  const lastSyncedData = useRef({});

  // ========== PHOTO HANDLERS ==========
  const handlePhotoAdded = useCallback((newPhoto) => {
    setProgressPhotos((prev) => [...prev, newPhoto]);
    showToast("📸 Amazing progress photo! Your pup is growing! 🐕", "success");
  }, []);

  const handleQuickTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      return Alert.alert(
        "📸 Camera Permission",
        "We need camera access to capture your pup's progress!"
      );
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.6,
    });
    if (result.canceled) return;

    try {
      const asset = result.assets[0];
      const resp = await fetch(asset.uri);
      const blob = await resp.blob();
      const ext = asset.uri.split(".").pop() || "jpg";
      const filename = `photos/${familyId}/${uuidv4()}.${ext}`;
      const ref = storage.ref().child(filename);
      const snap = await ref.put(blob);
      const downloadURL = await snap.ref.getDownloadURL();

      const newPhoto = {
        url: downloadURL,
        timestamp: new Date().toISOString(),
        week: currentWeek,
      };
      handlePhotoAdded(newPhoto);
    } catch (error) {
      console.error("Error taking/uploading photo:", error);
      showToast("Failed to save photo", "error");
    }
  };

  // ========== FIRESTORE SYNC ==========
  const forceSyncToFirebase = useCallback(async () => {
    if (!familyId) {
      showToast("🏠 No family pack set", "error");
      return;
    }
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
    try {
      await db.collection("families").doc(familyId).set(dataToSync, { merge: true });
      lastSyncedData.current = { ...dataToSync };
      showToast("🔄 Pack data synced successfully!", "success");
    } catch (err) {
      console.error("Failed to force sync:", err);
      showToast("🌐 Sync failed: " + err.message, "error");
    } finally {
      setSyncing(false);
      setManualSyncRequested(false);
      AsyncStorage.setItem("completedDailyByDate", JSON.stringify(completedDailyByDate)).catch(() => {});
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
    calendarNotes,
  ]);

  // Optimized auto-sync
  const syncToFirebase = useCallback(
    async (data) => {
      if (!familyId) return;
      if (deepEqual(lastSyncedData.current, data) && !manualSyncRequested) return;

      try {
        setSyncing(true);
        await db.collection("families").doc(familyId).set(data, { merge: true });
        lastSyncedData.current = { ...data };
      } catch (e) {
        console.error("Failed to sync to Firebase:", e);
        if (!isOffline) {
          Alert.alert("🌐 Sync Error", "Check your connection!");
        }
      } finally {
        setSyncing(false);
        setManualSyncRequested(false);
      }
    },
    [familyId, isOffline, manualSyncRequested]
  );

  // Debounced auto-sync effect
  useEffect(() => {
    if (loading || !familyId) return;
    const data = {
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
      syncToFirebase(data);
      AsyncStorage.setItem("completedDailyByDate", JSON.stringify(completedDailyByDate)).catch(() => {});
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

  // Real-time listener
  useEffect(() => {
    if (!familyId) return;
    setLoading(true);
    const unsubscribe = db
      .collection("families")
      .doc(familyId)
      .onSnapshot(
        (docSnap) => {
          if (docSnap.exists) {
            const data = docSnap.data();
            if (data.currentWeek !== undefined && data.currentWeek !== currentWeek)
              setCurrentWeek(data.currentWeek);
            if (data.completedActivities && !deepEqual(data.completedActivities, completedActivities))
              setCompletedActivities(data.completedActivities);
            if (data.dailyNotes && !deepEqual(data.dailyNotes, dailyNotes))
              setDailyNotes(data.dailyNotes);
            if (data.family && !deepEqual(data.family, family)) setFamily(data.family);
            if (data.sharedNotes && !deepEqual(data.sharedNotes, sharedNotes))
              setSharedNotes(data.sharedNotes);
            if (data.dogName && data.dogName !== dogName) setDogName(data.dogName);
            if (data.dogBreed && data.dogBreed !== dogBreed) setDogBreed(data.dogBreed);
            if (data.dogDob && data.dogDob !== dogDob) setDogDob(data.dogDob);
            if (data.completedDailyByDate && !deepEqual(data.completedDailyByDate, completedDailyByDate))
              setCompletedDailyByDate(data.completedDailyByDate);
            if (data.progressPhotos && !deepEqual(data.progressPhotos, progressPhotos))
              setProgressPhotos(data.progressPhotos);
            if (data.unlockedAchievements && !deepEqual(data.unlockedAchievements, unlockedAchievements))
              setUnlockedAchievements(data.unlockedAchievements);
            if (data.calendarNotes && !deepEqual(data.calendarNotes, calendarNotes))
              setCalendarNotes(data.calendarNotes);

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
        },
        (err) => {
          console.error("Firestore snapshot error:", err);
          setLoading(false);
        }
      );
    return unsubscribe;
  }, [familyId, currentWeek, completedActivities, dailyNotes, family, sharedNotes, dogName, dogBreed, dogDob, completedDailyByDate, progressPhotos, unlockedAchievements, calendarNotes]);

  // Achievements effect
  useEffect(() => {
    const { currentStreak } = calculateStreak(completedDailyByDate);
    const newAch = [];
    if (currentWeek >= 1 && !unlockedAchievements.includes("first_week")) newAch.push("first_week");
    if (currentStreak >= 7 && !unlockedAchievements.includes("streak_7")) newAch.push("streak_7");
    if (currentStreak >= 30 && !unlockedAchievements.includes("streak_30")) newAch.push("streak_30");
    if (progressPhotos.length > 0 && !unlockedAchievements.includes("photo_first")) newAch.push("photo_first");
    const today = getCurrentDate();
    const completedToday = completedDailyByDate[today] || [];
    const allDailyKeys = Object.entries(dailyRoutine).flatMap(([s, acts]) =>
      acts.map((a) => `daily-${s}-${a}`)
    );
    if (completedToday.length >= allDailyKeys.length && !unlockedAchievements.includes("all_daily"))
      newAch.push("all_daily");
    const weekActs = weeklyPlans[currentWeek] || [];
    if (
      weekActs.length > 0 &&
      weekActs.every((act) => completedActivities.includes(`${currentWeek}-${act}`)) &&
      !unlockedAchievements.includes("week_perfect")
    )
      newAch.push("week_perfect");
    if (newAch.length) {
      setUnlockedAchievements((prev) => [...prev, ...newAch]);
      newAch.forEach((id) => {
        const ach = achievements.find((a) => a.id === id);
        if (ach) showToast(`🏆 Achievement Unlocked: ${ach.title} 🐕`, "success");
      });
    }
  }, [currentWeek, completedActivities, completedDailyByDate, progressPhotos, unlockedAchievements]);

  // Notifications setup
  useEffect(() => {
    async function setup() {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted" || !dogName) return;
      await Notifications.cancelAllScheduledNotificationsAsync();
      await Notifications.scheduleNotificationAsync({
        content: { title: `🌅 Good morning!`, body: `Time for ${dogName}'s morning training! 🐕`, sound: true },
        trigger: { hour: 8, minute: 0, repeats: true },
      });
      await Notifications.scheduleNotificationAsync({
        content: { title: `🌙 Evening training time!`, body: `Don't forget ${dogName}'s practice! 🎾`, sound: true },
        trigger: { hour: 18, minute: 0, repeats: true },
      });
    }
    setup();
  }, [dogName]);

  // Network status
  useEffect(() => {
    const unsub = NetInfo.addEventListener((state) => setIsOffline(!state.isConnected));
    NetInfo.fetch().then((state) => setIsOffline(!state.isConnected));
    return () => unsub();
  }, []);

  // Cleanup timeouts
  useEffect(() => () => clearTimeout(syncTimeout.current), []);

  // Initial load from AsyncStorage
  useEffect(() => {
    (async () => {
      try {
        const id = await AsyncStorage.getItem("familyId");
        const dog = await AsyncStorage.getItem("dogName");
        const breed = await AsyncStorage.getItem("dogBreed");
        const dob = await AsyncStorage.getItem("dogDob");
        const m = await AsyncStorage.getItem("memberName");
        const photos = await AsyncStorage.getItem("progressPhotos");
        const achs = await AsyncStorage.getItem("unlockedAchievements");
        const cdbd = await AsyncStorage.getItem("completedDailyByDate");

        if (id) setFamilyId(id);
        if (dog) setDogName(dog);
        if (breed) setDogBreed(breed);
        if (dob) setDogDob(dob);
        if (m) setCurrentUserName(m);
        if (photos) setProgressPhotos(JSON.parse(photos));
        if (achs) setUnlockedAchievements(JSON.parse(achs));
        if (cdbd) setCompletedDailyByDate(JSON.parse(cdbd));
      } catch (e) {
        console.error("Error loading data:", e);
      } finally {
        setFamilyDogLoading(false);
      }
    })();
  }, []);

  // Persist to AsyncStorage
  useEffect(() => AsyncStorage.setItem("progressPhotos", JSON.stringify(progressPhotos)), [progressPhotos]);
  useEffect(() => AsyncStorage.setItem("unlockedAchievements", JSON.stringify(unlockedAchievements)), [unlockedAchievements]);
  useEffect(() => AsyncStorage.setItem("memberName", currentUserName), [currentUserName]);

  // Handlers: family ID, dog details, toggles, notes, sharedNotes, family management, modals...
  const handleFamilyIdSubmit = async () => {
    if (!inputId.trim()) return;
    setCheckingFamilyId(true);
    try {
      const doc = await db.collection("families").doc(inputId.trim()).get();
      if (doc.exists) {
        const data = doc.data();
        if (data.dogName && data.dogBreed && data.dogDob) {
          await AsyncStorage.multiSet([
            ["familyId", inputId.trim()],
            ["dogName", data.dogName],
            ["dogBreed", data.dogBreed],
            ["dogDob", data.dogDob],
          ]);
          setFamilyId(inputId.trim());
          setDogName(data.dogName);
          setDogBreed(data.dogBreed);
          setDogDob(data.dogDob);
          setShowDogInput(false);
        } else {
          Alert.alert("🏠 Family Pack Found", "Pack exists but missing pup info. Contact leader.");
        }
      } else {
        Alert.alert(
          "🎉 Create New Training Pack?",
          `No pack for ID "${inputId.trim()}". Create new?`,
          [
            { text: "❌ Cancel", style: "cancel" },
            {
              text: "🚀 Create Pack",
              onPress: () => setShowDogInput(true),
            },
          ]
        );
      }
    } catch (e) {
      Alert.alert("🌐 Connection Issue", e.message);
    } finally {
      setCheckingFamilyId(false);
    }
  };

  const handleDogDetailsSubmit = async () => {
    const breedSave = inputBreed === "Other" ? inputBreedOther.trim() : inputBreed;
    if (!inputId.trim() || !inputDog.trim() || !breedSave || !inputDob.trim()) {
      Alert.alert("🐕 Missing Pup Info", "Fill all required fields!");
      return;
    }
    if (!isValidDate(inputDob.trim())) {
      Alert.alert("🎂 Invalid Date", "Use YYYY-MM-DD format.");
      return;
    }
    try {
      await db.collection("families").doc(inputId.trim()).set(
        {
          dogName: inputDog.trim(),
          dogBreed: breedSave,
          dogDob: inputDob.trim(),
          family: [
            { id: 1, name: "🏆 Primary Trainer", editing: false },
            { id: 2, name: "👨‍👩‍👧‍👦 Family Member 2", editing: false },
            { id: 3, name: "👨‍👩‍👧‍👦 Family Member 3", editing: false },
          ],
        },
        { merge: true }
      );
      await AsyncStorage.multiSet([
        ["familyId", inputId.trim()],
        ["dogName", inputDog.trim()],
        ["dogBreed", breedSave],
        ["dogDob", inputDob.trim()],
      ]);
      setFamilyId(inputId.trim());
      setDogName(inputDog.trim());
      setDogBreed(breedSave);
      setDogDob(inputDob.trim());
      setShowDogInput(false);
      showToast("🎉 Training pack created! Welcome to the pack!", "success");
    } catch (e) {
      Alert.alert("🌐 Connection Issue", e.message);
    }
  };

  const toggleActivity = useCallback(
    (week, activity) => {
      const key = `${week}-${activity}`;
      setCompletedActivities((prev) =>
        prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
      );
    },
    [completedActivities]
  );

  const toggleDailyActivity = useCallback(
    (slot, activity) => {
      const key = `daily-${slot}-${activity}`;
      const today = getCurrentDate();
      setCompletedDailyByDate((prev) => {
        const todayArr = prev[today] || [];
        const isDone = todayArr.includes(key);
        const nextArr = isDone ? todayArr.filter((k) => k !== key) : [...todayArr, key];
        return { ...prev, [today]: nextArr };
      });
    },
    []
  );

  const addNote = useCallback(
    async (date, note) => {
      const updated = { ...dailyNotes, [date]: note };
      setDailyNotes(updated);
      if (familyId) {
        try {
          await db.collection("families").doc(familyId).set({ dailyNotes: updated }, { merge: true });
        } catch (e) {
          showToast("Failed to save note. 📶", "error");
        }
      }
    },
    [dailyNotes, familyId]
  );

  const handleAddSharedNote = async () => {
    const text = newSharedNote.trim();
    if (!text) return;
    const noteObj = {
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      text,
      author: currentUserName,
      timestamp: new Date().toISOString(),
    };
    const updated = [noteObj, ...sharedNotes];
    setSharedNotes(updated);
    setNewSharedNote("");
    try {
      await db.collection("families").doc(familyId).set({ sharedNotes: updated }, { merge: true });
      showToast("📝 Note shared with your pack!", "success");
    } catch (e) {
      Alert.alert("🐕 Oops!", "Failed to save note.");
      setSharedNotes(sharedNotes);
      setNewSharedNote(text);
    }
  };

  const saveNoteEdit = async (noteId) => {
    if (!editingNoteText.trim()) {
      Alert.alert("🐕 Empty Note", "Note cannot be empty!");
      return;
    }
    const updated = sharedNotes.map((n) =>
      n.id === noteId ? { ...n, text: editingNoteText.trim(), edited: true } : n
    );
    setSharedNotes(updated);
    setEditingNoteId(null);
    setEditingNoteText("");
    try {
      await db.collection("families").doc(familyId).set({ sharedNotes: updated }, { merge: true });
      showToast("✏️ Note updated!", "success");
    } catch (e) {
      Alert.alert("🐕 Oops!", "Failed to update note.");
    }
  };

  const handleEditFamilyMember = useCallback(
    (id) => {
      setEditingMemberId(id);
      setEditFamilyName((prev) => ({ ...prev, [id]: family.find((f) => f.id === id)?.name || "" }));
    },
    [family]
  );

  const handleSaveFamilyMember = useCallback((id, newName) => {
    setFamily((fArr) =>
      fArr.map((f) => (f.id === id ? { ...f, name: newName || "🐕 Unnamed", editing: false } : f))
    );
    setEditingMemberId(null);
    showToast("👥 Pack member updated!", "success");
  }, []);

  const handleRemoveFamilyMember = useCallback((id) => {
    Alert.alert(
      "🐕 Remove Pack Member?",
      "Are you sure?",
      [
        { text: "❌ Cancel", style: "cancel" },
        {
          text: "🗑️ Remove",
          style: "destructive",
          onPress: () => {
            setFamily((f) => f.filter((m) => m.id !== id));
            showToast("👋 Pack member removed", "info");
          },
        },
      ]
    );
  }, []);

  const handleAddFamilyMember = useCallback(() => {
    const name = newFamilyName.trim();
    if (!name) return;
    const prefixed = name.startsWith("🐕") ? name : `👥 ${name}`;
    setFamily((f) => [...f, { id: Date.now(), name: prefixed, editing: false }]);
    setNewFamilyName("");
    showToast("🎉 New pack member added!", "success");
  }, [newFamilyName]);

  const openEditDogModal = useCallback(() => {
    let breed = dogBreed;
    let other = "";
    if (dogBreed && !commonUKBreeds.includes(dogBreed)) {
      breed = "Other";
      other = dogBreed;
    }
    setEditDogName(dogName || "");
    setEditDogBreed(breed || "");
    setEditDogBreedOther(other || "");
    setEditDogDob(dogDob || "");
    setEditDogModal(true);
  }, [dogName, dogBreed, dogDob]);

  const saveDogInfo = async () => {
    const name = editDogName.trim();
    const dob = editDogDob.trim();
    const breed = editDogBreed === "Other" ? editDogBreedOther.trim() : editDogBreed;
    if (!name || !breed || !dob) {
      return Alert.alert("🐕 Missing Info", "All fields required!");
    }
    if (!isValidDate(dob)) {
      return Alert.alert("🎂 Invalid Date", "Use YYYY-MM-DD.");
    }
    setDogName(name);
    setDogBreed(breed);
    setDogDob(dob);
    try {
      await updateDogInfoStorageAndFirestore(familyId, name, breed, dob);
      setEditDogModal(false);
      showToast("🐕 Pup info updated!", "success");
    } catch (e) {
      Alert.alert("🌐 Connection Issue", "Failed to save changes.");
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      "🔄 Switch Training Pack?",
      "This will log you out and join a different pack.",
      [
        { text: "❌ Cancel", style: "cancel" },
        {
          text: "🔄 Switch Pack",
          onPress: async () => {
            await AsyncStorage.multiRemove([
              "familyId",
              "dogName",
              "dogBreed",
              "dogDob",
              "completedDailyByDate",
            ]);
            setFamilyId(null);
            setDogName(null);
            setDogBreed(null);
            setDogDob(null);
            setShowDogInput(false);
            setFamilyDogLoading(false);
            showToast("👋 Switched to new pack setup!", "info");
          },
        },
      ]
    );
  };

  const handleQuickAddNote = () => setShowQuickNote(true);

  const handleQuickMarkComplete = () => {
    const today = getCurrentDate();
    const done = (completedDailyByDate[today] || []).length;
    const total = Object.entries(dailyRoutine).flat().length;
    if (done >= total) {
      showToast("🎉 All daily tasks completed! 🐕‍🦺", "success");
    } else {
      showToast(`🎯 ${total - done} tasks remaining! 💪`, "info");
    }
  };

  const handleQuickNoteSubmit = async () => {
    if (!quickNoteText.trim()) return;
    await addNote(selectedDate, quickNoteText.trim());
    setQuickNoteText("");
    setShowQuickNote(false);
    showToast("📝 Training note added! 🐕", "success");
  };

  const handleOpenNoteModal = useCallback((date, text = "") => {
    setCurrentNoteDate(date);
    setNoteInputText(text);
    setShowNoteModal(true);
  }, []);

  const handleSaveNote = async () => {
    if (noteInputText.trim()) {
      const newNotes = {
        ...calendarNotes,
        [currentNoteDate]: { text: noteInputText.trim(), savedAt: Date.now() },
      };
      setCalendarNotes(newNotes);
      if (familyId) {
        await db.collection("families").doc(familyId).set({ calendarNotes: newNotes }, { merge: true });
      }
    }
    setShowNoteModal(false);
    Keyboard.dismiss();
  };

  // RENDER LOADING / SETUP
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
          <Text style={styles.setupText}>🏠 Enter your Family ID to join your pack.</Text>
          <TextInput
            placeholder="🏷️ Family ID"
            value={inputId}
            onChangeText={setInputId}
            style={styles.setupInput}
          />
          <TouchableOpacity onPress={handleFamilyIdSubmit} style={styles.setupButton}>
            {checkingFamilyId ? <ActivityIndicator color="#fff"/> : <Text style={styles.setupButtonText}>🚀 Let's Start</Text>}
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View style={styles.setupContainer}>
        <Text style={{ fontSize: 64, marginBottom: 16 }}>🐶</Text>
        <Text style={styles.welcomeTitle}>Create Your Training Pack</Text>
        <TextInput value={inputId} editable={false} style={[styles.setupInput, styles.disabledInput]} />
        <TextInput
          placeholder="🐕 Dog Name"
          value={inputDog}
          onChangeText={setInputDog}
          style={styles.setupInput}
        />
        <RNPickerSelect
          onValueChange={setInputBreed}
          value={inputBreed}
          placeholder={{ label: "🐕 Select Breed...", value: "" }}
          items={[...commonUKBreeds.map((b) => ({ label: b, value: b })), { label: "🐕 Other", value: "Other" }]}
          style={{ inputIOS: styles.pickerInput, inputAndroid: styles.pickerInput }}
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
          placeholder="🎂 DOB (YYYY-MM-DD)"
          value={inputDob}
          onChangeText={setInputDob}
          keyboardType={Platform.OS === "ios" ? "numbers-and-punctuation" : "numeric"}
          style={styles.setupInput}
          maxLength={10}
        />
        <TouchableOpacity onPress={handleDogDetailsSubmit} style={styles.setupButton}>
          <Text style={styles.setupButtonText}>🎉 Create Pack</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContent}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {isOffline && (
            <View style={styles.offlineBanner}>
              <Text>📶 You're offline. Changes will sync when back online!</Text>
            </View>
          )}
          {showDailyConfetti && <ConfettiCannon count={200} origin={{ x: -10, y: 0 }} fadeOut />}
          {showWeeklyConfetti && <ConfettiCannon count={300} origin={{ x: -10, y: 0 }} fadeOut />}

          {/* HEADER */}
          <View style={styles.enhancedHeaderContainer}>
            <View style={styles.headerTop}>
              <View style={styles.dogInfoContainer}>
                <DogAvatar dogName={dogName} dogBreed={dogBreed} />
                <View style={styles.dogInfo}>
                  <Text style={styles.enhancedDogName}>🐕 {dogName}</Text>
                  <Text style={styles.dogDetails}>{dogBreed} • {currentDogAge}</Text>
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
                  <Text>🔄</Text><Text style={styles.forceSyncText}>Force Sync</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.headerBottom}>
              <TouchableOpacity onPress={openEditDogModal} style={styles.editButton}>
                <Text>✏️ Edit Pup Info</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                <Text>🔄 Switch Pack</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* NAV TABS */}
          <View style={styles.enhancedNavigationContainer}>
            {[
              { key: "daily", Icon: DogHouseIcon, label: "🏠 Home" },
              { key: "weekly", Icon: CalendarPawIcon, label: "📅 Weekly" },
              { key: "progress", Icon: PawIcon, label: "📈 Progress" },
              { key: "notes", Icon: NotesBoneIcon, label: "📝 Notes" },
              { key: "achievements", Icon: TrophyIcon, label: "🏆 Awards" },
              { key: "family", Icon: DogFamilyIcon, label: "👨‍👩‍👧‍👦 Pack" },
            ].map(({ key, Icon, label }) => {
              const active = viewMode === key;
              const color = active ? dogThemeColors.light : dogThemeColors.mediumText;
              return (
                <TouchableOpacity
                  key={key}
                  style={[styles.navTab, active && styles.enhancedNavTabActive]}
                  onPress={() => setViewMode(key)}
                >
                  <Icon size={22} color={color} />
                  <Text style={[styles.navTabText, { color }]}>{label}</Text>
                  {active && <View style={styles.activeTabIndicator} />}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* SCREENS */}
          {viewMode === "daily" && (
            <DailyScreen
              dailyRate={
                (completedDailyByDate[getCurrentDate()] || []).length /
                Object.entries(dailyRoutine).flat().length
              }
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
              completionRate={
                (completedActivities.filter((a) => a.startsWith(`${currentWeek}-`)).length) /
                (weeklyPlans[currentWeek] || []).length
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
                (completedActivities.filter((a) => a.startsWith(`${currentWeek}-`)).length) /
                (weeklyPlans[currentWeek] || []).length
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
                (completedActivities.filter((a) => a.startsWith(`${currentWeek}-`)).length) /
                (weeklyPlans[currentWeek] || []).length
              }
              dailyRate={
                (completedDailyByDate[getCurrentDate()] || []).length /
                Object.entries(dailyRoutine).flat().length
              }
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
            />
          )}
        </ScrollView>

        <QuickActions
          onAddNote={handleQuickAddNote}
          onTakePhoto={handleQuickTakePhoto}
          onMarkComplete={handleQuickMarkComplete}
        />

        {syncing && (
          <View style={styles.syncIndicator}>
            <Text>🔄 Syncing with pack...</Text>
          </View>
        )}
      </View>

      {/* EDIT PUP MODAL */}
      <Modal visible={editDogModal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.enhancedModalContainer}>
          <View style={styles.enhancedModalHeader}>
            <TouchableOpacity onPress={() => setEditDogModal(false)}><Text>❌</Text></TouchableOpacity>
            <Text style={styles.enhancedModalTitle}>🐕 Edit Pup Info</Text>
            <TouchableOpacity onPress={saveDogInfo}><Text>💾 Save</Text></TouchableOpacity>
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
                placeholder={{ label: "🐕 Select Breed...", value: "" }}
                items={[
                  ...commonUKBreeds.map((b) => ({ label: b, value: b })),
                  { label: "🐕 Other", value: "Other" },
                ]}
                style={{ inputIOS: styles.enhancedModalPickerInput, inputAndroid: styles.enhancedModalPickerInput }}
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

      {/* QUICK NOTE MODAL */}
      <Modal visible={showQuickNote} animationType="slide" transparent>
        <View style={styles.quickNoteOverlay}>
          <View style={styles.enhancedQuickNoteModal}>
            <View style={styles.quickNoteHeader}>
              <Text style={styles.enhancedQuickNoteTitle}>📝 Quick Training Note</Text>
              <TouchableOpacity onPress={() => setShowQuickNote(false)}><Text>❌</Text></TouchableOpacity>
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

      {/* CALENDAR NOTE MODAL */}
      <Modal visible={showNoteModal} transparent animationType="fade">
        <View style={styles.noteModalOverlay}>
          <View style={styles.noteModalContainer}>
            <Text style={styles.noteModalTitle}>📝 Add note for {currentNoteDate}</Text>
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