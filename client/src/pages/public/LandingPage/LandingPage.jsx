import { Link } from 'react-router-dom';

import PublicLayout from '../../../layouts/PublicLayout/PublicLayout';

import styles from './LandingPage.module.css';

const audienceGroups = [
  {
    title: 'Startup founders',
    description:
      'Turn your MVP, SaaS, marketplace or mobile app idea into a real product.',
  },
  {
    title: 'Growing businesses',
    description:
      'Build booking systems, portals, dashboards and internal management tools.',
  },
  {
    title: 'Non-technical entrepreneurs',
    description:
      'Create software without finding, hiring and managing developers yourself.',
  },
];

const benefits = [
  'Real developers build your product',
  'Human designers understand your vision',
  'AI accelerates planning and delivery',
  'Transparent progress from start to finish',
  'Senior review and quality assurance',
  'One reliable team for the whole product',
];

const workflow = [
  {
    number: '01',
    title: 'Describe your idea',
    description:
      'Tell Buildly what you want to create in your own words.',
  },
  {
    number: '02',
    title: 'Receive a clear project plan',
    description:
      'AI structures your idea, while a project manager reviews the scope.',
  },
  {
    number: '03',
    title: 'Review your product design',
    description:
      'A real designer improves the generated direction and gathers your feedback.',
  },
  {
    number: '04',
    title: 'Watch your team build it',
    description:
      'Follow milestones, tasks, messages, files and progress in one place.',
  },
];

const LandingPage = () => {
  return (
    <PublicLayout>
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroContent}>
            <span className={styles.eyebrow}>
              Human expertise. AI-powered speed.
            </span>

            <h1>Your Startup Starts Here.</h1>

            <p>
              Buildly transforms your software idea into a real,
              launch-ready product with a dedicated team of designers,
              developers and project experts accelerated by AI.
            </p>

            <div className={styles.heroActions}>
              <Link
                to="/client/projects/new"
                className={styles.primaryButton}
              >
                Start your project
              </Link>

              <a
                href="#how-it-works"
                className={styles.secondaryButton}
              >
                See how it works
              </a>
            </div>

            <div className={styles.heroTrust}>
              <span>No technical knowledge required</span>
              <span>Human-reviewed</span>
              <span>Transparent delivery</span>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.projectWindow}>
              <div className={styles.windowHeader}>
                <div>
                  <span className={styles.smallLabel}>
                    Current project
                  </span>

                  <strong>Fitness Booking App</strong>
                </div>

                <span className={styles.activeBadge}>
                  In progress
                </span>
              </div>

              <div className={styles.progressBlock}>
                <div className={styles.progressHeading}>
                  <span>Overall progress</span>
                  <strong>64%</strong>
                </div>

                <div className={styles.progressTrack}>
                  <span />
                </div>
              </div>

              <div className={styles.stageList}>
                <div className={styles.completedStage}>
                  <span>✓</span>
                  <div>
                    <strong>Planning</strong>
                    <small>Project scope approved</small>
                  </div>
                </div>

                <div className={styles.completedStage}>
                  <span>✓</span>
                  <div>
                    <strong>Design</strong>
                    <small>12 screens approved</small>
                  </div>
                </div>

                <div className={styles.activeStage}>
                  <span>3</span>
                  <div>
                    <strong>Development</strong>
                    <small>8 of 14 tasks completed</small>
                  </div>
                </div>

                <div className={styles.pendingStage}>
                  <span>4</span>
                  <div>
                    <strong>Testing</strong>
                    <small>Waiting for development</small>
                  </div>
                </div>
              </div>

              <div className={styles.teamRow}>
                <div>
                  <span className={styles.smallLabel}>
                    Your Buildly team
                  </span>

                  <div className={styles.avatarList}>
                    <span>PM</span>
                    <span>UX</span>
                    <span>FE</span>
                    <span>BE</span>
                  </div>
                </div>

                <button type="button">Open project</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.audienceSection}>
        <div className="container">
          <div className={styles.sectionHeading}>
            <span>Who Buildly is for</span>

            <h2>
              Software development without building your own
              technical team.
            </h2>
          </div>

          <div className={styles.audienceGrid}>
            {audienceGroups.map(group => (
              <article
                key={group.title}
                className={styles.audienceCard}
              >
                <h3>{group.title}</h3>
                <p>{group.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className={styles.workflowSection}
      >
        <div className="container">
          <div className={styles.sectionHeading}>
            <span>How it works</span>

            <h2>From one idea to a real product.</h2>

            <p>
              Buildly combines automation with human decision-making at
              every important stage.
            </p>
          </div>

          <div className={styles.workflowGrid}>
            {workflow.map(step => (
              <article
                key={step.number}
                className={styles.workflowCard}
              >
                <span>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="benefits"
        className={styles.benefitsSection}
      >
        <div className={`container ${styles.benefitsInner}`}>
          <div className={styles.benefitsCopy}>
            <span>Why Buildly</span>

            <h2>
              More reliable than managing separate freelancers.
            </h2>

            <p>
              You receive one organized process, one project space and
              one accountable team from planning to deployment.
            </p>

            <Link
              to="/client/projects/new"
              className={styles.primaryButton}
            >
              Tell us your idea
            </Link>
          </div>

          <div className={styles.benefitsList}>
            {benefits.map(benefit => (
              <div
                key={benefit}
                className={styles.benefitItem}
              >
                <span>✓</span>
                <p>{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.finalCta}>
        <div className={`container ${styles.finalCtaInner}`}>
          <span>Have a software idea?</span>

          <h2>Let’s turn it into something real.</h2>

          <p>
            Describe what you want to build. Buildly will help organize,
            design and develop it with you.
          </p>

          <Link
            to="/client/projects/new"
            className={styles.lightButton}
          >
            Start your project
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
};

export default LandingPage;