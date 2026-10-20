/**
 * Pure helpers for the About page contribution calendars.
 *
 * The module turns the raw JSON exports into calendar-ready structures
 * (weeks, month labels, intensity levels, yearly totals) and knows nothing
 * about React, so the presentation layer stays declarative.
 */

const MS_PER_DAY = 86400000;
const DAYS_PER_WEEK = 7;

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/**
 * @param {string} isoDate
 * @returns {number} UTC timestamp for the given calendar date
 */
function toTimestamp(isoDate) {
  const [year, month, day] = isoDate.split('-').map(Number);
  return Date.UTC(year, month - 1, day);
}

/**
 * @param {number} timestamp
 * @returns {string} "YYYY-MM-DD"
 */
function toIsoDate(timestamp) {
  return new Date(timestamp).toISOString().slice(0, 10);
}

/**
 * @param {string} isoDate
 * @returns {string} Human readable date, e.g. "Feb 26, 2026"
 */
function formatIsoDate(isoDate) {
  const [year, month, day] = isoDate.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return date.toLocaleDateString('en-US', {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * @param {number[]} sortedValues
 * @param {number} q
 * @returns {number} Linear-interpolated quantile of an ascending list
 */
function quantile(sortedValues, q) {
  if (sortedValues.length === 0) return 0;

  const position = (sortedValues.length - 1) * q;
  const lower = Math.floor(position);
  const rest = position - lower;
  const upper = sortedValues[lower + 1];

  return upper === undefined ? sortedValues[lower] : sortedValues[lower] + rest * (upper - sortedValues[lower]);
}

/**
 * Builds the intensity thresholds for a single data source.
 *
 * Each source gets its own scale because the two activity distributions are
 * not comparable: a GitHub day and a company day are not the same unit of work.
 *
 * @param {number[]} counts
 * @returns {{ thresholds: number[], max: number }}
 */
export function computeIntensityScale(counts) {
  const nonZero = counts.filter((count) => count > 0).sort((a, b) => a - b);

  if (nonZero.length === 0) {
    return { thresholds: [0, 0, 0], max: 0 };
  }

  return {
    thresholds: [
      quantile(nonZero, 0.25),
      quantile(nonZero, 0.5),
      quantile(nonZero, 0.75),
    ],
    max: nonZero[nonZero.length - 1],
  };
}

/**
 * @param {number} count
 * @param {number[]} thresholds
 * @returns {number} 0 (no activity) to 4 (highest intensity)
 */
export function intensityLevel(count, thresholds) {
  if (!count || count <= 0) return 0;
  if (count <= thresholds[0]) return 1;
  if (count <= thresholds[1]) return 2;
  if (count <= thresholds[2]) return 3;
  return 4;
}

/**
 * @param {number} count
 * @param {string} isoDate
 * @returns {string}
 */
export function describeDay(count, isoDate) {
  const date = formatIsoDate(isoDate);

  if (count === 0) {
    return `No contributions on ${date}`;
  }

  return `${count} contribution${count === 1 ? '' : 's'} on ${date}`;
}

/**
 * @param {{ date: string, count: number }[]} days
 * @returns {[string, number][]} Yearly totals, ascending by year
 */
export function totalsByYear(days) {
  const totals = new Map();

  for (const day of days) {
    const year = day.date.slice(0, 4);
    totals.set(year, (totals.get(year) ?? 0) + day.count);
  }

  return [...totals.entries()].sort(([a], [b]) => a.localeCompare(b));
}

/**
 * Normalises the GitHub export into calendar days.
 *
 * The exported `level` field is relative to each calendar year (the same count
 * maps to different levels in different years), so it cannot drive a single
 * continuous grid. Intensity is derived from the actual counts instead.
 *
 * @param {{ total?: Record<string, number>, contributions?: Array<{ date: string, count: number }> }} source
 * @returns {{ days: { date: string, count: number }[], totals: [string, number][], total: number, thresholds: number[], max: number, start: string, end: string }}
 */
export function parseGitHubContributions(source) {
  const entries = Array.isArray(source?.contributions) ? source.contributions : [];

  const days = entries
    .filter((entry) => ISO_DATE_PATTERN.test(entry?.date ?? ''))
    .map((entry) => ({ date: entry.date, count: Number(entry.count) || 0 }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return summarizeDays(days);
}

/**
 * Normalises the company export (a date-to-count object) into calendar days.
 *
 * @param {Record<string, number>} source
 * @returns {{ days: { date: string, count: number }[], totals: [string, number][], total: number, thresholds: number[], max: number, start: string, end: string }}
 */
export function parseCompanyContributions(source) {
  const entries = Object.entries(source ?? {})
    .filter(([date]) => ISO_DATE_PATTERN.test(date))
    .map(([date, count]) => ({ date, count: Number(count) || 0 }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return summarizeDays(entries);
}

/**
 * @param {{ date: string, count: number }[]} days
 * @returns {{ days: { date: string, count: number }[], totals: [string, number][], total: number, thresholds: number[], max: number, start: string, end: string }}
 */
function summarizeDays(days) {
  const counts = days.map((day) => day.count);
  const { thresholds, max } = computeIntensityScale(counts);

  return {
    days,
    totals: totalsByYear(days),
    total: counts.reduce((sum, count) => sum + count, 0),
    thresholds,
    max,
    start: days.length > 0 ? days[0].date : '',
    end: days.length > 0 ? days[days.length - 1].date : '',
  };
}

/**
 * Builds a week-based calendar grid.
 *
 * Weeks start on Sunday and every week produces seven cells. Days outside the
 * exported range are marked as `inRange: false` and are rendered as empty
 * placeholders, so a gap in the source data is never shown as activity.
 *
 * @param {{ date: string, count: number }[]} days
 * @param {string} startDate
 * @param {string} endDate
 * @returns {{ days: { date: string, count: number, inRange: boolean }[], monthLabel: string | null }[]}
 */
export function buildCalendarWeeks(days, startDate, endDate) {
  if (!startDate || !endDate) return [];

  const countByDate = new Map(days.map((day) => [day.date, day.count]));
  const startTimestamp = toTimestamp(startDate);
  const endTimestamp = toTimestamp(endDate);

  const gridStart =
    startTimestamp - new Date(startTimestamp).getUTCDay() * MS_PER_DAY;
  const gridEnd = endTimestamp + (DAYS_PER_WEEK - 1 - new Date(endTimestamp).getUTCDay()) * MS_PER_DAY;

  const weeks = [];
  let lastLabeledMonth = null;

  for (let timestamp = gridStart; timestamp <= gridEnd; timestamp += DAYS_PER_WEEK * MS_PER_DAY) {
    const weekDays = [];

    for (let dayIndex = 0; dayIndex < DAYS_PER_WEEK; dayIndex += 1) {
      const dayTimestamp = timestamp + dayIndex * MS_PER_DAY;
      const date = toIsoDate(dayTimestamp);
      const inRange = dayTimestamp >= startTimestamp && dayTimestamp <= endTimestamp;

      weekDays.push({
        date,
        count: inRange ? (countByDate.get(date) ?? 0) : 0,
        inRange,
      });
    }

    const monthStart = weekDays.find((day) => day.inRange && day.date.endsWith('-01'));
    let monthLabel = null;

    if (monthStart) {
      const monthKey = monthStart.date.slice(0, 7);

      if (monthKey !== lastLabeledMonth) {
        monthLabel = MONTH_LABELS[Number(monthStart.date.slice(5, 7)) - 1];
        lastLabeledMonth = monthKey;
      }
    } else if (weeks.length === 0) {
      monthLabel = MONTH_LABELS[Number(startDate.slice(5, 7)) - 1];
      lastLabeledMonth = startDate.slice(0, 7);
    }

    weeks.push({ days: weekDays, monthLabel });
  }

  return weeks;
}

/**
 * @param {{ date: string, count: number }[]} days
 * @returns {number} Number of days that recorded any activity
 */
export function activeDayCount(days) {
  return days.reduce((total, day) => (day.count > 0 ? total + 1 : total), 0);
}

export { WEEKDAY_LABELS, MONTH_LABELS, formatIsoDate };
