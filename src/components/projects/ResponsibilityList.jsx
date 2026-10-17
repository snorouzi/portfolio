/**
 * Renders the project's responsibilities as a readable list.
 *
 * @param {{ responsibilities: string[] }} props
 */
export default function ResponsibilityList({ responsibilities }) {
  if (!Array.isArray(responsibilities) || responsibilities.length === 0) {
    return null;
  }

  return (
    <ul className="project-responsibility-list">
      {responsibilities.map((item, index) => (
        <li key={item || index} className="project-responsibility-item">
          {item}
        </li>
      ))}
    </ul>
  );
}
