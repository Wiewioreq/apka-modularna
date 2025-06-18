import React from "react";
import { View, Text } from "react-native";
import { dogThemeColors } from "../constants";

export const DogAvatar = ({ dogName, dogBreed }) => {
  const getBreedEmoji = (breed) => {
    if (!breed) return "🐶";
    if (breed.includes("Labrador")) return "🦮";
    if (breed.includes("German Shepherd")) return "🐕‍🦺";
    if (breed.includes("Bulldog")) return "🐕";
    if (breed.includes("Border Collie")) return "🐕‍🦺";
    if (breed.includes("Golden")) return "🦮";
    return "🐶";
  };
  
  return (
    <View style={{
      width: 50,
      height: 50, 
      borderRadius: 25,
      backgroundColor: dogThemeColors.primary,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
      borderWidth: 2,
      borderColor: dogThemeColors.accent,
      shadowColor: dogThemeColors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 4,
    }}>
      <Text style={{ fontSize: 20 }}>
        {getBreedEmoji(dogBreed)}
      </Text>
    </View>
  );
};