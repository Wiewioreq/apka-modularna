import React from "react";
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { dogThemeColors } from "../constants";
import { styles } from "../styles/styles";

export const FamilyScreen = ({
  family,
  editingMemberId,
  editFamilyName,
  setEditFamilyName,
  handleEditFamilyMember,
  handleSaveFamilyMember,
  handleRemoveFamilyMember,
  newFamilyName,
  setNewFamilyName,
  handleAddFamilyMember,
  setEditingMemberId,
}) => {
  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
      <View style={styles.enhancedSection}>
        <Text style={styles.enhancedSectionTitle}>
          <Text style={{ fontSize: 20, marginRight: 8 }}>👨‍👩‍👧‍👦</Text> Training Pack Members
        </Text>
        {family.map((member) => (
          <View key={member.id} style={styles.enhancedFamilyMemberRow}>
            {editingMemberId === member.id ? (
              <View style={styles.familyEditContainer}>
                <TextInput
                  style={styles.enhancedFamilyEditInput}
                  value={editFamilyName[member.id] || ""}
                  onChangeText={(text) => setEditFamilyName({ ...editFamilyName, [member.id]: text })}
                  onBlur={() => handleSaveFamilyMember(member.id, editFamilyName[member.id])}
                  autoFocus
                />
                <TouchableOpacity
                  onPress={() => handleSaveFamilyMember(member.id, editFamilyName[member.id])}
                  style={styles.familyActionButton}
                  activeOpacity={0.7}
                >
                  <Text style={{ fontSize: 18 }}>✅</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <Text style={styles.enhancedFamilyMemberName}>{member.name}</Text>
                <View style={styles.familyActions}>
                  <TouchableOpacity
                    onPress={() => handleEditFamilyMember(member.id)}
                    style={styles.familyActionButton}
                    activeOpacity={0.7}
                  >
                    <Text style={{ fontSize: 16 }}>✏️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleRemoveFamilyMember(member.id)}
                    style={styles.familyActionButton}
                    activeOpacity={0.7}
                  >
                    <Text style={{ fontSize: 16 }}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        ))}

        <View style={styles.enhancedAddFamilyContainer}>
          <TextInput
            style={styles.enhancedAddFamilyInput}
            placeholder="👤 Add pack member..."
            value={newFamilyName}
            onChangeText={setNewFamilyName}
            onSubmitEditing={handleAddFamilyMember}
          />
          <TouchableOpacity onPress={handleAddFamilyMember} style={styles.enhancedAddFamilyButton} activeOpacity={0.8}>
            <Text style={{ fontSize: 18, color: dogThemeColors.primary }}>➕</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};