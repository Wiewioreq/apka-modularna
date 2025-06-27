import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDPT2FZbLupAd9F_V1CB87i5CUl2oaULLg",
  authDomain: "ludos-training-tracker.firebaseapp.com",
  projectId: "ludos-training-tracker",
  storageBucket: "ludos-training-tracker.appspot.com",
  messagingSenderId: "599255592851",
  appId: "1:599255592851:android:5c758bc134326f9b40c266",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);