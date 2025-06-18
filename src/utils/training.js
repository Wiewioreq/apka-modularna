import { weeklyPlans } from '../constants/weeklyPlans';
import { dailyRoutine } from '../constants/dailyRoutine';
import { trainingStages, getCurrentStage } from '../constants/trainingStages';

/**
 * Calculate completion rate for a specific week
 * @param {number} week - Week number
 * @param {string[]} completedActivities - Array of completed activity keys
 * @returns {number} Completion rate (0-1)
 */
export const calculateWeekCompletionRate = (week, completedActivities) => {
  const weekActivities = weeklyPlans[week] || [];
  if (weekActivities.length === 0) return 0;
  
  const completed = weekActivities.filter(activity =>
    completedActivities.includes(`${week}-${activity}`)
  ).length;
  
  return completed / weekActivities.length;
};

/**
 * Calculate daily completion rate for a specific date
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {Object} completedDailyByDate - Daily completion data
 * @returns {number} Completion rate (0-1)
 */
export const calculateDailyCompletionRate = (date, completedDailyByDate) => {
  const completedToday = completedDailyByDate[date] || [];
  const allDailyKeys = Object.entries(dailyRoutine).flatMap(([slot, acts]) =>
    acts.map((activity) => `daily-${slot}-${activity}`)
  );
  
  return allDailyKeys.length > 0 ? completedToday.length / allDailyKeys.length : 0;
};

/**
 * Get training stage information for a week
 * @param {number} week - Week number
 * @returns {Object} Training stage object
 */
export const getTrainingStageInfo = (week) => {
  const stageNumber = getCurrentStage(week);
  return trainingStages[stageNumber] || trainingStages[1];
};

/**
 * Check if a week is completed
 * @param {number} week - Week number
 * @param {string[]} completedActivities - Array of completed activity keys
 * @returns {boolean} True if week is completed
 */
export const isWeekCompleted = (week, completedActivities) => {
  const completionRate = calculateWeekCompletionRate(week, completedActivities);
  return completionRate >= 1.0;
};

/**
 * Check if a day is completed
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {Object} completedDailyByDate - Daily completion data
 * @param {number} threshold - Completion threshold (0-1), default 0.8
 * @returns {boolean} True if day is completed
 */
export const isDayCompleted = (date, completedDailyByDate, threshold = 0.8) => {
  const completionRate = calculateDailyCompletionRate(date, completedDailyByDate);
  return completionRate >= threshold;
};

/**
 * Get all activities for a specific week
 * @param {number} week - Week number
 * @returns {string[]} Array of activities for the week
 */
export const getWeekActivities = (week) => {
  return weeklyPlans[week] || [];
};

/**
 * Get all daily routine activities
 * @returns {Object} Daily routine object with time slots and activities
 */
export const getDailyActivities = () => {
  return dailyRoutine;
};

/**
 * Calculate overall training progress
 * @param {number} currentWeek - Current week number
 * @param {string[]} completedActivities - Array of completed activity keys
 * @param {Object} completedDailyByDate - Daily completion data
 * @returns {Object} Progress statistics
 */
export const calculateOverallProgress = (currentWeek, completedActivities, completedDailyByDate) => {
  // Weekly progress
  const weeksCompleted = [];
  for (let week = 1; week <= currentWeek; week++) {
    if (isWeekCompleted(week, completedActivities)) {
      weeksCompleted.push(week);
    }
  }
  
  // Daily progress (last 30 days)
  const daysCompleted = [];
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().slice(0, 10);
    
    if (isDayCompleted(dateStr, completedDailyByDate)) {
      daysCompleted.push(dateStr);
    }
  }
  
  // Current week progress
  const currentWeekRate = calculateWeekCompletionRate(currentWeek, completedActivities);
  
  // Today's progress
  const today_str = today.toISOString().slice(0, 10);
  const todayRate = calculateDailyCompletionRate(today_str, completedDailyByDate);
  
  return {
    weeksCompleted: weeksCompleted.length,
    totalWeeks: currentWeek,
    weeklyCompletionRate: currentWeek > 0 ? weeksCompleted.length / currentWeek : 0,
    currentWeekRate,
    daysCompleted: daysCompleted.length,
    dailyCompletionRate: daysCompleted.length / 30,
    todayRate,
    currentStage: getCurrentStage(currentWeek),
  };
};

/**
 * Get next incomplete activity for current week
 * @param {number} week - Week number
 * @param {string[]} completedActivities - Array of completed activity keys
 * @returns {string|null} Next incomplete activity or null
 */
export const getNextIncompleteActivity = (week, completedActivities) => {
  const weekActivities = getWeekActivities(week);
  
  for (const activity of weekActivities) {
    if (!completedActivities.includes(`${week}-${activity}`)) {
      return activity;
    }
  }
  
  return null;
};

/**
 * Get training recommendations based on progress
 * @param {Object} progressData - Progress data object
 * @returns {string[]} Array of recommendation strings
 */
export const getTrainingRecommendations = (progressData) => {
  const recommendations = [];
  const { currentWeekRate, todayRate, currentStage } = progressData;
  
  // Weekly recommendations
  if (currentWeekRate < 0.3) {
    recommendations.push("🎯 Focus on completing this week's training goals");
  } else if (currentWeekRate > 0.8) {
    recommendations.push("⭐ Great progress this week! Keep up the excellent work");
  }
  
  // Daily recommendations
  if (todayRate < 0.5) {
    recommendations.push("🌅 Consider starting with morning activities to build momentum");
  } else if (todayRate === 1) {
    recommendations.push("🎉 Perfect day! Your pup is learning so much");
  }
  
  // Stage-specific recommendations
  if (currentStage === 1) {
    recommendations.push("🐶 Puppy stage: Keep sessions short and positive");
  } else if (currentStage === 2) {
    recommendations.push("🎓 Basic training: Consistency is key for building habits");
  } else if (currentStage >= 3) {
    recommendations.push("🏆 Advanced training: Challenge your pup with complex tasks");
  }
  
  return recommendations;
};