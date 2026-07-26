import { motion, useReducedMotion } from 'motion/react';

import styles from './WhyShipPilotSection.module.css';

const benefits = [
  {
    number: '01',
    title: 'Human expertise, enhanced by AI',
    description:
      'Real product managers, designers and developers lead every project. AI helps the team move faster, explore options and reduce repetitive work.',
    icon: 'human',
  },
  {
    number: '02',
    title: 'Clear from the beginning',
    description:
      'You understand the scope, priorities, timeline and next steps before development becomes complicated or expensive.',
    icon: 'clarity',
  },
  {
    number: '03',
    title: 'Complete project visibility',
    description:
      'Follow milestones, tasks, decisions, approvals and progress from one workspace instead of chasing updates across different tools.',
    icon: 'visibility',
  },
  {
    number: '04',
    title: 'Direct access to your team',
    description:
      'Communicate with the people building your product, share feedback and make decisions without layers of unnecessary account management.',
    icon: 'communication',
  },
];

const comparisonRows = [
  {
    label: 'Project planning',
    traditional: 'Unclear estimates and long discovery phases',
    shipPilot: 'Structured scope, priorities and milestones',
  },
  {
    label: 'Communication',
    traditional: 'Updates filtered through multiple contacts',
    shipPilot: 'Direct communication with your delivery team',
  },
  {
    label: 'Progress visibility',
    traditional: 'Occasional reports and status meetings',
    shipPilot: 'Live progress, tasks, approvals and decisions',
  },
  {
    label: 'AI usage',
    traditional: 'Added as a trend or used without transparency',
    shipPilot: 'Used intentionally to support human expertise',
  },
  {
    label: 'Flexibility',
    traditional: 'Changes create delays and unexpected costs',
    shipPilot: 'Priorities can evolve through a visible process',
  },
];

const metrics = [
  {
    value: '100%',
    label: 'Project visibility',
  },
  {
    value: '1',
    label: 'Shared workspace',
  },
  {
    value: '0',
    label: 'Technical knowledge required',
  },
  {
    value: '24/7',
    label: 'Progress access',
  },
];

