import { useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from 'motion/react';

import styles from './HowItWorksSection.module.css';

const steps = [
  {
    id: 'idea',
    number: '01',
    eyebrow: 'Tell us what you imagine',
    title: 'Share your idea.',
    description:
      'Describe the product you want to create, the problem it solves and the people who will use it. You do not need technical specifications.',
  },
  {
    id: 'plan',
    number: '02',
    eyebrow: 'Turn uncertainty into direction',
    title: 'Build the plan.',
    description:
      'AI-assisted discovery and a real product manager transform your idea into requirements, priorities, milestones and a practical delivery plan.',
  },
  {
    id: 'build',
    number: '03',
    eyebrow: 'Follow every stage',
    title: 'Watch it come alive.',
    description:
      'Designers and developers build your product while you review progress, approve decisions and communicate with the team from one workspace.',
  },
];

const ArrowIcon = () => {
  return (
    <svg
      width="17"
      height="17"
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
      width="13"
      height="13"
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
      width="15"
      height="15"
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

const IdeaVisual = () => {
  return (
    <div className={styles.ideaVisual}>
      <div className={styles.windowHeader}>
        <div className={styles.windowDots}>
          <span />
          <span />
          <span />
        </div>

        <span>New project request</span>

        <span className={styles.draftBadge}>Draft</span>
      </div>

      <div className={styles.formBody}>
        <div className={styles.formIntro}>
          <span className={styles.formStep}>Step 1 of 4</span>

          <h3>What would you like to build?</h3>

          <p>
            Start with the idea. Buildly will help structure
            everything else.
          </p>
        </div>

        <div className={styles.fakeField}>
          <span>Project name</span>
          <strong>FitFlow</strong>
        </div>

        <div className={`${styles.fakeField} ${styles.largeField}`}>
          <span>Describe your idea</span>

          <p>
            A platform that helps gyms manage bookings,
            memberships and communication with their clients.
          </p>
        </div>

        <div className={styles.ideaTags}>
          <span>Web application</span>
          <span>Booking system</span>
          <span>Dashboard</span>
        </div>

        <div className={styles.formFooter}>
          <span>Your information is saved automatically.</span>

          <button type="button" tabIndex="-1">
            Continue
            <ArrowIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

const PlanVisual = () => {
  const features = [
    'User authentication',
    'Booking management',
    'Membership payments',
    'Admin dashboard',
  ];

  return (
    <div className={styles.planVisual}>
      <div className={styles.planSidebar}>
        <div className={styles.planLogo}>
          <span />
          <span />
          <span />
        </div>

        <div className={styles.planSidebarItems}>
          <span className={styles.activePlanItem} />
          <span />
          <span />
          <span />
        </div>
      </div>

      <div className={styles.planContent}>
        <div className={styles.planHeader}>
          <div>
            <span>AI-assisted project brief</span>
            <h3>FitFlow Platform</h3>
          </div>

          <span className={styles.readyBadge}>
            <CheckIcon />
            Ready for review
          </span>
        </div>

        <div className={styles.planStats}>
          <div>
            <span>Timeline</span>
            <strong>12 weeks</strong>
          </div>

          <div>
            <span>Core features</span>
            <strong>8</strong>
          </div>

          <div>
            <span>Team</span>
            <strong>4 people</strong>
          </div>
        </div>

        <div className={styles.featurePanel}>
          <div className={styles.featureHeader}>
            <div>
              <span>Recommended scope</span>
              <strong>MVP feature set</strong>
            </div>

            <span>4 selected</span>
          </div>

          <div className={styles.featureList}>
            {features.map((feature, index) => (
              <motion.div
                key={feature}
                className={styles.featureItem}
                initial={{
                  opacity: 0,
                  x: -10,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  delay: 0.12 + index * 0.08,
                }}
              >
                <span className={styles.featureCheck}>
                  <CheckIcon />
                </span>

                <strong>{feature}</strong>

                <span>Included</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className={styles.aiNote}>
          <span>
            <SparkIcon />
          </span>

          <div>
            <strong>AI recommendation</strong>

            <p>
              Launch with the essential booking experience,
              then add advanced analytics in phase two.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const BuildVisual = () => {
  const tasks = [
    {
      name: 'Authentication flow',
      status: 'Done',
      type: 'complete',
    },
    {
      name: 'Member dashboard',
      status: 'In review',
      type: 'review',
    },
    {
      name: 'Booking calendar',
      status: 'In progress',
      type: 'progress',
    },
  ];

  return (
    <div className={styles.buildVisual}>
      <div className={styles.buildHeader}>
        <div>
          <span>Active project</span>
          <h3>FitFlow Platform</h3>
        </div>

        <div className={styles.buildAvatars}>
          <span>PM</span>
          <span>UX</span>
          <span>FE</span>
          <span>BE</span>
        </div>
      </div>

      <div className={styles.buildProgress}>
        <div className={styles.buildProgressHeader}>
          <div>
            <span>Development progress</span>
            <strong>64%</strong>
          </div>

          <span>Week 7 of 12</span>
        </div>

        <div className={styles.buildProgressTrack}>
          <motion.span
            initial={{ width: 0 }}
            animate={{ width: '64%' }}
            transition={{
              duration: 1,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        </div>
      </div>

      <div className={styles.buildGrid}>
        <div className={styles.taskPanel}>
          <div className={styles.panelTitle}>
            <span>Current sprint</span>
            <strong>Sprint 07</strong>
          </div>

          <div className={styles.taskList}>
            {tasks.map((task, index) => (
              <motion.div
                key={task.name}
                className={styles.taskItem}
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.12 + index * 0.1,
                }}
              >
                <span
                  className={`${styles.taskStatus} ${
                    styles[task.type]
                  }`}
                >
                  {task.type === 'complete' ? (
                    <CheckIcon />
                  ) : (
                    <span />
                  )}
                </span>

                <div>
                  <strong>{task.name}</strong>
                  <span>{task.status}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className={styles.messagePanel}>
          <div className={styles.panelTitle}>
            <span>Latest update</span>
            <strong>Today</strong>
          </div>

          <div className={styles.messageBubble}>
            <span className={styles.messageAvatar}>YK</span>

            <div>
              <strong>Yesser K.</strong>

              <p>
                The dashboard is ready for your review. I
                added the changes from yesterday’s feedback.
              </p>

              <span>11:42 AM</span>
            </div>
          </div>

          <button type="button" tabIndex="-1">
            Open workspace
            <ArrowIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

const ProcessVisual = ({ activeStep }) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className={styles.visualShell}>
      <div className={styles.visualGlow} />

      <div className={styles.visualTopbar}>
        <div>
          <span className={styles.liveDot} />
          Buildly process
        </div>

        <span>{activeStep.number} / 03</span>
      </div>

      <div className={styles.visualBody}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep.id}
            className={styles.visualScene}
            initial={
              prefersReducedMotion
                ? { opacity: 0 }
                : {
                    opacity: 0,
                    y: 24,
                    scale: 0.97,
                  }
            }
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : {
                    opacity: 0,
                    y: -18,
                    scale: 0.98,
                  }
            }
            transition={{
              duration: prefersReducedMotion ? 0.2 : 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {activeStep.id === 'idea' && <IdeaVisual />}

            {activeStep.id === 'plan' && <PlanVisual />}

            {activeStep.id === 'build' && <BuildVisual />}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className={styles.visualNavigation}>
        {steps.map(step => (
          <span
            key={step.id}
            className={
              step.id === activeStep.id
                ? styles.activeVisualNavigation
                : ''
            }
          />
        ))}
      </div>
    </div>
  );
};

const ProcessStep = ({
  step,
  index,
  activeStep,
  setActiveStep,
}) => {
  const stepRef = useRef(null);

  const isInView = useInView(stepRef, {
    margin: '-38% 0px -38% 0px',
  });

  useEffect(() => {
    if (isInView) {
        setActiveStep(index);
    }
  }, [index, isInView, setActiveStep]);

  return (
    <article
      ref={stepRef}
      className={`${styles.step} ${
        activeStep === index ? styles.activeStep : ''
      }`}
    >
      <div className={styles.stepLine}>
        <span className={styles.stepNumber}>
          {step.number}
        </span>

        <span className={styles.line} />
      </div>

      <div className={styles.stepCopy}>
        <span className={styles.stepEyebrow}>
          {step.eyebrow}
        </span>

        <h3>{step.title}</h3>

        <p>{step.description}</p>

        <div className={styles.mobileVisual}>
          <ProcessVisual activeStep={step} />
        </div>
      </div>
    </article>
  );
};

const HowItWorksSection = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section
      id="how-it-works"
      className={styles.section}
    >
      <div className={styles.background} aria-hidden="true">
        <div className={styles.grid} />
        <div className={styles.glow} />
      </div>

      <div className={`container ${styles.container}`}>
        <header className={styles.sectionHeader}>
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
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
              duration: 0.6,
            }}
          >
            <span className={styles.sectionEyebrow}>
              From idea to launch
            </span>

            <h2>
              Building software should feel{' '}
              <span>clear.</span>
            </h2>

            <p>
              Buildly gives you a structured process, a real
              team and complete visibility from the first
              conversation to launch.
            </p>
          </motion.div>
        </header>

        <div className={styles.processLayout}>
          <div className={styles.steps}>
            {steps.map((step, index) => (
              <ProcessStep
                key={step.id}
                step={step}
                index={index}
                activeStep={activeStep}
                setActiveStep={setActiveStep}
              />
            ))}
          </div>

          <div className={styles.stickyVisual}>
            <ProcessVisual
              activeStep={steps[activeStep]}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;