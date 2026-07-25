import { useMemo, useState } from 'react';
import {
  Link,
  Navigate,
  useNavigate,
  useParams,
} from 'react-router-dom';

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from 'motion/react';

import styles from './ProjectRoadmapPage.module.css';

const milestoneStatuses = [
  {
    id: 'upcoming',
    label: 'Upcoming',
  },
  {
    id: 'in-progress',
    label: 'In progress',
  },
  {
    id: 'blocked',
    label: 'Blocked',
  },
  {
    id: 'completed',
    label: 'Completed',
  },
];

const projectStatusLabels = {
  submitted: 'Submitted',
  'in-review': 'In review',
  planning: 'Planning',
  'in-progress': 'Development',
  completed: 'Completed',
};

const categoryLabels = {
  'web-app': 'Web App',
  'mobile-app': 'Mobile App',
  saas: 'SaaS',
  marketplace: 'Marketplace',
  'ai-product': 'AI Product',
  'internal-tool': 'Internal Tool',
  ecommerce: 'E-commerce',
  other: 'Other',
};

const getStoredProjects = () => {
  const value = localStorage.getItem(
    'buildly-projects',
  );

  if (!value) {
    return [];
  }

  try {
    const projects = JSON.parse(value);

    return Array.isArray(projects)
      ? projects
      : [];
  } catch {
    localStorage.removeItem('buildly-projects');

    return [];
  }
};

const getStoredRoadmaps = () => {
  const value = localStorage.getItem(
    'buildly-project-roadmaps',
  );

  if (!value) {
    return {};
  }

  try {
    const roadmaps = JSON.parse(value);

    return roadmaps &&
      typeof roadmaps === 'object' &&
      !Array.isArray(roadmaps)
      ? roadmaps
      : {};
  } catch {
    localStorage.removeItem(
      'buildly-project-roadmaps',
    );

    return {};
  }
};

const createDefaultRoadmap = project => {
  const createdAt = new Date().toISOString();

  return {
    projectId: project.id,
    updatedAt: createdAt,
    milestones: [
      {
        id: `milestone-discovery-${project.id}`,
        title: 'Discovery and project review',
        description:
          'Review the submitted brief, clarify requirements and identify the main product risks.',
        status:
          project.status === 'submitted'
            ? 'in-progress'
            : 'completed',
        dueDate: '',
        createdAt,
      },
      {
        id: `milestone-planning-${project.id}`,
        title: 'Scope and technical planning',
        description:
          'Define the first release, technical approach, delivery phases and team responsibilities.',
        status:
          ['planning', 'in-progress', 'completed'].includes(
            project.status,
          )
            ? 'in-progress'
            : 'upcoming',
        dueDate: '',
        createdAt,
      },
      {
        id: `milestone-design-${project.id}`,
        title: 'Product design',
        description:
          'Prepare the main user flows, interface direction and approved product screens.',
        status:
          project.status === 'completed'
            ? 'completed'
            : 'upcoming',
        dueDate: '',
        createdAt,
      },
      {
        id: `milestone-development-${project.id}`,
        title: 'Development and testing',
        description:
          'Build the approved product scope, test key flows and prepare the first working release.',
        status:
          project.status === 'in-progress'
            ? 'in-progress'
            : project.status === 'completed'
              ? 'completed'
              : 'upcoming',
        dueDate: '',
        createdAt,
      },
      {
        id: `milestone-launch-${project.id}`,
        title: 'Launch and handover',
        description:
          'Complete final testing, launch the product and provide the agreed project handover.',
        status:
          project.status === 'completed'
            ? 'completed'
            : 'upcoming',
        dueDate: '',
        createdAt,
      },
    ],
  };
};

const formatDate = value => {
  if (!value) {
    return 'Date not set';
  }

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return 'Date not set';
  }

  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

const formatUpdatedDate = value => {
  if (!value) {
    return 'Not saved yet';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Not saved yet';
  }

  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
};

const getRoadmapProgress = milestones => {
  if (milestones.length === 0) {
    return 0;
  }

  const weights = {
    upcoming: 0,
    blocked: 0.25,
    'in-progress': 0.5,
    completed: 1,
  };

  const total = milestones.reduce(
    (sum, milestone) =>
      sum + (weights[milestone.status] ?? 0),
    0,
  );

  return Math.round(
    (total / milestones.length) * 100,
  );
};

const ArrowIcon = ({
  direction = 'right',
}) => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      style={{
        transform:
          direction === 'left'
            ? 'rotate(180deg)'
            : undefined,
      }}
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

