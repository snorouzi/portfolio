import { WEEKDAY_LABELS, describeDay, intensityLevel } from '../../lib/contributions';

const VISIBLE_WEEKDAY_ROWS = new Set([1, 3, 5]);
const LEGEND_LEVELS = [0, 1, 2, 3, 4];

/**
 * Renders one GitHub-style contribution calendar.
 *
 * The component is purely presentational: the week grid, the intensity scale
 * and the totals are prepared by the parent so both calendars share exactly
 * the same visual language.
 */
export default function ContributionCalendar({
  title,
  badge,
  description,
  caption,
  weeks,
  thresholds,
  totals = [],
  selectedYear,
  onYearSelect,
  totalLabel,
  total,
  note,
}) {
  if (weeks.length === 0) {
    return (
      <article className="contribution-block">
        {(title || badge) && (
          <div className="contribution-block-header">
            {title && <h3 className="contribution-title">{title}</h3>}
            {badge && <span className="contribution-badge">{badge}</span>}
          </div>
        )}
        {description && <p className="contribution-description">{description}</p>}
        <p className="contribution-note">No contribution data is available for this source yet.</p>
      </article>
    );
  }

  return (
    <article className="contribution-block">
      {(title || badge) && (
        <div className="contribution-block-header">
          {title && <h3 className="contribution-title">{title}</h3>}
          {badge && <span className="contribution-badge">{badge}</span>}
        </div>
      )}

      {description && <p className="contribution-description">{description}</p>}

      <div
        className="contribution-calendar-scroll"
        role="region"
        aria-label={caption}
        tabIndex={0}
      >
        <table className="contribution-calendar">
          <caption className="visually-hidden">{caption}</caption>
          <thead>
            <tr>
              <th scope="col" className="contribution-calendar-corner">
                <span className="visually-hidden">Weekday</span>
              </th>
              {weeks.map((week, weekIndex) => (
                <th scope="col" className="contribution-calendar-month" key={weekIndex}>
                  {week.monthLabel && <span>{week.monthLabel}</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {WEEKDAY_LABELS.map((weekday, rowIndex) => (
              <tr key={weekday}>
                <th scope="row" className="contribution-calendar-weekday">
                  {VISIBLE_WEEKDAY_ROWS.has(rowIndex) ? (
                    weekday
                  ) : (
                    <span className="visually-hidden">{weekday}</span>
                  )}
                </th>
                {weeks.map((week, weekIndex) => {
                  const day = week.days[rowIndex];

                  if (!day.inRange) {
                    return (
                      <td className="contribution-calendar-cell" key={weekIndex}>
                        <span className="contribution-cell is-empty" aria-hidden="true" />
                      </td>
                    );
                  }

                  const label = describeDay(day.count, day.date);
                  const level = intensityLevel(day.count, thresholds);

                  return (
                    <td className="contribution-calendar-cell" key={weekIndex}>
                      <span className={`contribution-cell level-${level}`} title={label}>
                        <span className="visually-hidden">{label}</span>
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="contribution-meta">
        {totals.length > 0 ? (
          <ul className="contribution-totals">
            {totals.map(([year, value]) => (
              <li className="contribution-total" key={year}>
                {onYearSelect ? (
                  <button
                    className="contribution-total-button"
                    type="button"
                    aria-pressed={selectedYear === year}
                    aria-label={`Show ${year} contributions: ${value.toLocaleString('en-US')} commits`}
                    onClick={() => onYearSelect(year)}
                  >
                    <span className="contribution-total-year">{year}</span>
                    <span className="contribution-total-value">{value.toLocaleString('en-US')}</span>
                  </button>
                ) : (
                  <>
                    <span className="contribution-total-year">{year}</span>
                    <span className="contribution-total-value">{value.toLocaleString('en-US')}</span>
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : (
          totalLabel && (
            <p className="contribution-total-summary">
              {totalLabel} <b>{total.toLocaleString('en-US')}</b>
            </p>
          )
        )}

        <p className="contribution-legend">
          <span>Less</span>
          {LEGEND_LEVELS.map((level) => (
            <span className={`contribution-cell level-${level}`} key={level} aria-hidden="true" />
          ))}
          <span>More</span>
        </p>
      </div>

      {note && <p className="contribution-note">{note}</p>}
    </article>
  );
}
