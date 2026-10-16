import { useEffect } from 'react';
import { env } from '../config/env';

export default function AboutPage() {
  useEffect(() => {
    document.title = `About | ${env.appName}`;
  }, []);

  return (
    <main>
      <section className="section section-heading">
        <div className="container">
          <h1>About</h1>
          <p>About content will be added in a later phase.</p>
        </div>
      </section>
    </main>
  );
}
