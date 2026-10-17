/**
 * A reusable section heading for the project detail page.
 *
 * @param {{
 *   id: string,
 *   title: string,
 *   subtitle?: string,
 *   className?: string
 * }} props
 */
export default function ProjectSectionHeading({ id, title, subtitle, className }) {
  return (
    <header className={['project-section-heading', className].filter(Boolean).join(' ')}>
      <h2 id={id} className="project-section-title">
        {title}
      </h2>
      {subtitle && <p className="project-section-subtitle">{subtitle}</p>}
    </header>
  );
}
