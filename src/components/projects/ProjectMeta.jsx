import { formatPeriod } from '../../lib/format';

/**
 * Renders understated project metadata (role, period).
 * Missing fields are omitted without leaving awkward gaps.
 *
 * @param {{ project: import('../../lib/projectTypes').Project }} props
 */
export default function ProjectMeta({ project }) {
  const items = [];

  if (project.organization?.trim()) {
    items.push({ key: 'organization', label: 'Organization', value: project.organization.trim() });
  }

  if (project.role?.trim()) {
    items.push({ key: 'role', label: 'Role', value: project.role.trim() });
  }

  const period = project.period || {};
  const start = formatPeriod(period.start);
  const end = formatPeriod(period.end);
  if (start || end) {
    items.push({
      key: 'period',
      label: 'Period',
      value: [start, end].filter(Boolean).join(' – '),
    });
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <dl className="project-meta">
      {items.map((item) => (
        <div key={item.key} className="project-meta-item">
          <dt className="project-meta-label">{item.label}</dt>
          <dd className="project-meta-value">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
