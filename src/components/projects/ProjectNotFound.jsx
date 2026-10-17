import { Link } from 'react-router-dom';

export default function ProjectNotFound({
  title = 'Project not found',
  message = 'The project you are looking for does not exist.',
  linkTo = '/projects',
  linkText = 'View all projects',
}) {
  return (
    <main>
      <section className="section section-heading">
        <div className="container">
          <h1>{title}</h1>
          <p>{message}</p>
          <p>
            <Link to={linkTo}>{linkText}</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
