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

import styles from './ClientProjectPage.module.css';

const statusLabels = {
  submitted: 'Submitted',
  'in-review': 'In review',
  planning: 'Planning',
  'in-progress': 'In progress',
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

const stageLabels = {
  idea: 'Just an idea',
  research: 'Researching',
  design: 'Design ready',
  'existing-product': 'Existing product',
};

const priorityLabels = {
  speed: 'Launch quickly',
  quality: 'Highest quality',
  budget: 'Stay efficient',
  exploration: 'Help me decide',
};

const budgetLabels = {
  'under-5k': 'Under €5,000',
  '5k-15k': '€5,000 – €15,000',
  '15k-30k': '€15,000 – €30,000',
  '30k-plus': '€30,000+',
  'not-sure': 'Not sure yet',
};

const timelineLabels = {
  asap: 'As soon as possible',
  '1-2-months': 'Within 1–2 months',
  '3-4-months': 'Within 3–4 months',
  flexible: 'Flexible',
};

const designLabels = {
  none: 'No design yet',
  ideas: 'Ideas and references',
  wireframes: 'Wireframes ready',
  'finished-design': 'Finished designs',
};

const ownershipLabels = {
  'buildly-managed': 'Buildly manages everything',
  collaborative: 'Work with my team',
  'development-only': 'Development only',
  'not-sure': 'Help me decide',
};

const supportLabels = {
  'launch-only': 'Launch only',
  'short-term': 'Short-term support',
  ongoing: 'Ongoing product team',
  'not-sure': 'Not sure yet',
};

const projectSections = [
  {
    id: 'overview',
    label: 'Overview',
  },
  {
    id: 'brief',
    label: 'Project brief',
  },
  {
    id: 'milestones',
    label: 'Milestones',
  },
  {
    id: 'activity',
    label: 'Activity',
  },
];

const getStoredProjects = () => {
  const savedProjects = localStorage.getItem(
    'buildly-projects',
  );

  if (!savedProjects) {
    return [];
  }

  try {
    const parsedProjects = JSON.parse(savedProjects);

    return Array.isArray(parsedProjects)
      ? parsedProjects
      : [];
  } catch {
    localStorage.removeItem('buildly-projects');

    return [];
  }
};

const formatDate = value => {
  if (!value) {
    return 'Not set';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Not set';
  }

  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

const formatShortDate = value => {
  if (!value) {
    return 'Recently';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Recently';
  }

  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'short',
  }).format(date);
};

const getProjectProgress = status => {
  const progressMap = {
    submitted: 10,
    'in-review': 24,
    planning: 42,
    'in-progress': 68,
    completed: 100,
  };

  return progressMap[status] ?? 10;
};

const getMilestones = project => {
  const status = project.status ?? 'submitted';

  const completedSteps = {
    submitted: 1,
    'in-review': 2,
    planning: 3,
    'in-progress': 4,
    completed: 5,
  };

  const currentCompleted =
    completedSteps[status] ?? 1;

  const milestones = [
    {
      id: 'submitted',
      title: 'Project submitted',
      description:
        'Your complete project request was added to Buildly.',
    },
    {
      id: 'review',
      title: 'Buildly review',
      description:
        'Our team reviews the idea, requirements and delivery details.',
    },
    {
      id: 'planning',
      title: 'Project planning',
      description:
        'Scope, milestones, team structure and technical approach are prepared.',
    },
    {
      id: 'development',
      title: 'Product development',
      description:
        'The Buildly team designs, builds and tests the product.',
    },
    {
      id: 'delivery',
      title: 'Launch and delivery',
      description:
        'The completed product is prepared for release and handover.',
    },
  ];

  return milestones.map((milestone, index) => ({
    ...milestone,
    state:
      index < currentCompleted
        ? 'complete'
        : index === currentCompleted
          ? 'active'
          : 'upcoming',
  }));
};

