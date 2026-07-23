import { useMemo, useState } from 'react';
import {
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from 'motion/react';

import styles from './ClientDashboardPage.module.css';

const statusFilters = [
  {
    id: 'all',
    label: 'All projects',
  },
  {
    id: 'submitted',
    label: 'Submitted',
  },
  {
    id: 'in-review',
    label: 'In review',
  },
  {
    id: 'planning',
    label: 'Planning',
  },
  {
    id: 'in-progress',
    label: 'In progress',
  },
  {
    id: 'completed',
    label: 'Completed',
  },
];

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

const categoryIcons = {
  'web-app': 'window',
  'mobile-app': 'mobile',
  saas: 'grid',
  marketplace: 'store',
  'ai-product': 'spark',
  'internal-tool': 'tool',
  ecommerce: 'bag',
  other: 'dots',
};

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
    return 'Recently';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Recently';
  }

  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

const formatRelativeDate = value => {
  if (!value) {
    return 'Recently';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Recently';
  }

  const difference = Date.now() - date.getTime();
  const day = 1000 * 60 * 60 * 24;
  const days = Math.floor(difference / day);

  if (days <= 0) {
    return 'Today';
  }

  if (days === 1) {
    return 'Yesterday';
  }

  if (days < 7) {
    return `${days} days ago`;
  }

  return formatDate(value);
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

const PlusIcon = () => {
  return (
    <svg
      width="18"
      height="18"
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

const SearchIcon = () => {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="11"
        cy="11"
        r="7"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="M16.5 16.5L21 21"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
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
        d="M19 13.5V10.5L16.8 9.8C16.6 9.3 16.3 8.8 16 8.4L16.9 6.3L14.7 4.1L12.6 5C12.1 4.8 11.6 4.6 11.1 4.5L10.5 2H7.5L6.9 4.5C6.4 4.6 5.9 4.8 5.4 5L3.3 4.1L1.1 6.3L2 8.4C1.7 8.8 1.4 9.3 1.2 9.8L-1 10.5V13.5L1.2 14.2C1.4 14.7 1.7 15.2 2 15.6L1.1 17.7L3.3 19.9L5.4 19C5.9 19.2 6.4 19.4 6.9 19.5L7.5 22H10.5L11.1 19.5C11.6 19.4 12.1 19.2 12.6 19L14.7 19.9L16.9 17.7L16 15.6C16.3 15.2 16.6 14.7 16.8 14.2L19 13.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
        transform="translate(3 0)"
      />
    </svg>
  );
};

const ProjectCategoryIcon = ({ type }) => {
  const icon = categoryIcons[type] ?? 'dots';

  if (icon === 'window') {
    return (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <rect
          x="3"
          y="4"
          width="18"
          height="16"
          rx="3"
          stroke="currentColor"
          strokeWidth="1.7"
        />

        <path
          d="M3 8H21"
          stroke="currentColor"
          strokeWidth="1.7"
        />
      </svg>
    );
  }

  if (icon === 'mobile') {
    return (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <rect
          x="7"
          y="2.5"
          width="10"
          height="19"
          rx="2.5"
          stroke="currentColor"
          strokeWidth="1.7"
        />

        <circle
          cx="12"
          cy="18.5"
          r="0.9"
          fill="currentColor"
        />
      </svg>
    );
  }

  if (icon === 'spark') {
    return (
      <svg
        width="24"
        height="24"
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
  }

  if (icon === 'store') {
    return (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M4 9L6 4H18L20 9"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />

        <path
          d="M5 10V20H19V10"
          stroke="currentColor"
          strokeWidth="1.7"
        />

        <path
          d="M9 20V14H15V20"
          stroke="currentColor"
          strokeWidth="1.7"
        />
      </svg>
    );
  }

  if (icon === 'bag') {
    return (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M5 8H19L18 21H6L5 8Z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />

        <path
          d="M9 9V6C9 4.3 10.3 3 12 3C13.7 3 15 4.3 15 6V9"
          stroke="currentColor"
          strokeWidth="1.7"
        />
      </svg>
    );
  }

  if (icon === 'tool') {
    return (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M14.5 5.5C16.4 3.6 19.2 3.4 21.2 4.8L17.5 8.5L15.5 8L15 6L18.7 2.3"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d="M14.5 9.5L6.8 17.2C5.8 18.2 4.2 18.2 3.2 17.2C2.2 16.2 2.2 14.6 3.2 13.6L10.9 5.9"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (icon === 'grid') {
    return (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <rect
          x="3"
          y="4"
          width="18"
          height="6"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.7"
        />

        <rect
          x="3"
          y="14"
          width="8"
          height="6"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.7"
        />

        <rect
          x="15"
          y="14"
          width="6"
          height="6"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.7"
        />
      </svg>
    );
  }

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="5"
        cy="12"
        r="1.5"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <circle
        cx="12"
        cy="12"
        r="1.5"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <circle
        cx="19"
        cy="12"
        r="1.5"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
};

const ProjectCard = ({
  project,
  index,
  reducedMotion,
}) => {
  const progress =
    project.status === 'completed'
      ? 100
      : project.status === 'in-progress'
        ? 68
        : project.status === 'planning'
          ? 42
          : project.status === 'in-review'
            ? 22
            : 10;

  return (
    <motion.article
      className={styles.projectCard}
      initial={{
        opacity: 0,
        y: reducedMotion ? 0 : 18,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.45,
        delay: index * 0.06,
      }}
      whileHover={
        reducedMotion
          ? undefined
          : {
              y: -5,
            }
      }
    >
      <div className={styles.projectCardTop}>
        <span className={styles.projectIcon}>
          <ProjectCategoryIcon
            type={project.category}
          />
        </span>

        <span
          className={`${styles.statusBadge} ${
            styles[
              `status${project.status
                ?.split('-')
                .map(
                  word =>
                    word.charAt(0).toUpperCase() +
                    word.slice(1),
                )
                .join('')}`
            ] ?? ''
          }`}
        >
          {statusLabels[project.status] ??
            'Submitted'}
        </span>
      </div>

      <div className={styles.projectCardCopy}>
        <span>
          {categoryLabels[project.category] ??
            'Digital product'}
        </span>

        <h3>{project.title}</h3>

        <p>
          {project.description ||
            'Your Buildly project request.'}
        </p>
      </div>

      <div className={styles.projectProgress}>
        <div className={styles.progressHeader}>
          <span>Project progress</span>
          <strong>{progress}%</strong>
        </div>

        <div className={styles.progressTrack}>
          <span
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>

      <div className={styles.projectMeta}>
        <div>
          <span>Submitted</span>
          <strong>
            {formatDate(project.createdAt)}
          </strong>
        </div>

        <div>
          <span>Priority</span>
          <strong>
            {project.requirements?.priority
              ? project.requirements.priority
                  .replace('-', ' ')
                  .replace(/^\w/, letter =>
                    letter.toUpperCase(),
                  )
              : 'Not set'}
          </strong>
        </div>
      </div>

      <Link
        to={`/client/projects/${project.id}`}
        className={styles.openProjectButton}
      >
        Open project
        <ArrowIcon />
      </Link>
    </motion.article>
  );
};

const ClientDashboardPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const prefersReducedMotion =
    useReducedMotion();

  const projects = useMemo(
    () => getStoredProjects(),
    [],
  );

  const [selectedFilter, setSelectedFilter] =
    useState('all');

  const [searchValue, setSearchValue] =
    useState('');

  const [isSidebarOpen, setIsSidebarOpen] =
    useState(false);

  const [showSuccess, setShowSuccess] =
    useState(
      Boolean(location.state?.projectSubmitted),
    );

  const filteredProjects = useMemo(() => {
    const normalizedSearch = searchValue
      .trim()
      .toLowerCase();

    return projects.filter(project => {
      const matchesStatus =
        selectedFilter === 'all' ||
        project.status === selectedFilter;

      const matchesSearch =
        !normalizedSearch ||
        project.title
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        project.description
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        categoryLabels[project.category]
          ?.toLowerCase()
          .includes(normalizedSearch);

      return matchesStatus && matchesSearch;
    });
  }, [
    projects,
    selectedFilter,
    searchValue,
  ]);

  const statistics = useMemo(() => {
    return {
      total: projects.length,
      active: projects.filter(project =>
        [
          'submitted',
          'in-review',
          'planning',
          'in-progress',
        ].includes(project.status),
      ).length,
      inProgress: projects.filter(
        project =>
          project.status === 'in-progress',
      ).length,
      completed: projects.filter(
        project =>
          project.status === 'completed',
      ).length,
    };
  }, [projects]);

  const latestProject = projects[0];

  const dismissSuccess = () => {
    setShowSuccess(false);

    navigate(location.pathname, {
      replace: true,
      state: {},
    });
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

        <nav className={styles.navigation}>
          <span className={styles.navigationLabel}>
            Workspace
          </span>

          <Link
            to="/client/dashboard"
            className={`${styles.navigationLink} ${styles.navigationLinkActive}`}
          >
            <DashboardIcon />
            Dashboard
          </Link>

          <Link
            to="/client/dashboard"
            className={styles.navigationLink}
          >
            <FolderIcon />
            Projects

            {projects.length > 0 && (
              <span className={styles.navCount}>
                {projects.length}
              </span>
            )}
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

          <span
            className={`${styles.navigationLabel} ${styles.secondaryLabel}`}
          >
            Account
          </span>

          <button
            type="button"
            className={styles.navigationLink}
          >
            <SettingsIcon />
            Settings
          </button>
        </nav>

        <div className={styles.sidebarBottom}>
          <div className={styles.supportCard}>
            <span>Need help?</span>

            <strong>
              Talk to the Buildly team
            </strong>

            <p>
              We are here to help shape your
              project.
            </p>

            <button type="button">
              Contact support
            </button>
          </div>

          <div className={styles.profileCard}>
            <span className={styles.avatar}>
              RM
            </span>

            <div>
              <strong>Ranim Mimouna</strong>
              <span>Client workspace</span>
            </div>

            <button
              type="button"
              aria-label="Open profile options"
            >
              •••
            </button>
          </div>
        </div>
      </motion.aside>

      <section className={styles.mainContent}>
        <header className={styles.topbar}>
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

          <div className={styles.search}>
            <SearchIcon />

            <input
              type="search"
              value={searchValue}
              placeholder="Search projects"
              aria-label="Search projects"
              onChange={event => {
                setSearchValue(
                  event.target.value,
                );
              }}
            />

            <span>⌘ K</span>
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

            <Link
              to="/client/projects/new"
              className={styles.topbarNewProject}
            >
              <PlusIcon />
              New project
            </Link>
          </div>
        </header>

        <div className={styles.dashboardContent}>
          <AnimatePresence>
            {showSuccess && (
              <motion.div
                className={styles.successBanner}
                initial={{
                  opacity: 0,
                  y: -12,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  height: 0,
                  marginBottom: 0,
                }}
              >
                <span className={styles.successIcon}>
                  <CheckIcon />
                </span>

                <div>
                  <strong>
                    Project submitted successfully
                  </strong>

                  <p>
                    Your Buildly request has been
                    saved and is ready for review.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={dismissSuccess}
                  aria-label="Dismiss message"
                >
                  <CloseIcon />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <section className={styles.heroSection}>
            <div>
              <span className={styles.eyebrow}>
                Client workspace
              </span>

              <h1>
                Welcome back,
                <br />
                Ranim.
              </h1>

              <p>
                Track your Buildly projects,
                review progress and start your
                next product idea.
              </p>
            </div>

            <motion.div
              className={styles.heroActionCard}
              whileHover={
                prefersReducedMotion
                  ? undefined
                  : {
                      y: -4,
                    }
              }
            >
              <span>Have another idea?</span>

              <strong>
                Turn it into your next project.
              </strong>

              <Link to="/client/projects/new">
                Start a new project
                <ArrowIcon />
              </Link>
            </motion.div>
          </section>

          <section
            className={styles.statisticsGrid}
          >
            <article>
              <span>Total projects</span>
              <strong>{statistics.total}</strong>
              <small>
                All submitted Buildly requests
              </small>
            </article>

            <article>
              <span>Active projects</span>
              <strong>{statistics.active}</strong>
              <small>
                Currently being reviewed or built
              </small>
            </article>

            <article>
              <span>In progress</span>
              <strong>
                {statistics.inProgress}
              </strong>
              <small>
                Projects in active development
              </small>
            </article>

            <article>
              <span>Completed</span>
              <strong>
                {statistics.completed}
              </strong>
              <small>
                Successfully delivered projects
              </small>
            </article>
          </section>

          {latestProject && (
            <motion.section
              className={styles.latestProject}
              initial={{
                opacity: 0,
                y: prefersReducedMotion
                  ? 0
                  : 18,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
            >
              <div
                className={
                  styles.latestProjectContent
                }
              >
                <span>Latest project</span>

                <h2>{latestProject.title}</h2>

                <p>
                  {latestProject.description}
                </p>

                <div
                  className={
                    styles.latestProjectMeta
                  }
                >
                  <span>
                    {
                      categoryLabels[
                        latestProject.category
                      ]
                    }
                  </span>

                  <span>
                    {formatRelativeDate(
                      latestProject.createdAt,
                    )}
                  </span>

                  <span>
                    {statusLabels[
                      latestProject.status
                    ] ?? 'Submitted'}
                  </span>
                </div>

                <Link
                  to={`/client/projects/${latestProject.id}`}
                >
                  View project
                  <ArrowIcon />
                </Link>
              </div>

              <div
                className={
                  styles.latestProjectVisual
                }
              >
                <div>
                  <ProjectCategoryIcon
                    type={latestProject.category}
                  />
                </div>

                <span />
                <span />
                <span />
              </div>
            </motion.section>
          )}

          <section className={styles.projectsSection}>
            <div className={styles.sectionHeading}>
              <div>
                <span>Your workspace</span>
                <h2>Projects</h2>
              </div>

              <Link to="/client/projects/new">
                <PlusIcon />
                New project
              </Link>
            </div>

            <div className={styles.filters}>
              {statusFilters.map(filter => {
                const count =
                  filter.id === 'all'
                    ? projects.length
                    : projects.filter(
                        project =>
                          project.status ===
                          filter.id,
                      ).length;

                return (
                  <button
                    key={filter.id}
                    type="button"
                    className={
                      selectedFilter === filter.id
                        ? styles.filterActive
                        : ''
                    }
                    onClick={() =>
                      setSelectedFilter(filter.id)
                    }
                  >
                    {filter.label}

                    {count > 0 && (
                      <span>{count}</span>
                    )}
                  </button>
                );
              })}
            </div>

            {filteredProjects.length > 0 ? (
              <div
                className={styles.projectsGrid}
              >
                {filteredProjects.map(
                  (project, index) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      index={index}
                      reducedMotion={
                        prefersReducedMotion
                      }
                    />
                  ),
                )}
              </div>
            ) : (
              <motion.div
                className={styles.emptyState}
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
              >
                <span>
                  <FolderIcon />
                </span>

                <h3>
                  {projects.length === 0
                    ? 'No projects yet'
                    : 'No matching projects'}
                </h3>

                <p>
                  {projects.length === 0
                    ? 'Submit your first idea and start building with a human team powered by AI.'
                    : 'Try another status filter or search term.'}
                </p>

                {projects.length === 0 && (
                  <Link to="/client/projects/new">
                    Start your first project
                    <ArrowIcon />
                  </Link>
                )}
              </motion.div>
            )}
          </section>

          <section className={styles.activitySection}>
            <div className={styles.sectionHeading}>
              <div>
                <span>Latest updates</span>
                <h2>Recent activity</h2>
              </div>
            </div>

            <div className={styles.activityList}>
              {projects.length > 0 ? (
                projects
                  .slice(0, 4)
                  .map(project => (
                    <article key={project.id}>
                      <span
                        className={
                          styles.activityIcon
                        }
                      >
                        <CheckIcon />
                      </span>

                      <div>
                        <strong>
                          Project submitted
                        </strong>

                        <p>
                          “{project.title}” was
                          added to your workspace.
                        </p>
                      </div>

                      <time>
                        {formatRelativeDate(
                          project.createdAt,
                        )}
                      </time>
                    </article>
                  ))
              ) : (
                <div
                  className={
                    styles.activityEmpty
                  }
                >
                  Project activity will appear
                  here after your first submission.
                </div>
              )}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
};

export default ClientDashboardPage;