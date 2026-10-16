import { useEffect } from 'react';
import { env } from '../config/env';

export default function ProjectsPage() {
  useEffect(() => {
    document.title = `Projects | ${env.appName}`;
  }, []);

  return (
    <main>
      <section className="section section-heading">
        <div className="container">
          <h1>Projects</h1>
          <p>A showcase of selected projects will be implemented in a later phase.</p>
        </div>
      </section>
    </main>
  );
}
