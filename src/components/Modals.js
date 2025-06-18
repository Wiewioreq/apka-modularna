import React from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Platform,
  Keyboard,
  StyleSheet 
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import RNPickerSelect from "react-native-picker-select";
import { dogThemeColors } from '../constants/colors';
import { commonUKBreeds } from '../constants/achievements';

// Dog Edit Modal
export const DogEditModal = ({ 
  visible, 
  onClose, 
  editDogName, 
  setEditDogName, 
  editDogBreed, 
  setEditDogBreed, 
  editDogBreedOther, 
  setEditDogBreedOther, 
  editDogDob, 
  setEditDogDob, 
  onSave 
}) => {
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.enhancedModalContainer}>
        <View style={styles.enhancedModalHeader}>
          <TouchableOpacity onPress={onClose}>
            <Text style={{ fontSize: 20 }}>❌</Text>
          </TouchableOpacity>
          <Text style={styles.enhancedModalTitle}>🐕 Edit Pup Info</Text>
          <TouchableOpacity onPress={onSave}>
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
  );
};

// Quick Note Modal
export const QuickNoteModal = ({ 
  visible, 
  onClose, 
  quickNoteText, 
  setQuickNoteText, 
  onSave 
}) => {
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.quickNoteOverlay}>
        <View style={styles.enhancedQuickNoteModal}>
          <View style={styles.quickNoteHeader}>
            <Text style={styles.enhancedQuickNoteTitle}>📝 Quick Training Note</Text>
            <TouchableOpacity onPress={onClose}>
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
            <TouchableOpacity style={styles.enhancedQuickNoteCancel} onPress={onClose}>
              <Text style={styles.quickNoteCancelText}>❌ Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.enhancedQuickNoteSave} onPress={onSave}>
              <Text style={styles.enhancedQuickNoteSaveText}>💾 Save Note</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Calendar Note Modal
export const CalendarNoteModal = ({ 
  visible, 
  onClose, 
  currentNoteDate, 
  noteInputText, 
  setNoteInputText, 
  onSave 
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
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
              onPress={() => { onClose(); Keyboard.dismiss(); }}
              style={styles.noteModalCancel}
            >
              <Text style={styles.noteModalCancelText}>❌ Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onSave}
              style={styles.noteModalSave}
            >
              <Text style={styles.noteModalSaveText}>💾 Save Note</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // Dog Edit Modal Styles
  enhancedModalContainer: {
    flex: 1,
    backgroundColor: dogThemeColors.light,
  },
  enhancedModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 2,
    borderBottomColor: dogThemeColors.lightAccent,
    backgroundColor: dogThemeColors.cardBg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  enhancedModalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: dogThemeColors.darkText,
  },
  enhancedModalSave: {
    fontSize: 16,
    fontWeight: "600",
    color: dogThemeColors.primary,
  },
  enhancedModalContent: {
    flex: 1,
    padding: 20,
  },
  enhancedModalSection: {
    marginBottom: 24,
  },
  enhancedModalLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: dogThemeColors.darkText,
    marginBottom: 10,
  },
  enhancedModalInput: {
    fontSize: 16,
    color: dogThemeColors.darkText,
    borderWidth: 2,
    borderColor: dogThemeColors.accent,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: dogThemeColors.cardBg,
  },
  modalInputMarginTop: {
    marginTop: 8,
  },
  enhancedModalPickerInput: {
    fontSize: 16,
    color: dogThemeColors.darkText,
    borderWidth: 2,
    borderColor: dogThemeColors.accent,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: dogThemeColors.cardBg,
  },

  // Quick Note Modal Styles
  quickNoteOverlay: {
    flex: 1,
    backgroundColor: "rgba(139, 69, 19, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  enhancedQuickNoteModal: {
    backgroundColor: dogThemeColors.cardBg,
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
    borderWidth: 3,
    borderColor: dogThemeColors.accent,
  },
  quickNoteHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  enhancedQuickNoteTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: dogThemeColors.darkText,
    marginBottom: 16,
    textAlign: "center",
  },
  enhancedQuickNoteInput: {
    fontSize: 16,
    color: dogThemeColors.darkText,
    borderWidth: 2,
    borderColor: dogThemeColors.accent,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
    textAlignVertical: "top",
    minHeight: 120,
    backgroundColor: dogThemeColors.light,
  },
  quickNoteActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  enhancedQuickNoteCancel: {
    flex: 1,
    paddingVertical: 14,
    marginRight: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: dogThemeColors.lightAccent,
    backgroundColor: dogThemeColors.lightAccent,
  },
  quickNoteCancelText: {
    fontSize: 16,
    color: dogThemeColors.mediumText,
    textAlign: "center",
    fontWeight: "500",
  },
  enhancedQuickNoteSave: {
    flex: 1,
    paddingVertical: 14,
    marginLeft: 10,
    borderRadius: 10,
    backgroundColor: dogThemeColors.primary,
    shadowColor: dogThemeColors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: dogThemeColors.accent,
  },
  enhancedQuickNoteSaveText: {
    fontSize: 16,
    color: dogThemeColors.light,
    textAlign: "center",
    fontWeight: "600",
  },

  // Calendar Note Modal Styles
  noteModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(139, 69, 19, 0.3)",
    justifyContent: "center",
    alignItems: "center"
  },
  noteModalContainer: {
    backgroundColor: dogThemeColors.cardBg,
    borderRadius: 16,
    padding: 20,
    width: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 3,
    borderColor: dogThemeColors.accent,
  },
  noteModalTitle: {
    fontWeight: "bold", 
    marginBottom: 16, 
    fontSize: 18, 
    color: dogThemeColors.darkText,
    textAlign: "center",
  },
  noteModalInput: {
    borderWidth: 2, 
    borderColor: dogThemeColors.accent, 
    borderRadius: 12,
    padding: 12,
    minHeight: 80,
    fontSize: 16,
    backgroundColor: dogThemeColors.light,
    color: dogThemeColors.darkText,
    textAlignVertical: "top",
  },
  noteModalActions: {
    flexDirection: "row", 
    marginTop: 20,
    justifyContent: "space-between"
  },
  noteModalCancel: {
    flex: 1,
    marginRight: 16,
    paddingVertical: 12, 
    paddingHorizontal: 16, 
    borderRadius: 10,
    backgroundColor: dogThemeColors.lightAccent,
    borderWidth: 2,
    borderColor: dogThemeColors.accent,
  },
  noteModalCancelText: {
    color: dogThemeColors.mediumText,
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
  },
  noteModalSave: {
    flex: 1,
    backgroundColor: dogThemeColors.primary,
    paddingVertical: 12, 
    paddingHorizontal: 20, 
    borderRadius: 10,
    borderWidth: 2,
    borderColor: dogThemeColors.accent,
  },
  noteModalSaveText: {
    color: dogThemeColors.light, 
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
  },
});