const PlusIcon = () => {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 5V19M5 12H19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

const SaveIcon = () => {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 3H17L21 7V21H3V3H5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />

      <path
        d="M7 3V9H16V3M7 21V14H17V21"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const MessageIcon = () => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 5H20V17H9L4 21V5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const FolderIcon = () => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 7.5C3 6.1 4.1 5 5.5 5H9L11 7H18.5C19.9 7 21 8.1 21 9.5V17.5C21 18.9 19.9 20 18.5 20H5.5C4.1 20 3 18.9 3 17.5V7.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const RoadmapIcon = () => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="6"
        cy="6"
        r="2"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <circle
        cx="18"
        cy="12"
        r="2"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <circle
        cx="8"
        cy="19"
        r="2"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M8 7L16 11M17 14L10 18"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
};

const MenuIcon = () => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 7H19M5 12H19M5 17H19"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
};

const CloseIcon = () => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 6L18 18M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
};

const DeleteIcon = () => {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 7H20M9 3H15L16 7H8L9 3Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M7 7L8 21H16L17 7M10 11V17M14 11V17"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
};

const MoveIcon = ({ direction }) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      style={{
        transform:
          direction === 'down'
            ? 'rotate(180deg)'
            : undefined,
      }}
    >
      <path
        d="M6 15L12 9L18 15"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

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
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const CalendarIcon = () => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="16"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M8 3V7M16 3V7M3 10H21"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
};

