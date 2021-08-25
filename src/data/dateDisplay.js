/**
 * getDateDisplay() returns a date string for a timestamp
 * @param {int} ts numeric value corresponding to post time (ms)
 * @return {string} date a readable string
 */
export const getDateDisplay = (ts) => {
  const d = new Date(ts);
  return d.toDateString();
};
