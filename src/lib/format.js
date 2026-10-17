/**
 * Formats an ISO month/year string like "2024-03" into a readable label.
 * Passes through values such as "Ongoing" unchanged.
 *
 * @param {string | undefined | null} value
 * @returns {string}
 */
export function formatPeriod(value) {
  if (!value) return '';
  const match = /^(\d{4})-(\d{1,2})$/.exec(value.trim());
  if (!match) return value;

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const monthIndex = Number.parseInt(match[2], 10) - 1;
  const month = months[monthIndex];

  return month ? `${month} ${match[1]}` : value;
}
