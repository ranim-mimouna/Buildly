import { useState } from 'react';

import { motion, useReducedMotion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

import styles from './FinalCTASection.module.css';

const projectTypes = [
  'Web application',
  'Mobile application',
  'SaaS platform',
  'Marketplace',
  'Internal tool',
  'AI-powered product',
];

const trustPoints = [
  'No technical brief required',
  'Clear scope and next steps',
  'Human team supported by AI',
];

const ArrowIcon = () => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 12H19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <path
        d="M13 6L19 12L13 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const CheckIcon = () => {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 12.5L9.2 16.5L19 7"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const SparkIcon = () => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5L12 3Z"
        fill="currentColor"
      />

      <path
        d="M19 15L19.7 17.3L22 18L19.7 18.7L19 21L18.3 18.7L16 18L18.3 17.3L19 15Z"
        fill="currentColor"
      />
    </svg>
  );
};

const MessageIcon = () => {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 5H19V15H10L6 19V15H5V5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />

      <path
        d="M8 9H16"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      <path
        d="M8 12H13"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
};

const FinalCTASection = () => {
  const [projectType, setProjectType] = useState('');
  const [idea, setIdea] = useState('');

  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();

  const handleSubmit = event => {
    event.preventDefault();

    navigate('/client/projects/new', {
      state: {
        projectType,
        idea,
      },
    });
  };

  return (
    <section
      id="start-project"
      className={styles.section}
    >
      <div className={styles.background} aria-hidden="true">
        <div className={styles.backgroundGrid} />
        <div className={styles.glowOne} />
        <div className={styles.glowTwo} />
        <div className={styles.orbitOne} />
        <div className={styles.orbitTwo} />
      </div>

      <div className={`container ${styles.container}`}>
        <motion.div
          className={styles.ctaPanel}
          initial={{
            opacity: 0,
            y: prefersReducedMotion ? 0 : 35,
            scale: prefersReducedMotion ? 1 : 0.985,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          viewport={{
            once: true,
            amount: 0.25,
          }}
          transition={{
            duration: 0.75,
          }}
        >
          <div className={styles.copyColumn}>
            <div>
              <span className={styles.eyebrow}>
                <SparkIcon />
                Start with your idea
              </span>

              <h2>
                You do not need to know how to build it.
                <span> You only need to describe it.</span>
              </h2>

              <p>
                Tell Buildly what you want to create. We will
                help turn your idea into a clear product plan,
                realistic scope and working digital product.
              </p>
            </div>

            <div className={styles.trustList}>
              {trustPoints.map(point => (
                <div key={point}>
                  <span>
                    <CheckIcon />
                  </span>

                  <strong>{point}</strong>
                </div>
              ))}
            </div>

            <div className={styles.teamPreview}>
              <div className={styles.avatarStack}>
                <span>PM</span>
                <span>UX</span>
                <span>DEV</span>
                <span>AI</span>
              </div>

              <div>
                <strong>A real team supports every project</strong>

                <span>
                  Product, design, development and AI-assisted
                  delivery.
                </span>
              </div>
            </div>
          </div>

          <div className={styles.formColumn}>
            <div className={styles.formHeader}>
              <div className={styles.formIcon}>
                <MessageIcon />
              </div>

              <div>
                <span>New project request</span>
                <strong>What would you like to build?</strong>
              </div>

              <span className={styles.stepBadge}>Step 1</span>
            </div>

            <form
              className={styles.form}
              onSubmit={handleSubmit}
            >
              <label className={styles.field}>
                <span>Project type</span>

                <select
                  value={projectType}
                  onChange={event =>
                    setProjectType(event.target.value)
                  }
                >
                  <option value="">
                    Choose the closest option
                  </option>

                  {projectTypes.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </label>

              <label className={styles.field}>
                <span>Describe your idea</span>

                <textarea
                  value={idea}
                  onChange={event => setIdea(event.target.value)}
                  placeholder="For example: I want a platform where training centres can manage classes, attendance, payments and communication..."
                  rows="6"
                />
              </label>

              <div className={styles.examplePrompt}>
                <span>
                  <SparkIcon />
                </span>

                <p>
                  A few sentences are enough. You can refine the
                  details together with the Buildly team later.
                </p>
              </div>

              <button
                type="submit"
                className={styles.submitButton}
              >
                Continue with your project
                <ArrowIcon />
              </button>

              <p className={styles.formNote}>
                You can continue even if your idea is still
                incomplete.
              </p>
            </form>

            <div className={styles.formProgress}>
              <span className={styles.activeProgress} />
              <span />
              <span />
              <span />
            </div>
          </div>
        </motion.div>

        <motion.div
          className={styles.bottomMessage}
          initial={{
            opacity: 0,
            y: prefersReducedMotion ? 0 : 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.5,
          }}
          transition={{
            duration: 0.55,
            delay: 0.15,
          }}
        >
          <span>Your idea does not need to be perfect.</span>

          <strong>
            It only needs a place to begin.
          </strong>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTASection;