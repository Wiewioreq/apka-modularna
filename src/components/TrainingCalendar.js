import React, { useRef } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { dailyRoutine, dogThemeColors } from "../constants";

const styles = {
  calendar: {
    backgroundColor: dogThemeColors.cardBg,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: dogThemeColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 2,
    borderColor: dogThemeColors.lightAccent,
  },
  calendarTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: dogThemeColors.darkText,
    marginBottom: 8,
    textAlign: "center",
  },
  calendarSubtitle: {
    fontSize: 14,
    color: dogThemeColors.mediumText,
    marginBottom: 16,
    textAlign: "center",
    fontStyle: "italic",
  },
  weekDays: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 8,
  },
  weekDayText: {
    fontSize: 14,
    fontWeight: "600",
    color: dogThemeColors.mediumText,
    width: 32,
    textAlign: "center",
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: "14.28%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginVertical: 2,
    borderWidth: 1,
    borderColor: dogThemeColors.lightAccent,
    position: "relative",
  },
  completedDay: {
    backgroundColor: dogThemeColors.success,
    shadowColor: dogThemeColors.success,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    borderColor: dogThemeColors.success,
  },
  selectedDay: {
    backgroundColor: dogThemeColors.primary,
    shadowColor: dogThemeColors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    borderColor: dogThemeColors.primary,
  },
  noteDay: {
    backgroundColor: dogThemeColors.warning,
    borderColor: dogThemeColors.warning,
  },
  dayText: {
    fontSize: 14,
    color: dogThemeColors.darkText,
  },
  completedDayText: {
    color: "#fff",
    fontWeight: "600",
  },
  selectedDayText: {
    color: "#fff",
    fontWeight: "600",
  },
  noteDayText: {
    color: "#fff",
    fontWeight: "600",
  },
  notePopup: {
    position: "absolute",
    top: 38,
    left: 0,
    right: 0,
    backgroundColor: dogThemeColors.cardBg,
    borderRadius: 8,
    padding: 6,
    borderWidth: 2,
    borderColor: dogThemeColors.warning,
    zIndex: 99,
    minWidth: 120,
    minHeight: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  notePopupText: {
    color: dogThemeColors.darkText,
    fontSize: 12,
    textAlign: "center",
  },
};

export const TrainingCalendar = ({
  completedDailyByDate,
  onDateSelect,
  selectedDate,
  calendarNotes,
  onOpenNoteModal,
  visibleNotes,
  setVisibleNotes,
}) => {
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const formatDate = (day) => {
    if (!day) return null;
    const date = new Date();
    date.setDate(day);
    return date.toISOString().slice(0, 10);
  };

  // Double-click logic
  const lastClickRef = useRef({});
  const DOUBLE_CLICK_DELAY = 350;

  const handleDateClick = (day) => {
    const dateStr = formatDate(day);
    if (!dateStr) return;
    const now = Date.now();
    if (
      lastClickRef.current[dateStr] &&
      now - lastClickRef.current[dateStr] < DOUBLE_CLICK_DELAY
    ) {
      // Double click
      onOpenNoteModal(dateStr, calendarNotes?.[dateStr]?.text || "");
      lastClickRef.current[dateStr] = 0;
    } else {
      // Single click: toggle note view if exists, or just select
      if (calendarNotes?.[dateStr]?.text) {
        setVisibleNotes((prev) => ({
          ...prev,
          [dateStr]: !prev[dateStr],
        }));
      } else {
        onDateSelect(dateStr);
      }
      lastClickRef.current[dateStr] = now;
    }
  };

  const days = getDaysInMonth(new Date());

  const isCompleted = (day) => {
    if (!day) return false;
    const dateStr = formatDate(day);
    const completed = completedDailyByDate[dateStr] || [];
    const allDailyKeys = Object.entries(dailyRoutine).flatMap(([slot, acts]) =>
      acts.map((activity) => `daily-${slot}-${activity}`)
    );
    return completed.length >= allDailyKeys.length * 0.8;
  };

  const isSelected = (day) => {
    if (!day) return false;
    return formatDate(day) === selectedDate;
  };

  return (
    <View style={styles.calendar}>
      <Text style={styles.calendarTitle}>🗓️ Training Calendar</Text>
      <Text style={styles.calendarSubtitle}>Double tap to add notes! 📝</Text>
      <View style={styles.weekDays}>
        {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
          <Text key={index} style={styles.weekDayText}>
            {day}
          </Text>
        ))}
      </View>
      <View style={styles.daysGrid}>
        {days.map((day, index) => {
          const dateStr = formatDate(day);
          const hasNote = !!calendarNotes?.[dateStr]?.text;
          const completed = isCompleted(day);
          
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayCell,
                completed && styles.completedDay,
                isSelected(day) && styles.selectedDay,
                hasNote && styles.noteDay,
              ]}
              onPress={() => handleDateClick(day)}
              disabled={!day}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.dayText,
                  completed && styles.completedDayText,
                  isSelected(day) && styles.selectedDayText,
                  hasNote && styles.noteDayText,
                ]}
              >
                {day}
              </Text>
              {completed && (
                <Text style={{ position: "absolute", bottom: 2, fontSize: 8 }}>🐾</Text>
              )}
              {hasNote && (
                <Text style={{ position: "absolute", top: 2, right: 2, fontSize: 8 }}>📝</Text>
              )}
              {/* Show note popup if toggled */}
              {visibleNotes?.[dateStr] && hasNote && (
                <View style={styles.notePopup}>
                  <Text style={styles.notePopupText}>{calendarNotes[dateStr]?.text}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};