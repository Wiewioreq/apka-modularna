import React from "react";
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { dogThemeColors } from "../constants";
import { styles } from "../styles/styles";

export const NotesScreen = ({
  newSharedNote,
  setNewSharedNote,
  handleAddSharedNote,
  sharedNotes,
  notesLoading,
  editingNoteId,
  setEditingNoteId,
  editingNoteText,
  setEditingNoteText,
  saveNoteEdit,
  currentUserName,
}) => {
  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
      <View style={styles.enhancedSection}>
        <Text style={styles.enhancedSectionTitle}>
          <Text style={{ fontSize: 20, marginRight: 8 }}>💬</Text> Pack Training Notes
        </Text>

        <View style={styles.addNoteContainer}>
          <TextInput
            style={styles.enhancedAddNoteInput}
            placeholder="🐕 Share a training note with your pack..."
            value={newSharedNote}
            onChangeText={setNewSharedNote}
            multiline
            numberOfLines={2}
          />
          <TouchableOpacity onPress={handleAddSharedNote} style={styles.enhancedAddNoteButton} activeOpacity={0.8}>
            <Text style={{ fontSize: 18, color: "#fff" }}>📤</Text>
          </TouchableOpacity>
        </View>

        {notesLoading ? (
          <View style={styles.notesLoader}>
            <ActivityIndicator size="small" color={dogThemeColors.primary} />
            <Text style={{ color: dogThemeColors.mediumText, marginTop: 8 }}>Loading pack notes...</Text>
          </View>
        ) : (
          <View style={styles.notesContainer}>
            {sharedNotes && sharedNotes.length > 0 ? (
              sharedNotes.map((note) => (
                <View key={note.id} style={styles.enhancedNoteItem}>
                  <View style={styles.noteHeader}>
                    <Text style={styles.enhancedNoteAuthor}>🐕 {note.author}</Text>
                    <Text style={styles.enhancedNoteTimestamp}>
                      📅 {new Date(note.timestamp).toLocaleDateString()}{" "}
                      🕐 {new Date(note.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </Text>
                  </View>

                  {editingNoteId === note.id ? (
                    <View style={styles.noteEditContainer}>
                      <TextInput
                        style={styles.enhancedNoteEditInput}
                        value={editingNoteText}
                        onChangeText={setEditingNoteText}
                        multiline
                        autoFocus
                      />
                      <View style={styles.noteEditActions}>
                        <TouchableOpacity
                          onPress={() => saveNoteEdit(note.id)}
                          style={styles.noteEditButton}
                          activeOpacity={0.7}
                        >
                          <Text style={{ fontSize: 16 }}>✅</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            setEditingNoteId(null);
                            setEditingNoteText("");
                          }}
                          style={styles.noteEditButton}
                          activeOpacity={0.7}
                        >
                          <Text style={{ fontSize: 16 }}>❌</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    <>
                      <Text style={styles.enhancedNoteText}>{note.text}</Text>
                      {note.edited && (
                        <Text style={styles.enhancedNoteEdited}>
                          ✏️ Edited {new Date(note.editTimestamp).toLocaleDateString()}
                        </Text>
                      )}

                      {note.authorId === currentUserName && (
                        <TouchableOpacity
                          onPress={() => {
                            setEditingNoteId(note.id);
                            setEditingNoteText(note.text);
                          }}
                          style={styles.noteEditIcon}
                          activeOpacity={0.7}
                        >
                          <Text style={{ fontSize: 14 }}>✏️</Text>
                        </TouchableOpacity>
                      )}
                    </>
                  )}
                </View>
              ))
            ) : (
              <View style={{ alignItems: "center", paddingVertical: 40 }}>
                <Text style={{ fontSize: 48, marginBottom: 16 }}>🐕</Text>
                <Text style={styles.enhancedNoNotesText}>No pack notes yet!</Text>
                <Text style={styles.enhancedNoNotesText}>Add one above to share with your training pack! 🎾</Text>
              </View>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
};