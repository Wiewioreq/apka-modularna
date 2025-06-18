import { achievements } from '../constants/achievements';
import { dailyRoutine } from '../constants/dailyRoutine';
import { weeklyPlans } from '../constants/weeklyPlans';

/**
 * Calculate current and best streak from completed daily activities
 * @param {Object} completedDailyByDate - Object with dates as keys and completed activities as values
 * @returns {Object} Object with currentStreak and bestStreak
 */
export const calculateStreak = (completedDailyByDate) => {
  const dates = Object.keys(completedDailyByDate).sort().reverse();
  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 0;

  const today = new Date();

  for (let i = 0; i < dates.length; i++) {
    const date = dates[i];
    const completedTasks = completedDailyByDate[date] || [];
    const allDailyKeys = Object.entries(dailyRoutine).flatMap(([slot, acts]) =>
      acts.map((activity) => `daily-${slot}-${activity}`)
    );

    const isComplete = completedTasks.length >= allDailyKeys.length * 0.8;

    if (isComplete) {
      tempStreak++;
      if (i === 0 || dates[i - 1] === today.toISOString().slice(0, 10)) {
        currentStreak = tempStreak;
      }
    } else {
      bestStreak = Math.max(bestStreak, tempStreak);
      tempStreak = 0;
    }
  }

  bestStreak = Math.max(bestStreak, tempStreak);
  return { currentStreak, bestStreak };
};

/**
 * Check which achievements should be unlocked based on current progress
 * @param {Object} params - Parameters object
 * @param {number} params.currentWeek - Current training week
 * @param {string[]} params.completedActivities - Array of completed activity keys
 * @param {Object} params.completedDailyByDate - Daily completion data
 * @param {Array} params.progressPhotos - Array of progress photos
 * @param {string[]} params.unlockedAchievements - Currently unlocked achievements
 * @returns {string[]} Array of newly unlocked achievement IDs
 */
export const checkNewAchievements = ({
  currentWeek,
  completedActivities,
  completedDailyByDate,
  progressPhotos,
  unlockedAchievements
}) => {
  const newAchievements = [];
  const { currentStreak } = calculateStreak(completedDailyByDate);

  // First week completion
  if (currentWeek >= 1 && !unlockedAchievements.includes("first_week")) {
    newAchievements.push("first_week");
  }

  // Streak achievements
  if (currentStreak >= 7 && !unlockedAchievements.includes("streak_7")) {
    newAchievements.push("streak_7");
  }

  if (currentStreak >= 30 && !unlockedAchievements.includes("streak_30")) {
    newAchievements.push("streak_30");
  }

  // Photo achievement
  if (progressPhotos.length > 0 && !unlockedAchievements.includes("photo_first")) {
    newAchievements.push("photo_first");
  }

  // Daily completion achievement
  const today = new Date().toISOString().slice(0, 10);
  const completedToday = completedDailyByDate[today] || [];
  const allDailyKeys = Object.entries(dailyRoutine).flatMap(([slot, acts]) =>
    acts.map((activity) => `daily-${slot}-${activity}`)
  );

  if (completedToday.length >= allDailyKeys.length && !unlockedAchievements.includes("all_daily")) {
    newAchievements.push("all_daily");
  }

  // Perfect week achievement
  const currentWeekActivities = weeklyPlans[currentWeek] || [];
  const weekCompleted = currentWeekActivities.filter((act) =>
    completedActivities.includes(`${currentWeek}-${act}`)
  );

  if (
    weekCompleted.length === currentWeekActivities.length &&
    currentWeekActivities.length > 0 &&
    !unlockedAchievements.includes("week_perfect")
  ) {
    newAchievements.push("week_perfect");
  }

  // 6 month milestone
  if (currentWeek >= 26 && !unlockedAchievements.includes("month_6")) {
    newAchievements.push("month_6");
  }

  // Full year completion
  if (currentWeek >= 52 && !unlockedAchievements.includes("year_complete")) {
    newAchievements.push("year_complete");
  }

  // Advanced training master
  if (currentWeek >= 26 && !unlockedAchievements.includes("advanced_master")) {
    // Check if advanced training weeks (17-26) are mostly completed
    const advancedWeeks = Array.from({length: 10}, (_, i) => i + 17);
    const advancedCompletionRate = advancedWeeks.reduce((total, week) => {
      const weekActivities = weeklyPlans[week] || [];
      const completed = weekActivities.filter(act => 
        completedActivities.includes(`${week}-${act}`)
      ).length;
      return total + (weekActivities.length > 0 ? completed / weekActivities.length : 0);
    }, 0) / advancedWeeks.length;

    if (advancedCompletionRate >= 0.8) {
      newAchievements.push("advanced_master");
    }
  }

  return newAchievements;
};

/**
 * Get achievement by ID
 * @param {string} achievementId - Achievement ID
 * @returns {Object|null} Achievement object or null if not found
 */
export const getAchievementById = (achievementId) => {
  return achievements.find(achievement => achievement.id === achievementId) || null;
};

/**
 * Calculate overall progress percentage
 * @param {string[]} unlockedAchievements - Array of unlocked achievement IDs
 * @returns {number} Progress percentage (0-100)
 */
export const calculateAchievementProgress = (unlockedAchievements) => {
  return Math.round((unlockedAchievements.length / achievements.length) * 100);
};

/**
 * Get achievements by category/type
 * @param {string} category - Achievement category ('streak', 'completion', 'milestone', etc.)
 * @returns {Array} Array of achievements in the category
 */
export const getAchievementsByCategory = (category) => {
  const categoryMap = {
    streak: ['streak_7', 'streak_30'],
    completion: ['first_week', 'all_daily', 'week_perfect'],
    milestone: ['month_6', 'year_complete', 'advanced_master'],
    photo: ['photo_first'],
  };
  
  const achievementIds = categoryMap[category] || [];
  return achievements.filter(achievement => 
    achievementIds.includes(achievement.id)
  );
};

/**
 * Format achievement notification message
 * @param {Object} achievement - Achievement object
 * @returns {string} Formatted notification message
 */
export const formatAchievementNotification = (achievement) => {
  return `🏆 Achievement Unlocked: ${achievement.title}! ${achievement.icon}`;
};