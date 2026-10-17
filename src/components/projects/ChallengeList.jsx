/**
 * @typedef {{ title: string, problem: string, approach: string }} ProjectChallenge
 */

/**
 * Renders the project's technical challenges as readable prose blocks.
 *
 * @param {{ challenges: ProjectChallenge[] }} props
 */
export default function ChallengeList({ challenges }) {
  if (!Array.isArray(challenges) || challenges.length === 0) {
    return null;
  }

  return (
    <ol className="project-challenge-list">
      {challenges.map((challenge, index) => (
        <li key={challenge.title || index} className="project-challenge-item">
          <h3 className="project-challenge-title">{challenge.title}</h3>

          {challenge.problem && (
            <p className="project-challenge-problem">
              <span className="project-challenge-label">Problem</span>
              <span className="project-challenge-text">{challenge.problem}</span>
            </p>
          )}

          {challenge.approach && (
            <p className="project-challenge-approach">
              <span className="project-challenge-label">Approach</span>
              <span className="project-challenge-text">{challenge.approach}</span>
            </p>
          )}
        </li>
      ))}
    </ol>
  );
}
