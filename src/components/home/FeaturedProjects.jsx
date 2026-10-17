import { Link } from 'react-router-dom';
import ProjectCard from '../projects/ProjectCard';
import { getFeaturedProjects } from '../../lib/projectTypes';
import projectsData from '../../data/projects.json';

export default function FeaturedProjects() {
  const featured = getFeaturedProjects(projectsData);

  if (featured.length === 0) {
    return null;
  }

  return (
    <section className="section featured-projects" aria-labelledby="featured-projects-heading">
      <div className="container">
        <header className="section-heading featured-projects-heading">
          <p className="section-eyebrow">SELECTED WORK</p>
          <h2 id="featured-projects-heading" className="section-heading-title">
            Featured Projects
          </h2>
          <p className="section-heading-sub">
            A selection of backend systems I've built and the engineering challenges I've worked on.
          </p>
        </header>

        <div className="featured-projects-grid">
          {featured.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        <div className="featured-projects-footer">
          <Link to="/projects" className="hero-link hero-link-secondary featured-projects-link">
            Explore All Projects
          </Link>
        </div>
      </div>
    </section>
  );
}
