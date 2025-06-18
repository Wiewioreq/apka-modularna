import React from "react";
import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { imageToBase64, showToast } from "../utils/helpers";
import { dogThemeColors } from "../constants";

const styles = {
  photoContainer: {
    backgroundColor: dogThemeColors.cardBg,
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    shadowColor: dogThemeColors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 2,
    borderColor: dogThemeColors.lightAccent,
  },
  photoTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: dogThemeColors.darkText,
    marginBottom: 8,
  },
  photoSubtitle: {
    fontSize: 14,
    color: dogThemeColors.mediumText,
    marginBottom: 12,
    fontStyle: "italic",
  },
  cameraButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: dogThemeColors.lightAccent,
    borderWidth: 2,
    borderColor: dogThemeColors.accent,
    borderStyle: "dashed",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cameraButtonText: {
    fontSize: 16,
    color: dogThemeColors.primary,
    fontWeight: "600",
  },
  photosGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  photoWrapper: {
    marginRight: 8,
    marginBottom: 8,
    alignItems: "center",
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: dogThemeColors.accent,
  },
  photoDate: {
    fontSize: 10,
    color: dogThemeColors.mediumText,
    marginTop: 4,
    textAlign: "center",
  },
};

export const PhotoProgress = ({ week, photos, onPhotoAdded }) => {
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("📸 Camera Permission", "We need camera access to capture your pup's progress!");
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
            week: week,
          };
          onPhotoAdded(newPhoto);
          showToast("📸 Pawsome photo added!", "success");
        } else {
          showToast("Failed to process photo", "error");
        }
      } catch (error) {
        console.error("Error taking photo:", error);
        showToast("Failed to save photo", "error");
      }
    }
  };

  const weekPhotos = photos.filter((photo) => photo.week === week);

  return (
    <View style={styles.photoContainer}>
      <Text style={styles.photoTitle}>📸 Progress Photos - Week {week}</Text>
      <Text style={styles.photoSubtitle}>Capture your pup's training journey! 🐾</Text>

      <TouchableOpacity style={styles.cameraButton} onPress={takePhoto} activeOpacity={0.7}>
        <Text style={{ fontSize: 24, marginRight: 8 }}>📸</Text>
        <Text style={styles.cameraButtonText}>Take Progress Photo</Text>
      </TouchableOpacity>

      <View style={styles.photosGrid}>
        {weekPhotos.map((photo, index) => {
          const source = photo.base64 
            ? { uri: `data:image/${photo.type || 'jpeg'};base64,${photo.base64}` }
            : { uri: photo.uri };
            
          return (
            <View key={index} style={styles.photoWrapper}>
              <Image source={source} style={styles.photo} />
              <Text style={styles.photoDate}>
                {new Date(photo.timestamp).toLocaleDateString()}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};