const CheckIcon = () => {
  return (
    <svg
      width="15"
      height="15"
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

const HumanIcon = () => {
  return (
    <svg
      width="27"
      height="27"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="9"
        cy="8"
        r="3"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M3.5 18C3.5 14.9624 5.96243 12.5 9 12.5C12.0376 12.5 14.5 14.9624 14.5 18"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      <path
        d="M17.5 6L18.2 8.3L20.5 9L18.2 9.7L17.5 12L16.8 9.7L14.5 9L16.8 8.3L17.5 6Z"
        fill="currentColor"
      />
    </svg>
  );
};

const ClarityIcon = () => {
  return (
    <svg
      width="27"
      height="27"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="4"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M8 9H16"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      <path
        d="M8 13H13"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      <path
        d="M8 17H11"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
};

const VisibilityIcon = () => {
  return (
    <svg
      width="27"
      height="27"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3.5 12C5.5 8.5 8.3 6.5 12 6.5C15.7 6.5 18.5 8.5 20.5 12C18.5 15.5 15.7 17.5 12 17.5C8.3 17.5 5.5 15.5 3.5 12Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />

      <circle
        cx="12"
        cy="12"
        r="2.5"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
};

const CommunicationIcon = () => {
  return (
    <svg
      width="27"
      height="27"
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

const BenefitIcon = ({ icon }) => {
  if (icon === 'human') {
    return <HumanIcon />;
  }

  if (icon === 'clarity') {
    return <ClarityIcon />;
  }

  if (icon === 'visibility') {
    return <VisibilityIcon />;
  }

  return <CommunicationIcon />;
};

const WhyShipPilotSection = () => {
  const prefersReducedMotion = useReducedMotion();

  const reveal = {
    hidden: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : 28,
    },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <section
      id="why-shippilot"
      className={styles.section}
    >
      <div className={styles.background} aria-hidden="true">
        <div className={styles.backgroundGrid} />
        <div className={styles.backgroundGlowOne} />
        <div className={styles.backgroundGlowTwo} />
      </div>

      <div className={`container ${styles.container}`}>
        <motion.header
          className={styles.sectionHeader}
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.4,
          }}
          transition={{
            duration: 0.65,
          }}
        >
          <div>
            <span className={styles.eyebrow}>
              Why ShipPilot
            </span>

            <h2>
              Your idea deserves more than a{' '}
              <span>black box.</span>
            </h2>
          </div>

          <p>
            ShipPilot gives non-technical founders and businesses
            a clear, collaborative way to build software with a
            real team supported by responsible AI.
          </p>
        </motion.header>

        <div className={styles.comparisonSection}>
          <motion.div
            className={styles.comparisonIntro}
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.35,
            }}
            transition={{
              duration: 0.6,
            }}
          >
            <span>Traditional development</span>

            <h3>
              Building software should not require blind trust.
            </h3>

            <p>
              You should always understand what is being built,
              why it matters, what happens next and where your
              investment is going.
            </p>

            <div className={styles.introBadge}>
              <SparkIcon />

              <span>
                ShipPilot keeps humans responsible for every
                important decision.
              </span>
            </div>
          </motion.div>

          <motion.div
            className={styles.comparisonTable}
            initial={{
              opacity: 0,
              x: prefersReducedMotion ? 0 : 35,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.25,
            }}
            transition={{
              duration: 0.7,
            }}
          >
            <div className={styles.comparisonHeader}>
              <span>What changes</span>

              <span>Traditional agency</span>

              <span className={styles.shipPilotColumnHeader}>
                <span className={styles.shipPilotLogo}>SP</span>
                ShipPilot
              </span>
            </div>

            <div className={styles.comparisonRows}>
              {comparisonRows.map((row, index) => (
                <motion.div
                  key={row.label}
                  className={styles.comparisonRow}
                  initial={{
                    opacity: 0,
                    y: prefersReducedMotion ? 0 : 12,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.4,
                  }}
                  transition={{
                    duration: 0.45,
                    delay: index * 0.07,
                  }}
                >
                  <strong>{row.label}</strong>

                  <p>{row.traditional}</p>

                  <div>
                    <span>
                      <CheckIcon />
                    </span>

                    <p>{row.shipPilot}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className={styles.benefitsGrid}>
          {benefits.map((benefit, index) => (
            <motion.article
              key={benefit.number}
              className={styles.benefitCard}
              initial={{
                opacity: 0,
                y: prefersReducedMotion ? 0 : 30,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.3,
              }}
              transition={{
                duration: 0.55,
                delay: index * 0.08,
              }}
            >
              <div className={styles.benefitTop}>
                <span className={styles.benefitIcon}>
                  <BenefitIcon icon={benefit.icon} />
                </span>

                <span className={styles.benefitNumber}>
                  {benefit.number}
                </span>
              </div>

              <h3>{benefit.title}</h3>

              <p>{benefit.description}</p>

              <span className={styles.benefitLine} />
            </motion.article>
          ))}
        </div>

        <motion.div
          className={styles.metricsPanel}
          initial={{
            opacity: 0,
            scale: prefersReducedMotion ? 1 : 0.98,
          }}
          whileInView={{
            opacity: 1,
            scale: 1,
          }}
          viewport={{
            once: true,
            amount: 0.35,
          }}
          transition={{
            duration: 0.65,
          }}
        >
          <div className={styles.metricsIntro}>
            <span>Built around transparency</span>

            <h3>
              You stay informed without needing to become a
              software expert.
            </h3>
          </div>

          <div className={styles.metricsGrid}>
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                className={styles.metric}
                initial={{
                  opacity: 0,
                  y: prefersReducedMotion ? 0 : 18,
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
                  duration: 0.45,
                  delay: index * 0.08,
                }}
              >
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className={styles.testimonialSection}>
          <motion.div
            className={styles.testimonialCard}
            initial={{
              opacity: 0,
              x: prefersReducedMotion ? 0 : -28,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.35,
            }}
            transition={{
              duration: 0.65,
            }}
          >
            <div className={styles.quoteMark}>“</div>

            <blockquote>
              ShipPilot is designed for people with strong ideas,
              not only for people who already understand
              software development.
            </blockquote>

            <div className={styles.testimonialAuthor}>
              <span className={styles.authorAvatar}>BM</span>

              <div>
                <strong>ShipPilot founding team</strong>
                <span>Product vision</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className={styles.ctaCard}
            initial={{
              opacity: 0,
              x: prefersReducedMotion ? 0 : 28,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.35,
            }}
            transition={{
              duration: 0.65,
            }}
          >
            <span className={styles.ctaEyebrow}>
              Ready when you are
            </span>

            <h3>
              Bring us the idea. We’ll help build the path.
            </h3>

            <p>
              Start with a simple description of what you want
              to create. No technical document is required.
            </p>

            <div className={styles.ctaActions}>
              <a
                href="/client/projects/new"
                className={styles.primaryButton}
              >
                Start your project
                <ArrowIcon />
              </a>

              <a
                href="#how-it-works"
                className={styles.secondaryButton}
              >
                Review the process
              </a>
            </div>

            <div className={styles.ctaTrust}>
              <span>
                <CheckIcon />
                No technical brief needed
              </span>

              <span>
                <CheckIcon />
                Clear next steps
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhyShipPilotSection;