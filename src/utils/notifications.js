import { Alert } from 'react-native';

/**
 * Show a toast-style notification
 * @param {string} message - Message to display
 * @param {string} type - Type of message ('info', 'success', 'error')
 */
export const showToast = (message, type = "info") => {
  const titles = {
    success: "Woof! Success! 🎉",
    error: "Oops! 🐕",
    info: "Pupdate! 🐶",
    warning: "Attention! 🚨"
  };
  
  Alert.alert(titles[type], message, [{ text: "Got it!" }]);
};

/**
 * Show a confirmation dialog
 * @param {string} title - Dialog title
 * @param {string} message - Dialog message
 * @param {Function} onConfirm - Callback for confirm action
 * @param {Function} onCancel - Callback for cancel action
 */
export const showConfirmDialog = (title, message, onConfirm, onCancel) => {
  Alert.alert(
    title,
    message,
    [
      {
        text: "❌ Cancel",
        style: "cancel",
        onPress: onCancel
      },
      {
        text: "✅ Confirm",
        style: "default",
        onPress: onConfirm
      }
    ]
  );
};

/**
 * Show success notification with dog theme
 * @param {string} message - Success message
 */
export const showSuccessToast = (message) => {
  showToast(message, "success");
};

/**
 * Show error notification with dog theme
 * @param {string} message - Error message
 */
export const showErrorToast = (message) => {
  showToast(message, "error");
};

/**
 * Show info notification with dog theme
 * @param {string} message - Info message
 */
export const showInfoToast = (message) => {
  showToast(message, "info");
};

/**
 * Show warning notification with dog theme
 * @param {string} message - Warning message
 */
export const showWarningToast = (message) => {
  showToast(message, "warning");
};

/**
 * Show achievement unlocked notification
 * @param {Object} achievement - Achievement object
 */
export const showAchievementNotification = (achievement) => {
  showToast(
    `🏆 Achievement Unlocked: ${achievement.title}! ${achievement.icon}`,
    "success"
  );
};

/**
 * Show training completion notification
 * @param {string} activityType - Type of activity completed
 * @param {string} activityName - Name of the activity
 */
export const showTrainingCompletionNotification = (activityType, activityName) => {
  const messages = {
    daily: `🎯 Great job completing: ${activityName}!`,
    weekly: `⭐ Week activity completed: ${activityName}!`,
    full_day: `🎉 Amazing! All daily training completed! Your pup is pawsome! 🐕‍🦺`,
    full_week: `🏆 Week complete! Your pup is ready for the next challenge! 🐕‍🦺`
  };
  
  showSuccessToast(messages[activityType] || `✅ Completed: ${activityName}!`);
};

/**
 * Show photo added notification
 */
export const showPhotoAddedNotification = () => {
  showSuccessToast("📸 Pawsome photo added! Your pup is growing! 🐕");
};

/**
 * Show sync notifications
 * @param {string} type - Sync type ('success', 'error', 'started')
 */
export const showSyncNotification = (type) => {
  const messages = {
    success: "🔄 Pack data synced successfully!",
    error: "🌐 Sync failed. Please check your connection.",
    started: "🔄 Syncing with your training pack..."
  };
  
  const notificationType = type === 'error' ? 'error' : type === 'success' ? 'success' : 'info';
  showToast(messages[type], notificationType);
};

/**
 * Show dog info update notification
 */
export const showDogInfoUpdatedNotification = () => {
  showSuccessToast("🐕 Pup info updated successfully!");
};

/**
 * Show pack member notification
 * @param {string} action - Action performed ('added', 'removed', 'updated')
 * @param {string} memberName - Name of the member
 */
export const showPackMemberNotification = (action, memberName = "") => {
  const messages = {
    added: `🎉 New pack member added${memberName ? `: ${memberName}` : ''}!`,
    removed: `👋 Pack member removed${memberName ? `: ${memberName}` : ''}`,
    updated: `👥 Pack member updated${memberName ? `: ${memberName}` : ''}!`
  };
  
  showToast(messages[action], action === 'removed' ? 'info' : 'success');
};

/**
 * Show note notification
 * @param {string} action - Action performed ('added', 'updated', 'shared')
 */
export const showNoteNotification = (action) => {
  const messages = {
    added: "📝 Training note added! Great job keeping track! 🐕",
    updated: "✏️ Note updated!",
    shared: "📝 Note shared with your pack!"
  };
  
  showSuccessToast(messages[action]);
};