const ArrowIcon = ({ direction = 'right' }) => {
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

const DashboardIcon = () => {
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
        y="3"
        width="7"
        height="7"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <rect
        x="14"
        y="3"
        width="7"
        height="7"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <rect
        x="3"
        y="14"
        width="7"
        height="7"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <rect
        x="14"
        y="14"
        width="7"
        height="7"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.7"
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

const ProposalIcon = () => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 3H15L19 7V21H6V3Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M15 3V7H19"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M9 11H16"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M9 15H16"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M9 19H13"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
};

const PaymentIcon = () => {
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
        y="6"
        width="18"
        height="12"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M3 10H21"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M7 15H11"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
};

const SettingsIcon = () => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="3"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M12 3V5M12 19V21M3 12H5M19 12H21M5.6 5.6L7 7M17 17L18.4 18.4M18.4 5.6L17 7M7 17L5.6 18.4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
};

const MoreIcon = () => {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="5"
        cy="12"
        r="1.4"
        fill="currentColor"
      />

      <circle
        cx="12"
        cy="12"
        r="1.4"
        fill="currentColor"
      />

      <circle
        cx="19"
        cy="12"
        r="1.4"
        fill="currentColor"
      />
    </svg>
  );
};

const BellIcon = () => {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 9C6 5.7 8.7 3 12 3C15.3 3 18 5.7 18 9V13.5L20 17H4L6 13.5V9Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />

      <path
        d="M10 20H14"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
};

const CalendarIcon = () => {
  return (
    <svg
      width="20"
      height="20"
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

const ShieldIcon = () => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 3L19 6V11.5C19 16 16.2 19.6 12 21C7.8 19.6 5 16 5 11.5V6L12 3Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const SparkIcon = () => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 3L13.7 8.3L19 10L13.7 11.7L12 17L10.3 11.7L5 10L10.3 8.3L12 3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />

      <path
        d="M18 16L19 18L21 19L19 20L18 22L17 20L15 19L17 18L18 16Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const DeliverableIcon = () => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 6H19V20H5V6Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M9 3H15V9H9V3Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M8 14H16"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M8 17H13"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
};

const TaskIcon = () => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="4"
        y="5"
        width="16"
        height="15"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M8 10H16"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M8 14H13"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M8 3V7"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M16 3V7"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
};

const BriefRow = ({ label, value }) => {
  return (
    <div className={styles.briefRow}>
      <span>{label}</span>
      <strong>{value || 'Not provided'}</strong>
    </div>
  );
};

const ClientProjectPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const prefersReducedMotion =
    useReducedMotion();

  const [activeSection, setActiveSection] =
    useState('overview');

  const [isSidebarOpen, setIsSidebarOpen] =
    useState(false);

  const [isMenuOpen, setIsMenuOpen] =
    useState(false);

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

  if (!project) {
    return (
      <Navigate
        to="/client/dashboard"
        replace
      />
    );
  }

  const progress = getProjectProgress(
    project.status,
  );

  const milestones = getMilestones(project);

  const features = [
    ...(project.requirements?.features ?? []),
  ];

  if (project.requirements?.customFeature) {
    features.push(
      project.requirements.customFeature,
    );
  }

  const scrollToSection = sectionId => {
    setActiveSection(sectionId);

    const element =
      document.getElementById(sectionId);

    if (element) {
      element.scrollIntoView({
        behavior: prefersReducedMotion
          ? 'auto'
          : 'smooth',
        block: 'start',
      });
    }

    setIsSidebarOpen(false);
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
          x: prefersReducedMotion ? 0 : -20,
          opacity: 0,
        }}
        animate={{
          x: 0,
          opacity: 1,
        }}
      >
        <div className={styles.sidebarHeader}>
          <Link
            to="/"
            className={styles.logo}
            aria-label="Buildly home"
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
            className={styles.mobileCloseButton}
            aria-label="Close menu"
            onClick={() =>
              setIsSidebarOpen(false)
            }
          >
            <CloseIcon />
          </button>
        </div>

        <nav className={styles.workspaceNavigation}>
          <span className={styles.navigationLabel}>
            Workspace
          </span>

          <Link
            to="/client/dashboard"
            className={styles.navigationLink}
          >
            <DashboardIcon />
            Dashboard
          </Link>

          <Link
            to="/client/dashboard"
            className={`${styles.navigationLink} ${styles.navigationLinkActive}`}
          >
            <FolderIcon />
            Projects
          </Link>

          <button
            type="button"
            className={styles.navigationLink}
          >
            <MessageIcon />
            Messages

            <span className={styles.comingSoon}>
              Soon
            </span>
          </button>
        </nav>

        <div className={styles.projectNavigation}>
          <div className={styles.projectNavigationHeader}>
            <span>Current project</span>

            <strong>{project.title}</strong>
          </div>

          {projectSections.map(section => (
            <button
              key={section.id}
              type="button"
              className={
                activeSection === section.id
                  ? styles.projectNavigationActive
                  : ''
              }
              onClick={() =>
                scrollToSection(section.id)
              }
            >
              <span />
              {section.label}
            </button>
          ))}
        </div>

        <div className={styles.sidebarBottom}>
          <button
            type="button"
            className={styles.navigationLink}
          >
            <SettingsIcon />
            Settings
          </button>

          <div className={styles.profileCard}>
            <span className={styles.avatar}>
              RM
            </span>

            <div>
              <strong>Ranim Mimouna</strong>
              <span>Client workspace</span>
            </div>
          </div>
        </div>
      </motion.aside>

      <section className={styles.mainContent}>
        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <button
              type="button"
              className={styles.mobileMenuButton}
              aria-label="Open menu"
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
                navigate('/client/dashboard')
              }
            >
              <ArrowIcon direction="left" />
              Back to dashboard
            </button>
          </div>

          <div className={styles.topbarActions}>
            <button
              type="button"
              className={styles.notificationButton}
              aria-label="Notifications"
            >
              <BellIcon />
              <span />
            </button>

            <div className={styles.moreMenuWrapper}>
              <button
                type="button"
                className={styles.moreButton}
                aria-label="Open project menu"
                aria-expanded={isMenuOpen}
                onClick={() =>
                  setIsMenuOpen(
                    currentValue =>
                      !currentValue,
                  )
                }
              >
                <MoreIcon />
              </button>

              <AnimatePresence>
                {isMenuOpen && (
                  <motion.div
                    className={styles.moreMenu}
                    initial={{
                      opacity: 0,
                      y: -8,
                      scale: 0.98,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      y: -5,
                    }}
                  >
                    <button type="button">
                      Download brief
                    </button>

                    <button type="button">
                      Contact Buildly
                    </button>

                    <button
                      type="button"
                      className={
                        styles.dangerAction
                      }
                    >
                      Archive project
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <div className={styles.content}>
          <motion.section
            id="overview"
            className={styles.projectHero}
            initial={{
              opacity: 0,
              y: prefersReducedMotion
                ? 0
                : 22,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
          >
            <div className={styles.projectHeroMain}>
              <div className={styles.projectMetaTop}>
                <span
                  className={`${styles.statusBadge} ${
                    styles[
                      `status${(
                        project.status ??
                        'submitted'
                      )
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
                >
                  {statusLabels[
                    project.status
                  ] ?? 'Submitted'}
                </span>

                <span>
                  {
                    categoryLabels[
                      project.category
                    ]
                  }
                </span>

                <span>
                  Submitted{' '}
                  {formatDate(
                    project.createdAt,
                  )}
                </span>
              </div>

              <h1>{project.title}</h1>

              <p>{project.description}</p>

              <div className={styles.heroActions}>
                <Link
                  to={`/client/projects/${project.id}/messages`}
                >
                  <MessageIcon />
                  Contact Buildly
                </Link>

                <Link
                  to={`/client/projects/${project.id}/roadmap`}
                >
                  View roadmap
                  <ArrowIcon />
                </Link>

                <Link
                  to={`/client/projects/${project.id}/proposal`}
                >
                  <ProposalIcon />
                  View proposal
                </Link>

                <Link
                  to={`/client/projects/${project.id}/payments`}
                >
                  <PaymentIcon />
                  View payments
                </Link>

                <Link
                  to={`/client/projects/${project.id}/deliverables`}
                >
                  <DeliverableIcon />
                  View deliverables
                </Link>

                <Link
                  to={`/client/projects/${project.id}/tasks`}
                >
                  <TaskIcon />
                  View progress
                </Link>

                <button
                  type="button"
                  onClick={() => scrollToSection('brief')}
                >
                  View submitted brief
                  <ArrowIcon />
                </button>
              </div>
            </div>

            <div className={styles.progressCard}>
              <div className={styles.progressCardHeader}>
                <div>
                  <span>Project progress</span>

                  <strong>{progress}%</strong>
                </div>

                <span className={styles.progressIcon}>
                  <SparkIcon />
                </span>
              </div>

              <div className={styles.progressTrack}>
                <span
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>

              <div className={styles.progressStatus}>
                <strong>
                  {project.status === 'submitted'
                    ? 'Waiting for review'
                    : statusLabels[
                        project.status
                      ]}
                </strong>

                <p>
                  {project.status === 'submitted'
                    ? 'Your request is ready for the Buildly team to review.'
                    : 'Your project is moving through the Buildly delivery process.'}
                </p>
              </div>

              <div className={styles.progressFooter}>
                <span>Next update</span>
                <strong>
                  Within 2 business days
                </strong>
              </div>
            </div>
          </motion.section>

          <section className={styles.summaryGrid}>
            <article>
              <span className={styles.summaryIcon}>
                <CalendarIcon />
              </span>

              <div>
                <span>Preferred timeline</span>
                <strong>
                  {timelineLabels[
                    project.details?.timeline
                  ] ?? 'Not set'}
                </strong>
              </div>
            </article>

            <article>
              <span className={styles.summaryIcon}>
                <ShieldIcon />
              </span>

              <div>
                <span>Budget range</span>
                <strong>
                  {budgetLabels[
                    project.details?.budget
                  ] ?? 'Not set'}
                </strong>
              </div>
            </article>

            <article>
              <span className={styles.summaryIcon}>
                <SparkIcon />
              </span>

              <div>
                <span>Main priority</span>
                <strong>
                  {priorityLabels[
                    project.requirements
                      ?.priority
                  ] ?? 'Not set'}
                </strong>
              </div>
            </article>
          </section>

          <section
            id="brief"
            className={styles.section}
          >
            <div className={styles.sectionHeading}>
              <div>
                <span>Submitted information</span>
                <h2>Project brief</h2>
              </div>

              <span className={styles.readOnlyBadge}>
                Read only
              </span>
            </div>

            <div className={styles.briefGrid}>
              <article className={styles.briefCard}>
                <div className={styles.cardHeader}>
                  <div>
                    <span>01</span>

                    <div>
                      <h3>Project idea</h3>
                      <p>
                        The core product concept.
                      </p>
                    </div>
                  </div>
                </div>

                <div className={styles.cardBody}>
                  <BriefRow
                    label="Category"
                    value={
                      categoryLabels[
                        project.category
                      ]
                    }
                  />

                  <div
                    className={
                      styles.longBriefRow
                    }
                  >
                    <span>Description</span>
                    <p>
                      {project.description}
                    </p>
                  </div>
                </div>
              </article>

              <article className={styles.briefCard}>
                <div className={styles.cardHeader}>
                  <div>
                    <span>02</span>

                    <div>
                      <h3>Requirements</h3>
                      <p>
                        Users, features and product
                        direction.
                      </p>
                    </div>
                  </div>
                </div>

                <div className={styles.cardBody}>
                  <BriefRow
                    label="Project stage"
                    value={
                      stageLabels[
                        project.requirements
                          ?.stage
                      ]
                    }
                  />

                  <BriefRow
                    label="Main priority"
                    value={
                      priorityLabels[
                        project.requirements
                          ?.priority
                      ]
                    }
                  />

                  <div
                    className={
                      styles.longBriefRow
                    }
                  >
                    <span>Target users</span>
                    <p>
                      {
                        project.requirements
                          ?.targetUsers
                      }
                    </p>
                  </div>

                  <div className={styles.tagsRow}>
                    <span>Features</span>

                    <div className={styles.tags}>
                      {features.length > 0 ? (
                        features.map(feature => (
                          <span key={feature}>
                            {feature}
                          </span>
                        ))
                      ) : (
                        <small>
                          No features provided
                        </small>
                      )}
                    </div>
                  </div>

                  {project.requirements?.notes && (
                    <div
                      className={
                        styles.longBriefRow
                      }
                    >
                      <span>
                        Additional notes
                      </span>

                      <p>
                        {
                          project.requirements
                            .notes
                        }
                      </p>
                    </div>
                  )}
                </div>
              </article>

              <article
                className={`${styles.briefCard} ${styles.deliveryCard}`}
              >
                <div className={styles.cardHeader}>
                  <div>
                    <span>03</span>

                    <div>
                      <h3>Delivery details</h3>
                      <p>
                        Timing, budget and support
                        preferences.
                      </p>
                    </div>
                  </div>
                </div>

                <div className={styles.cardBody}>
                  <BriefRow
                    label="Budget"
                    value={
                      budgetLabels[
                        project.details?.budget
                      ]
                    }
                  />

                  <BriefRow
                    label="Timeline"
                    value={
                      timelineLabels[
                        project.details?.timeline
                      ]
                    }
                  />

                  <BriefRow
                    label="Launch date"
                    value={
                      project.details?.launchDate
                        ? formatDate(
                            `${project.details.launchDate}T00:00:00`,
                          )
                        : 'Flexible'
                    }
                  />

                  <BriefRow
                    label="Design status"
                    value={
                      designLabels[
                        project.details
                          ?.designStatus
                      ]
                    }
                  />

                  <BriefRow
                    label="Team setup"
                    value={
                      ownershipLabels[
                        project.details
                          ?.ownership
                      ]
                    }
                  />

                  <BriefRow
                    label="After-launch support"
                    value={
                      supportLabels[
                        project.details?.support
                      ]
                    }
                  />

                  {project.details?.notes && (
                    <div
                      className={
                        styles.longBriefRow
                      }
                    >
                      <span>Delivery notes</span>

                      <p>
                        {project.details.notes}
                      </p>
                    </div>
                  )}
                </div>
              </article>
            </div>
          </section>

          <section
            id="milestones"
            className={styles.section}
          >
            <div className={styles.sectionHeading}>
              <div>
                <span>Delivery process</span>
                <h2>Project milestones</h2>
              </div>
            </div>

            <div className={styles.milestoneCard}>
              {milestones.map(
                (milestone, index) => (
                  <article
                    key={milestone.id}
                    className={`${styles.milestone} ${
                      milestone.state ===
                      'complete'
                        ? styles.milestoneComplete
                        : ''
                    } ${
                      milestone.state ===
                      'active'
                        ? styles.milestoneActive
                        : ''
                    }`}
                  >
                    <div
                      className={
                        styles.milestoneIndicator
                      }
                    >
                      <span>
                        {milestone.state ===
                        'complete' ? (
                          <CheckIcon />
                        ) : (
                          index + 1
                        )}
                      </span>

                      {index <
                        milestones.length - 1 && (
                        <div />
                      )}
                    </div>

                    <div
                      className={
                        styles.milestoneContent
                      }
                    >
                      <div>
                        <h3>
                          {milestone.title}
                        </h3>

                        <span>
                          {milestone.state ===
                          'complete'
                            ? 'Completed'
                            : milestone.state ===
                                'active'
                              ? 'Current stage'
                              : 'Upcoming'}
                        </span>
                      </div>

                      <p>
                        {milestone.description}
                      </p>
                    </div>
                  </article>
                ),
              )}
            </div>
          </section>

          <section
            id="activity"
            className={styles.section}
          >
            <div className={styles.sectionHeading}>
              <div>
                <span>Project updates</span>
                <h2>Recent activity</h2>
              </div>
            </div>

            <div className={styles.activityCard}>
              <article>
                <span className={styles.activityIcon}>
                  <CheckIcon />
                </span>

                <div>
                  <strong>
                    Project submitted
                  </strong>

                  <p>
                    Your complete project request
                    was added to the Buildly
                    workspace.
                  </p>
                </div>

                <time>
                  {formatShortDate(
                    project.createdAt,
                  )}
                </time>
              </article>

              <article>
                <span
                  className={`${styles.activityIcon} ${styles.activityIconPending}`}
                >
                  <SparkIcon />
                </span>

                <div>
                  <strong>
                    Buildly review pending
                  </strong>

                  <p>
                    The team will review your
                    requirements and prepare the
                    next steps.
                  </p>
                </div>

                <time>Next</time>
              </article>
            </div>
          </section>

          <section className={styles.supportBanner}>
            <div>
              <span>Need to add something?</span>

              <h2>
                Talk directly with the Buildly
                team.
              </h2>

              <p>
                Share extra context, links or
                questions before the review begins.
              </p>
            </div>

            <Link
              to={`/client/projects/${project.id}/messages`}
            >
              <MessageIcon />
              Contact Buildly
            </Link>
          </section>
        </div>
      </section>
    </main>
  );
};

export default ClientProjectPage;