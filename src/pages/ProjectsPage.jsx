import { useEffect } from 'react';
import ProjectCard from '../components/projects/ProjectCard';
import { env } from '../config/env';
import projectsData from '../data/projects.json';

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
          {projectsData.length === 0 ? (
            <p className="projects-empty">No projects to display yet.</p>
          ) : (
            <div className="projects-grid">
              {projectsData.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
