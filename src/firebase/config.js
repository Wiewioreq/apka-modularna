import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { Platform } from "react-native";

// ========== FIREBASE CONFIG ==========
const firebaseConfig = {
  apiKey: "AIzaSyDPT2FZbLupAd9F_V1CB87i5CUl2oaULLg",
  authDomain: "ludos-training-tracker.firebaseapp.com",
  projectId: "ludos-training-tracker",
  storageBucket: "ludos-training-tracker.appspot.com",
  messagingSenderId: "599255592851",
  appId: "1:599255592851:android:5c758bc134326f9b40c266",
};

let db;

try {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  db = firebase.firestore();

  if (Platform.OS === "android" || Platform.OS === "ios") {
    db.enablePersistence({ synchronizeTabs: false }).catch(function (err) {
      console.warn("Firestore persistence not available:", err.code);
    });
  }
} catch (error) {
  console.error("Firebase initialization failed:", error);
}

export { db, firebase };
export default db;