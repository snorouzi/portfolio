import { useEffect } from 'react';
import { env } from '../config/env';
import Hero from '../components/home/Hero';

export default function HomePage() {
  useEffect(() => {
    document.title = `Saeed Norouzi | ${env.appName}`;

    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        'content',
        'Saeed Norouzi — Senior Backend Developer specializing in NestJS, TypeScript, and scalable backend systems.'
      );
    }
  }, []);

  return <Hero />;
}
