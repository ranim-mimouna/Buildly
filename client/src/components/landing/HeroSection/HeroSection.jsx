import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'motion/react';

import Button from '../../common/Button/Button';

import styles from './HeroSection.module.css';

const projectStages = [
  {
    label: 'Strategy',
    status: 'complete',
  },
  {
    label: 'UX/UI Design',
    status: 'complete',
  },
  {
    label: 'Frontend',
    status: 'active',
  },
  {
    label: 'Backend',
    status: 'upcoming',
  },
  {
    label: 'Testing',
    status: 'upcoming',
  },
];

const activityItems = [
  {
    initials: 'SM',
    title: 'Homepage design approved',
    time: '12 min ago',
    type: 'approved',
  },
  {
    initials: 'YK',
    title: 'Dashboard components updated',
    time: '38 min ago',
    type: 'development',
  },
  {
    initials: 'RM',
    title: 'Added feedback to onboarding',
    time: '1 hour ago',
    type: 'comment',
  },
];

const teamMembers = [
  {
    initials: 'SM',
    role: 'Product',
  },
  {
    initials: 'YK',
    role: 'Design',
  },
  {
    initials: 'RM',
    role: 'Frontend',
  },
  {
    initials: 'AK',
    role: 'Backend',
  },
];

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

const SparkIcon = () => {
  return (
    <svg
      width="14"
      height="14"
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
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 5H19V16H10L6 20V16H5V5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const HeroSection = () => {
  const prefersReducedMotion = useReducedMotion();

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const smoothX = useSpring(pointerX, {
    stiffness: 120,
    damping: 20,
    mass: 0.5,
  });

  const smoothY = useSpring(pointerY, {
    stiffness: 120,
    damping: 20,
    mass: 0.5,
  });

  const dashboardRotateY = useTransform(
    smoothX,
    [-0.5, 0.5],
    [-2.5, 2.5],
  );

  const dashboardRotateX = useTransform(
    smoothY,
    [-0.5, 0.5],
    [2.5, -2.5],
  );

  const dashboardX = useTransform(
    smoothX,
    [-0.5, 0.5],
    [-5, 5],
  );

  const dashboardY = useTransform(
    smoothY,
    [-0.5, 0.5],
    [-5, 5],
  );

  const handlePointerMove = event => {
    if (prefersReducedMotion) {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();

    const x =
      (event.clientX - bounds.left) / bounds.width - 0.5;

    const y =
      (event.clientY - bounds.top) / bounds.height - 0.5;

    pointerX.set(x);
    pointerY.set(y);
  };

  const handlePointerLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <section
      className={styles.hero}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div className={styles.background} aria-hidden="true">
        <div className={styles.grid} />
        <div className={styles.glowOne} />
        <div className={styles.glowTwo} />
      </div>

      <div className={`container ${styles.heroInner}`}>
        <motion.div
          className={styles.copy}
          initial={
            prefersReducedMotion
              ? false
              : {
                  opacity: 0,
                  y: 30,
                }
          }
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.75,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <motion.div
            className={styles.eyebrow}
            initial={
              prefersReducedMotion
                ? false
                : {
                    opacity: 0,
                    x: -15,
                  }
            }
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.6,
              delay: 0.1,
            }}
          >
            <span className={styles.eyebrowIcon}>
              <SparkIcon />
            </span>

            <span>
              Human expertise. AI-accelerated delivery.
            </span>
          </motion.div>

          <h1 className={styles.title}>
            Your idea deserves more than an{' '}
            <span className={styles.highlight}>
              AI-generated app.
            </span>
          </h1>

          <p className={styles.description}>
            Build your software with a real product team
            supported by AI—from the first idea to a
            production-ready launch.
          </p>

          <div className={styles.actions}>
            <Button
              to="/client/projects/new"
              variant="primary"
              size="large"
              className={styles.primaryButton}
            >
              <span className={styles.buttonContent}>
                Start your project
                <ArrowIcon />
              </span>
            </Button>

            <Button
              href="#how-it-works"
              variant="secondary"
              size="large"
            >
              See how it works
            </Button>
          </div>

          <div className={styles.trustRow}>
            <div className={styles.avatarGroup}>
              <span>PM</span>
              <span>UX</span>
              <span>FE</span>
              <span>BE</span>
            </div>

            <div className={styles.trustCopy}>
              <div className={styles.trustTitle}>
                <CheckIcon />
                One dedicated product team
              </div>

              <p>
                Strategy, design, development and QA.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className={styles.visual}
          initial={
            prefersReducedMotion
              ? false
              : {
                  opacity: 0,
                  scale: 0.94,
                  y: 35,
                }
          }
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          transition={{
            duration: 0.85,
            delay: 0.15,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <motion.div
            className={styles.dashboard}
            style={
              prefersReducedMotion
                ? undefined
                : {
                    rotateX: dashboardRotateX,
                    rotateY: dashboardRotateY,
                    x: dashboardX,
                    y: dashboardY,
                  }
            }
          >
            <div className={styles.dashboardTopbar}>
              <div className={styles.windowControls}>
                <span />
                <span />
                <span />
              </div>

              <div className={styles.workspaceLabel}>
                Buildly Workspace
              </div>

              <div className={styles.onlineStatus}>
                <span />
                Live
              </div>
            </div>

            <div className={styles.dashboardBody}>
              <aside className={styles.sidebar}>
                <div className={styles.miniLogo}>
                  <span />
                  <span />
                  <span />
                </div>

                <nav
                  className={styles.sidebarNavigation}
                  aria-label="Project preview navigation"
                >
                  <span className={styles.activeSidebarItem} />

                  <span />

                  <span />

                  <span />

                  <span />
                </nav>

                <div className={styles.sidebarAvatar}>
                  RM
                </div>
              </aside>

              <div className={styles.workspace}>
                <div className={styles.workspaceHeader}>
                  <div>
                    <div className={styles.projectLabel}>
                      Active project
                    </div>

                    <h2>FitFlow Platform</h2>
                  </div>

                  <div className={styles.headerActions}>
                    <div className={styles.headerAvatars}>
                      {teamMembers
                        .slice(0, 3)
                        .map(member => (
                          <span key={member.initials}>
                            {member.initials}
                          </span>
                        ))}
                    </div>

                    <button
                      type="button"
                      className={styles.previewButton}
                      tabIndex="-1"
                    >
                      Open project
                    </button>
                  </div>
                </div>

                <div className={styles.metrics}>
                  <div className={styles.progressCard}>
                    <div className={styles.cardHeader}>
                      <div>
                        <span>Overall progress</span>
                        <strong>64%</strong>
                      </div>

                      <span className={styles.statusBadge}>
                        On track
                      </span>
                    </div>

                    <div
                      className={styles.progressTrack}
                      aria-label="Project is 64 percent complete"
                    >
                      <motion.div
                        className={styles.progressFill}
                        initial={{
                          width: prefersReducedMotion
                            ? '64%'
                            : '0%',
                        }}
                        animate={{
                          width: '64%',
                        }}
                        transition={{
                          duration: 1.4,
                          delay: 0.65,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      />
                    </div>

                    <div className={styles.progressMeta}>
                      <span>Started June 4</span>
                      <span>Launch September 18</span>
                    </div>
                  </div>

                  <div className={styles.weekCard}>
                    <span>Current sprint</span>
                    <strong>Week 7</strong>
                    <p>3 weeks remaining</p>
                  </div>
                </div>

                <div className={styles.workspaceGrid}>
                  <div className={styles.stageCard}>
                    <div className={styles.sectionHeader}>
                      <div>
                        <span>Project roadmap</span>
                        <strong>5 milestones</strong>
                      </div>

                      <button
                        type="button"
                        aria-label="More project roadmap options"
                        tabIndex="-1"
                      >
                        ···
                      </button>
                    </div>

                    <div className={styles.stageList}>
                      {projectStages.map((stage, index) => (
                        <motion.div
                          key={stage.label}
                          className={styles.stageItem}
                          initial={
                            prefersReducedMotion
                              ? false
                              : {
                                  opacity: 0,
                                  x: -12,
                                }
                          }
                          animate={{
                            opacity: 1,
                            x: 0,
                          }}
                          transition={{
                            duration: 0.45,
                            delay: 0.65 + index * 0.1,
                          }}
                        >
                          <span
                            className={`${styles.stageIcon} ${
                              styles[stage.status]
                            }`}
                          >
                            {stage.status === 'complete' ? (
                              <CheckIcon />
                            ) : (
                              <span />
                            )}
                          </span>

                          <div>
                            <strong>{stage.label}</strong>

                            <small>
                              {stage.status === 'complete' &&
                                'Completed'}

                              {stage.status === 'active' &&
                                'In progress'}

                              {stage.status === 'upcoming' &&
                                'Upcoming'}
                            </small>
                          </div>

                          {stage.status === 'active' && (
                            <span
                              className={styles.activeLabel}
                            >
                              Active
                            </span>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className={styles.activityCard}>
                    <div className={styles.sectionHeader}>
                      <div>
                        <span>Recent activity</span>
                        <strong>Today</strong>
                      </div>

                      <MessageIcon />
                    </div>

                    <div className={styles.activityList}>
                      {activityItems.map((activity, index) => (
                        <motion.div
                          key={activity.title}
                          className={styles.activityItem}
                          initial={
                            prefersReducedMotion
                              ? false
                              : {
                                  opacity: 0,
                                  y: 12,
                                }
                          }
                          animate={{
                            opacity: 1,
                            y: 0,
                          }}
                          transition={{
                            duration: 0.5,
                            delay: 0.9 + index * 0.14,
                          }}
                        >
                          <span
                            className={`${styles.activityAvatar} ${
                              styles[activity.type]
                            }`}
                          >
                            {activity.initials}
                          </span>

                          <div>
                            <strong>{activity.title}</strong>
                            <small>{activity.time}</small>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className={styles.teamRow}>
                      <span>Project team</span>

                      <div className={styles.teamMembers}>
                        {teamMembers.map(member => (
                          <span
                            key={member.initials}
                            title={member.role}
                          >
                            {member.initials}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className={styles.floatingApproval}
            initial={
              prefersReducedMotion
                ? false
                : {
                    opacity: 0,
                    x: 20,
                    scale: 0.9,
                  }
            }
            animate={{
              opacity: 1,
              x: 0,
              scale: 1,
            }}
            transition={{
              duration: 0.6,
              delay: 1.15,
            }}
          >
            <span className={styles.approvalIcon}>
              <CheckIcon />
            </span>

            <div>
              <strong>Design approved</strong>
              <small>Moving to development</small>
            </div>
          </motion.div>

          <motion.div
            className={styles.floatingSprint}
            initial={
              prefersReducedMotion
                ? false
                : {
                    opacity: 0,
                    x: -20,
                    scale: 0.9,
                  }
            }
            animate={{
              opacity: 1,
              x: 0,
              scale: 1,
            }}
            transition={{
              duration: 0.6,
              delay: 1.3,
            }}
          >
            <div className={styles.sprintTop}>
              <span>SPRINT 07</span>
              <strong>82%</strong>
            </div>

            <div className={styles.sprintTrack}>
              <motion.span
                initial={{
                  width: prefersReducedMotion ? '82%' : '0%',
                }}
                animate={{
                  width: '82%',
                }}
                transition={{
                  duration: 1.1,
                  delay: 1.4,
                }}
              />
            </div>

            <small>9 of 11 tasks complete</small>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className={styles.scrollIndicator}
        initial={
          prefersReducedMotion
            ? false
            : {
                opacity: 0,
              }
        }
        animate={{
          opacity: 1,
        }}
        transition={{
          delay: 1.6,
          duration: 0.6,
        }}
      >
        <span>Scroll to explore</span>

        <span className={styles.scrollLine}>
          <motion.span
            animate={
              prefersReducedMotion
                ? undefined
                : {
                    y: [0, 15, 0],
                  }
            }
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </span>
      </motion.div>
    </section>
  );
};

export default HeroSection;