const ProjectRoadmapPage = ({
  role = 'client',
}) => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const prefersReducedMotion =
    useReducedMotion();

  const projects = useMemo(
    () => getStoredProjects(),
    [],
  );

  const project = useMemo(
    () =>
      projects.find(
        currentProject =>
          currentProject.id === projectId,
      ),
    [projectId, projects],
  );

  const initialRoadmap = useMemo(() => {
    if (!project) {
      return null;
    }

    const storedRoadmaps =
      getStoredRoadmaps();

    return (
      storedRoadmaps[project.id] ??
      createDefaultRoadmap(project)
    );
  }, [project]);

  const [milestones, setMilestones] =
    useState(
      initialRoadmap?.milestones ?? [],
    );

  const [lastUpdated, setLastUpdated] =
    useState(initialRoadmap?.updatedAt);

  const [isSidebarOpen, setIsSidebarOpen] =
    useState(false);

  const [isSaving, setIsSaving] =
    useState(false);

  const [showSavedMessage, setShowSavedMessage] =
    useState(false);

  if (!project || !initialRoadmap) {
    return (
      <Navigate
        to={
          role === 'team'
            ? '/team/dashboard'
            : '/client/dashboard'
        }
        replace
      />
    );
  }

  const isTeam = role === 'team';

  const basePath = isTeam
    ? `/team/projects/${project.id}`
    : `/client/projects/${project.id}`;

  const dashboardPath = isTeam
    ? '/team/dashboard'
    : '/client/dashboard';

  const clientName =
    project.clientName ??
    project.client?.name ??
    'Ranim Mimouna';

  const progress =
    getRoadmapProgress(milestones);

  const completedCount = milestones.filter(
    milestone =>
      milestone.status === 'completed',
  ).length;

  const activeCount = milestones.filter(
    milestone =>
      milestone.status === 'in-progress',
  ).length;

  const blockedCount = milestones.filter(
    milestone =>
      milestone.status === 'blocked',
  ).length;

  const updateMilestone = (
    milestoneId,
    field,
    value,
  ) => {
    setMilestones(currentMilestones =>
      currentMilestones.map(milestone =>
        milestone.id === milestoneId
          ? {
              ...milestone,
              [field]: value,
            }
          : milestone,
      ),
    );
  };

  const addMilestone = () => {
    const newMilestone = {
      id: `milestone-${Date.now()}`,
      title: 'New milestone',
      description:
        'Describe the expected outcome for this milestone.',
      status: 'upcoming',
      dueDate: '',
      createdAt: new Date().toISOString(),
    };

    setMilestones(currentMilestones => [
      ...currentMilestones,
      newMilestone,
    ]);
  };

  const removeMilestone = milestoneId => {
    setMilestones(currentMilestones =>
      currentMilestones.filter(
        milestone =>
          milestone.id !== milestoneId,
      ),
    );
  };

  const moveMilestone = (
    milestoneIndex,
    direction,
  ) => {
    setMilestones(currentMilestones => {
      const targetIndex =
        direction === 'up'
          ? milestoneIndex - 1
          : milestoneIndex + 1;

      if (
        targetIndex < 0 ||
        targetIndex >= currentMilestones.length
      ) {
        return currentMilestones;
      }

      const reorderedMilestones = [
        ...currentMilestones,
      ];

      const [movedMilestone] =
        reorderedMilestones.splice(
          milestoneIndex,
          1,
        );

      reorderedMilestones.splice(
        targetIndex,
        0,
        movedMilestone,
      );

      return reorderedMilestones;
    });
  };

  const handleSave = async () => {
    setIsSaving(true);

    const updatedAt =
      new Date().toISOString();

    const storedRoadmaps =
      getStoredRoadmaps();

    localStorage.setItem(
      'buildly-project-roadmaps',
      JSON.stringify({
        ...storedRoadmaps,
        [project.id]: {
          projectId: project.id,
          milestones,
          updatedAt,
          updatedBy: 'Buildly Team',
        },
      }),
    );

    await new Promise(resolve => {
      window.setTimeout(resolve, 450);
    });

    setLastUpdated(updatedAt);
    setIsSaving(false);
    setShowSavedMessage(true);

    window.setTimeout(() => {
      setShowSavedMessage(false);
    }, 2200);
  };

  return (
    <main className={styles.page}>
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.button
            type="button"
            className={styles.mobileOverlay}
            aria-label="Close navigation"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            onClick={() =>
              setIsSidebarOpen(false)
            }
          />
        )}
      </AnimatePresence>

      <motion.aside
        className={`${styles.sidebar} ${
          isSidebarOpen
            ? styles.sidebarOpen
            : ''
        }`}
        initial={{
          opacity: 0,
          x: prefersReducedMotion
            ? 0
            : -18,
        }}
        animate={{
          opacity: 1,
          x: 0,
        }}
      >
        <div className={styles.sidebarHeader}>
          <Link
            to="/"
            className={styles.logo}
          >
            <span className={styles.logoMark}>
              <span />
              <span />
              <span />
            </span>

            <span>Buildly</span>
          </Link>

          <button
            type="button"
            className={
              styles.mobileCloseButton
            }
            aria-label="Close navigation"
            onClick={() =>
              setIsSidebarOpen(false)
            }
          >
            <CloseIcon />
          </button>
        </div>

        <div className={styles.workspaceBadge}>
          <span>
            {isTeam
              ? 'Internal workspace'
              : 'Client workspace'}
          </span>

          <strong>
            {isTeam
              ? 'Delivery management'
              : 'Project delivery'}
          </strong>
        </div>

        <nav className={styles.navigation}>
          <Link
            to={dashboardPath}
            className={styles.navigationLink}
          >
            <FolderIcon />
            Dashboard
          </Link>

          <Link
            to={basePath}
            className={styles.navigationLink}
          >
            <FolderIcon />
            Project overview
          </Link>

          <Link
            to={`${basePath}/roadmap`}
            className={`${styles.navigationLink} ${styles.navigationLinkActive}`}
          >
            <RoadmapIcon />
            Roadmap
          </Link>

          <Link
            to={`${basePath}/messages`}
            className={styles.navigationLink}
          >
            <MessageIcon />
            Messages
          </Link>
        </nav>

        <div className={styles.projectCard}>
          <span>Current project</span>

          <strong>{project.title}</strong>

          <p>
            {categoryLabels[
              project.category
            ] ?? 'Digital product'}
          </p>

          <div>
            <span />

            {projectStatusLabels[
              project.status
            ] ?? 'Submitted'}
          </div>
        </div>

        <div className={styles.sidebarBottom}>
          <div className={styles.profile}>
            <span>
              {isTeam
                ? 'BT'
                : clientName
                    .split(' ')
                    .map(name => name[0])
                    .join('')
                    .slice(0, 2)}
            </span>

            <div>
              <strong>
                {isTeam
                  ? 'Buildly Team'
                  : clientName}
              </strong>

              <small>
                {isTeam
                  ? 'Delivery workspace'
                  : 'Project owner'}
              </small>
            </div>
          </div>
        </div>
      </motion.aside>

      <section className={styles.mainContent}>
        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <button
              type="button"
              className={
                styles.mobileMenuButton
              }
              aria-label="Open navigation"
              onClick={() =>
                setIsSidebarOpen(true)
              }
            >
              <MenuIcon />
            </button>

            <button
              type="button"
              className={styles.backButton}
              onClick={() =>
                navigate(basePath)
              }
            >
              <ArrowIcon direction="left" />
              Back to project
            </button>
          </div>

          <div className={styles.topbarActions}>
            <AnimatePresence>
              {showSavedMessage && (
                <motion.span
                  className={styles.savedMessage}
                  initial={{
                    opacity: 0,
                    y: -5,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                  }}
                >
                  <CheckIcon />
                  Roadmap saved
                </motion.span>
              )}
            </AnimatePresence>

            {isTeam && (
              <>
                <button
                  type="button"
                  className={
                    styles.addTopButton
                  }
                  onClick={addMilestone}
                >
                  <PlusIcon />
                  Add milestone
                </button>

                <button
                  type="button"
                  className={styles.saveButton}
                  disabled={isSaving}
                  onClick={handleSave}
                >
                  {isSaving ? (
                    <span
                      className={
                        styles.spinner
                      }
                    />
                  ) : (
                    <SaveIcon />
                  )}

                  {isSaving
                    ? 'Saving'
                    : 'Save roadmap'}
                </button>
              </>
            )}
          </div>
        </header>

        <motion.div
          className={styles.content}
          initial={{
            opacity: 0,
            y: prefersReducedMotion ? 0 : 18,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
        >
          <section className={styles.hero}>
            <div className={styles.heroContent}>
              <span className={styles.eyebrow}>
                Shared delivery plan
              </span>

              <h1>Project roadmap</h1>

              <p>
                {isTeam
                  ? 'Organize the project into clear delivery milestones that the client can follow.'
                  : 'Follow the major phases, progress and expected delivery dates for your project.'}
              </p>

              <div className={styles.heroMeta}>
                <span>{project.title}</span>

                <span>
                  {projectStatusLabels[
                    project.status
                  ] ?? 'Submitted'}
                </span>

                <span>
                  Updated{' '}
                  {formatUpdatedDate(
                    lastUpdated,
                  )}
                </span>
              </div>
            </div>

            <div className={styles.progressCard}>
              <div className={styles.progressTop}>
                <div>
                  <span>Overall progress</span>
                  <strong>{progress}%</strong>
                </div>

                <span className={styles.roadmapIcon}>
                  <RoadmapIcon />
                </span>
              </div>

              <div className={styles.progressTrack}>
                <span
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>

              <div className={styles.progressStats}>
                <div>
                  <strong>
                    {completedCount}
                  </strong>
                  <span>Completed</span>
                </div>

                <div>
                  <strong>
                    {activeCount}
                  </strong>
                  <span>Active</span>
                </div>

                <div>
                  <strong>
                    {blockedCount}
                  </strong>
                  <span>Blocked</span>
                </div>
              </div>
            </div>
          </section>

          <section className={styles.summaryGrid}>
            <article>
              <span>Total milestones</span>
              <strong>{milestones.length}</strong>
              <small>
                Delivery phases in this roadmap
              </small>
            </article>

            <article>
              <span>Completed</span>
              <strong>{completedCount}</strong>
              <small>
                Finished project phases
              </small>
            </article>

            <article>
              <span>Currently active</span>
              <strong>{activeCount}</strong>
              <small>
                Work happening now
              </small>
            </article>

            <article>
              <span>Project owner</span>
              <strong>{clientName}</strong>
              <small>Client workspace</small>
            </article>
          </section>

          <section className={styles.roadmapSection}>
            <div className={styles.sectionHeading}>
              <div>
                <span>Delivery sequence</span>
                <h2>Milestones</h2>
              </div>

              {!isTeam && (
                <Link
                  to={`${basePath}/messages`}
                  className={
                    styles.messageClientButton
                  }
                >
                  <MessageIcon />
                  Ask about the roadmap
                </Link>
              )}
            </div>

            {milestones.length > 0 ? (
              <div className={styles.timeline}>
                {milestones.map(
                  (milestone, index) => (
                    <motion.article
                      key={milestone.id}
                      className={`${styles.milestoneCard} ${
                        styles[
                          `milestone${milestone.status
                            .split('-')
                            .map(
                              word =>
                                word
                                  .charAt(0)
                                  .toUpperCase() +
                                word.slice(1),
                            )
                            .join('')}`
                        ] ?? ''
                      }`}
                      initial={{
                        opacity: 0,
                        y: prefersReducedMotion
                          ? 0
                          : 12,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay: index * 0.045,
                      }}
                    >
                      <div
                        className={
                          styles.timelineMarker
                        }
                      >
                        <span>
                          {milestone.status ===
                          'completed' ? (
                            <CheckIcon />
                          ) : (
                            index + 1
                          )}
                        </span>

                        {index <
                          milestones.length -
                            1 && <div />}
                      </div>

                      <div
                        className={
                          styles.milestoneContent
                        }
                      >
                        <div
                          className={
                            styles.milestoneHeader
                          }
                        >
                          <div
                            className={
                              styles.milestoneTitle
                            }
                          >
                            {isTeam ? (
                              <input
                                type="text"
                                value={
                                  milestone.title
                                }
                                aria-label={`Milestone ${
                                  index + 1
                                } title`}
                                onChange={event =>
                                  updateMilestone(
                                    milestone.id,
                                    'title',
                                    event.target
                                      .value,
                                  )
                                }
                              />
                            ) : (
                              <h3>
                                {milestone.title}
                              </h3>
                            )}

                            <span
                              className={
                                styles.statusBadge
                              }
                            >
                              {
                                milestoneStatuses.find(
                                  status =>
                                    status.id ===
                                    milestone.status,
                                )?.label
                              }
                            </span>
                          </div>

                          {isTeam && (
                            <div
                              className={
                                styles.milestoneActions
                              }
                            >
                              <button
                                type="button"
                                disabled={
                                  index === 0
                                }
                                aria-label="Move milestone up"
                                onClick={() =>
                                  moveMilestone(
                                    index,
                                    'up',
                                  )
                                }
                              >
                                <MoveIcon direction="up" />
                              </button>

                              <button
                                type="button"
                                disabled={
                                  index ===
                                  milestones.length -
                                    1
                                }
                                aria-label="Move milestone down"
                                onClick={() =>
                                  moveMilestone(
                                    index,
                                    'down',
                                  )
                                }
                              >
                                <MoveIcon direction="down" />
                              </button>

                              <button
                                type="button"
                                className={
                                  styles.deleteButton
                                }
                                aria-label="Delete milestone"
                                onClick={() =>
                                  removeMilestone(
                                    milestone.id,
                                  )
                                }
                              >
                                <DeleteIcon />
                              </button>
                            </div>
                          )}
                        </div>

                        {isTeam ? (
                          <textarea
                            rows="3"
                            value={
                              milestone.description
                            }
                            aria-label={`Milestone ${
                              index + 1
                            } description`}
                            onChange={event =>
                              updateMilestone(
                                milestone.id,
                                'description',
                                event.target.value,
                              )
                            }
                          />
                        ) : (
                          <p>
                            {
                              milestone.description
                            }
                          </p>
                        )}

                        <div
                          className={
                            styles.milestoneFooter
                          }
                        >
                          <div
                            className={
                              styles.dateField
                            }
                          >
                            <CalendarIcon />

                            {isTeam ? (
                              <input
                                type="date"
                                value={
                                  milestone.dueDate
                                }
                                aria-label={`Milestone ${
                                  index + 1
                                } due date`}
                                onChange={event =>
                                  updateMilestone(
                                    milestone.id,
                                    'dueDate',
                                    event.target
                                      .value,
                                  )
                                }
                              />
                            ) : (
                              <span>
                                {formatDate(
                                  milestone.dueDate,
                                )}
                              </span>
                            )}
                          </div>

                          {isTeam && (
                            <select
                              value={
                                milestone.status
                              }
                              aria-label={`Milestone ${
                                index + 1
                              } status`}
                              onChange={event =>
                                updateMilestone(
                                  milestone.id,
                                  'status',
                                  event.target.value,
                                )
                              }
                            >
                              {milestoneStatuses.map(
                                status => (
                                  <option
                                    key={
                                      status.id
                                    }
                                    value={
                                      status.id
                                    }
                                  >
                                    {
                                      status.label
                                    }
                                  </option>
                                ),
                              )}
                            </select>
                          )}
                        </div>
                      </div>
                    </motion.article>
                  ),
                )}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <span>
                  <RoadmapIcon />
                </span>

                <h3>No milestones yet</h3>

                <p>
                  {isTeam
                    ? 'Add the first milestone to begin creating this project roadmap.'
                    : 'The Buildly team has not published a project roadmap yet.'}
                </p>

                {isTeam && (
                  <button
                    type="button"
                    onClick={addMilestone}
                  >
                    <PlusIcon />
                    Add first milestone
                  </button>
                )}
              </div>
            )}
          </section>

          <section className={styles.helpBanner}>
            <div>
              <span>
                {isTeam
                  ? 'Keep the client informed'
                  : 'Questions about delivery?'}
              </span>

              <h2>
                {isTeam
                  ? 'Share clear progress through every project phase.'
                  : 'Talk directly with the Buildly team.'}
              </h2>

              <p>
                {isTeam
                  ? 'Roadmap changes become visible to the client after you save them.'
                  : 'Use project messages to ask about dates, milestones or changes in scope.'}
              </p>
            </div>

            <Link
              to={`${basePath}/messages`}
            >
              <MessageIcon />
              {isTeam
                ? 'Message client'
                : 'Contact Buildly'}
            </Link>
          </section>
        </motion.div>
      </section>
    </main>
  );
};

export default ProjectRoadmapPage;