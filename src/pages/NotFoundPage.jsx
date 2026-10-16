import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { env } from '../config/env';

export default function NotFoundPage() {
  useEffect(() => {
    document.title = `Not found | ${env.appName}`;
  }, []);

  return (
    <main>
      <section className="section section-heading">
        <div className="container">
          <h1>Not found</h1>
          <p>The page you are looking for does not exist.</p>
          <p>
            <Link to="/">Return to the homepage</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
