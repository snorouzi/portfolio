import { useEffect } from 'react';
import { env } from '../config/env';
import ErrorPage from '../components/ErrorPage';

export default function NotFoundPage() {
  useEffect(() => {
    document.title = `Page not found | ${env.appName}`;
  }, []);

  return (
    <ErrorPage
      title="Page Not Found"
      description="The page you're looking for doesn't exist or may have been moved. Let's get you back on track."
      primaryLabel="Back to Home"
      primaryTo="/"
      secondaryLabel="Explore Projects"
      secondaryTo="/projects"
    />
  );
}
