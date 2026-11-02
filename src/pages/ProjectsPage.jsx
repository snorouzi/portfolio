import { useEffect, useState } from 'react';
import ProjectCard from '../components/projects/ProjectCard';
import { env } from '../config/env';
import projectsData from '../data/projects.json';
import { getProjectsByCategory } from '../lib/projectTypes';

const INITIAL_DISPLAY = 3;

const SECTION_CONFIG = [
  {
    category: 'professional',
    heading: 'Professional Projects',
    subtitle: 'Backend systems and platforms I have built and shipped in professional roles.',
  },
  {
    category: 'personal',
    heading: 'Personal Projects',
    subtitle: 'Side projects and experiments I work on in my own time.',
  },
];

/**
 * Renders a single project category section with progressive disclosure.
 * Each section keeps its own independent visibility counter.
 *
 * @param {{
 *   heading: string,
 *   subtitle: string,
 *   projects: import('../lib/projectTypes').Project[],
 * }} props
 */
function ProjectCategorySection({ heading, subtitle, projects }) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_DISPLAY);
  const hasMore = projects.length > visibleCount;
  const visible = projects.slice(0, visibleCount);

  if (projects.length === 0) {
    return null;
  }

  return (
    <section
      className="section projects-section"
      aria-labelledby={`projects-${heading.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="container">
        <header className="projects-section-heading">
          <h2
            id={`projects-${heading.toLowerCase().replace(/\s+/g, '-')}`}
            className="projects-section-title"
          >
            {heading}
          </h2>
          {subtitle && <p className="projects-section-sub">{subtitle}</p>}
        </header>

        <div className="projects-grid">
          {visible.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {hasMore && (
          <div className="projects-show-more">
            <button
              type="button"
              className="button"
              onClick={() => setVisibleCount((count) => count + INITIAL_DISPLAY)}
            >
              Show More
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default function ProjectsPage() {
  useEffect(() => {
    document.title = `Projects | ${env.appName}`;
  }, []);

  return (
    <main>
      <section className="section section-heading">
        <div className="container">
          <p className="section-eyebrow">MY WORK</p>
          <h1 className="section-heading-title">Projects</h1>
          <p className="section-heading-sub">
            A collection of backend systems and applications I've worked on, from scalable APIs to
            distributed services.
          </p>
        </div>
      </section>

      <section className="section projects-listing">
        <div className="container">
          {SECTION_CONFIG.map(({ category, heading, subtitle }) => (
            <ProjectCategorySection
              key={category}
              heading={heading}
              subtitle={subtitle}
              projects={getProjectsByCategory(projectsData, category)}
            />
          ))}

          {projectsData.length === 0 && (
            <p className="projects-empty">No projects to display yet.</p>
          )}
        </div>
      </section>
    </main>
  );
}
