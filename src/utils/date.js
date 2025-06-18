export const getCurrentDate = () => new Date().toISOString().slice(0, 10);
export const getCurrentTime = () => new Date().toTimeString().slice(0, 8);

export const isValidDate = (dateString) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return false;
  const date = new Date(dateString + "T00:00:00.000Z");
  return !isNaN(date) && dateString === date.toISOString().slice(0, 10);
};