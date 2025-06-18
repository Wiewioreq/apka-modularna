// TailWag Tracker - Custom Icons Component
// Updated: 2025-06-15 14:33:22 UTC by Wiewioreq

import React from 'react';
import { View, Text, Image } from 'react-native';

// Emoji-based icons for navigation and features
export const DogHouseIcon = ({ size = 24, color = '#8B4513' }) => (
  <View style={{ 
    width: size, 
    height: size, 
    justifyContent: 'center', 
    alignItems: 'center' 
  }}>
    <Text style={{ fontSize: size * 0.8, color }}>🏠</Text>
  </View>
);

export const CalendarPawIcon = ({ size = 24, color = '#8B4513' }) => (
  <View style={{ 
    width: size, 
    height: size, 
    justifyContent: 'center', 
    alignItems: 'center' 
  }}>
    <Text style={{ fontSize: size * 0.8, color }}>📅</Text>
  </View>
);

export const PawIcon = ({ size = 24, color = '#8B4513' }) => (
  <View style={{ 
    width: size, 
    height: size, 
    justifyContent: 'center', 
    alignItems: 'center' 
  }}>
    <Text style={{ fontSize: size * 0.8, color }}>🐾</Text>
  </View>
);

export const NotesBoneIcon = ({ size = 24, color = '#8B4513' }) => (
  <View style={{ 
    width: size, 
    height: size, 
    justifyContent: 'center', 
    alignItems: 'center' 
  }}>
    <Text style={{ fontSize: size * 0.8, color }}>📝</Text>
  </View>
);

export const TrophyIcon = ({ size = 24, color = '#8B4513' }) => (
  <View style={{ 
    width: size, 
    height: size, 
    justifyContent: 'center', 
    alignItems: 'center' 
  }}>
    <Text style={{ fontSize: size * 0.8, color }}>🏆</Text>
  </View>
);

export const DogFamilyIcon = ({ size = 24, color = '#8B4513' }) => (
  <View style={{ 
    width: size, 
    height: size, 
    justifyContent: 'center', 
    alignItems: 'center' 
  }}>
    <Text style={{ fontSize: size * 0.8, color }}>👥</Text>
  </View>
);

export const CameraIcon = ({ size = 24, color = '#8B4513' }) => (
  <View style={{ 
    width: size, 
    height: size, 
    justifyContent: 'center', 
    alignItems: 'center' 
  }}>
    <Text style={{ fontSize: size * 0.8, color }}>📸</Text>
  </View>
);

export const SettingsIcon = ({ size = 24, color = '#8B4513' }) => (
  <View style={{ 
    width: size, 
    height: size, 
    justifyContent: 'center', 
    alignItems: 'center' 
  }}>
    <Text style={{ fontSize: size * 0.8, color }}>⚙️</Text>
  </View>
);

export const HeartIcon = ({ size = 24, color = '#8B4513' }) => (
  <View style={{ 
    width: size, 
    height: size, 
    justifyContent: 'center', 
    alignItems: 'center' 
  }}>
    <Text style={{ fontSize: size * 0.8, color }}>❤️</Text>
  </View>
);

export const StarIcon = ({ size = 24, color = '#8B4513' }) => (
  <View style={{ 
    width: size, 
    height: size, 
    justifyContent: 'center', 
    alignItems: 'center' 
  }}>
    <Text style={{ fontSize: size * 0.8, color }}>⭐</Text>
  </View>
);

// Export all icons as default
export default {
  DogHouseIcon,
  CalendarPawIcon,
  PawIcon,
  NotesBoneIcon,
  TrophyIcon,
  DogFamilyIcon,
  CameraIcon,
  SettingsIcon,
  HeartIcon,
  StarIcon,
};