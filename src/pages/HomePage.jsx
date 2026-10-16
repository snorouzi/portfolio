import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { env } from '../config/env';

export default function HomePage() {
  useEffect(() => {
    document.title = `Home | ${env.appName}`;
  }, []);

  return (
    <main>
      <section className="section section-heading">
        <div className="container">
          <h1>Home</h1>
          <p>
            This is the foundation of the portfolio. The landing content will be added in a later
            phase.
          </p>
          <p>
            Use the navigation to explore the <Link to="/projects">Projects</Link> and{' '}
            <Link to="/about">About</Link> pages.
          </p>
        </div>
      </section>
    </main>
  );
}
