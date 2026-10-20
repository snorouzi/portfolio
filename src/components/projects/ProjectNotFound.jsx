import { useEffect } from 'react';
import { env } from '../../config/env';
import ErrorPage from '../ErrorPage';

export default function ProjectNotFound() {
  useEffect(() => {
    document.title = `Project not found | ${env.appName}`;
  }, []);

  return (
    <ErrorPage
      title="Project Not Found"
      description="This project doesn't exist or may no longer be available. You can explore my other projects instead."
      primaryLabel="View All Projects"
      primaryTo="/projects"
      secondaryLabel="Back to Home"
      secondaryTo="/"
    />
  );
}
