import { useMemo, useState } from 'react';
import {
  Link,
  useNavigate,
} from 'react-router-dom';

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from 'motion/react';

import { STORAGE_KEYS } from '../../../constants/storageKeys';
import styles from './TeamDashboardPage.module.css';

const statusFilters = [
  {
    id: 'all',
    label: 'All',
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
    label: 'Development',
  },
  {
    id: 'completed',
    label: 'Completed',
  },
];

const sortOptions = [
  {
    id: 'newest',
    label: 'Newest first',
  },
  {
    id: 'oldest',
    label: 'Oldest first',
  },
  {
    id: 'priority',
    label: 'Priority',
  },
  {
    id: 'budget',
    label: 'Budget',
  },
  {
    id: 'status',
    label: 'Status',
  },
];

const statusLabels = {
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

const priorityLabels = {
  speed: 'Fast launch',
  quality: 'High quality',
  budget: 'Budget focused',
  exploration: 'Needs guidance',
};

const budgetLabels = {
  'under-5k': 'Under €5k',
  '5k-15k': '€5k–15k',
  '15k-30k': '€15k–30k',
  '30k-plus': '€30k+',
  'not-sure': 'Not sure',
};

const timelineLabels = {
  asap: 'ASAP',
  '1-2-months': '1–2 months',
  '3-4-months': '3–4 months',
  flexible: 'Flexible',
};

const statusOrder = {
  submitted: 1,
  'in-review': 2,
  planning: 3,
  'in-progress': 4,
  completed: 5,
};

const priorityOrder = {
  speed: 4,
  quality: 3,
  budget: 2,
  exploration: 1,
};

const budgetOrder = {
  '30k-plus': 5,
  '15k-30k': 4,
  '5k-15k': 3,
  'under-5k': 2,
  'not-sure': 1,
};

const getStoredProjects = () => {
  const savedProjects = localStorage.getItem(
    STORAGE_KEYS.PROJECTS,
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
    localStorage.removeItem(STORAGE_KEYS.PROJECTS);

    return [];
  }
};

const normalizeProject = project => {
  return {
    ...project,
    clientName:
      project.clientName ??
      project.client?.name ??
      'Ranim Mimouna',
  };
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
  const minute = 1000 * 60;
  const hour = minute * 60;
  const day = hour * 24;

  if (difference < minute) {
    return 'Just now';
  }

  if (difference < hour) {
    const minutes = Math.floor(
      difference / minute,
    );

    return `${minutes} min ago`;
  }

  if (difference < day) {
    const hours = Math.floor(
      difference / hour,
    );

    return `${hours} ${
      hours === 1 ? 'hour' : 'hours'
    } ago`;
  }

  const days = Math.floor(difference / day);

  if (days === 1) {
    return 'Yesterday';
  }

  if (days < 7) {
    return `${days} days ago`;
  }

  return formatDate(value);
};

const getTodaySubmissions = projects => {
  const today = new Date();

  return projects.filter(project => {
    const createdAt = new Date(
      project.createdAt,
    );

    return (
      createdAt.getFullYear() ===
        today.getFullYear() &&
      createdAt.getMonth() ===
        today.getMonth() &&
      createdAt.getDate() === today.getDate()
    );
  }).length;
};

const sortProjects = (projects, sortBy) => {
  const sortedProjects = [...projects];

  if (sortBy === 'oldest') {
    return sortedProjects.sort(
      (firstProject, secondProject) =>
        new Date(firstProject.createdAt) -
        new Date(secondProject.createdAt),
    );
  }

  if (sortBy === 'priority') {
    return sortedProjects.sort(
      (firstProject, secondProject) =>
        (priorityOrder[
          secondProject.requirements?.priority
        ] ?? 0) -
        (priorityOrder[
          firstProject.requirements?.priority
        ] ?? 0),
    );
  }

  if (sortBy === 'budget') {
    return sortedProjects.sort(
      (firstProject, secondProject) =>
        (budgetOrder[
          secondProject.details?.budget
        ] ?? 0) -
        (budgetOrder[
          firstProject.details?.budget
        ] ?? 0),
    );
  }

  if (sortBy === 'status') {
    return sortedProjects.sort(
      (firstProject, secondProject) =>
        (statusOrder[firstProject.status] ??
          99) -
        (statusOrder[secondProject.status] ??
          99),
    );
  }

  return sortedProjects.sort(
    (firstProject, secondProject) =>
      new Date(secondProject.createdAt) -
      new Date(firstProject.createdAt),
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

const UsersIcon = () => {
  return (
    <svg
      width="18"
      height="18"
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

      <circle
        cx="17"
        cy="9"
        r="2.3"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M3.5 20C3.5 16.4 5.8 14 9 14C12.2 14 14.5 16.4 14.5 20"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      <path
        d="M15.5 14.8C18.4 14.8 20.5 16.8 20.5 19.6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
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

const AnalyticsIcon = () => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 20V11M10 20V5M16 20V9M22 20V3"
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

const FilterIcon = () => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 6H20M7 12H17M10 18H14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
};

const ClockIcon = () => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M12 7V12L15.5 14"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
};

const AttentionIcon = () => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 3L21 20H3L12 3Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />

      <path
        d="M12 9V14"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      <circle
        cx="12"
        cy="17"
        r="1"
        fill="currentColor"
      />
    </svg>
  );
};

const ProjectIcon = () => {
  return (
    <svg
      width="22"
      height="22"
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
        d="M7 9H17M7 13H14M7 17H11"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
};

const EmptyIcon = () => {
  return (
    <svg
      width="27"
      height="27"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 7.5C3 6.1 4.1 5 5.5 5H9L11 7H18.5C19.9 7 21 8.1 21 9.5V17.5C21 18.9 19.9 20 18.5 20H5.5C4.1 20 3 18.9 3 17.5V7.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const ProjectRow = ({
  project,
  index,
  reducedMotion,
}) => {
  const projectStatus =
    project.status ?? 'submitted';

  return (
    <motion.tr
      initial={{
        opacity: 0,
        y: reducedMotion ? 0 : 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.38,
        delay: index * 0.035,
      }}
    >
      <td>
        <div className={styles.projectIdentity}>
          <span className={styles.projectIcon}>
            <ProjectIcon />
          </span>

          <div>
            <strong>{project.title}</strong>

            <span>
              {project.description ||
                'ShipPilot project request'}
            </span>
          </div>
        </div>
      </td>

      <td>
        <span className={styles.categoryBadge}>
          {categoryLabels[project.category] ??
            'Digital product'}
        </span>
      </td>

      <td>
        <div className={styles.clientCell}>
          <span>
            {project.clientName
              .split(' ')
              .map(name => name[0])
              .join('')
              .slice(0, 2)}
          </span>

          <strong>{project.clientName}</strong>
        </div>
      </td>

      <td>
        <span className={styles.priorityCell}>
          {priorityLabels[
            project.requirements?.priority
          ] ?? 'Not set'}
        </span>
      </td>

      <td>
        <strong className={styles.standardCell}>
          {budgetLabels[
            project.details?.budget
          ] ?? 'Not set'}
        </strong>
      </td>

      <td>
        <strong className={styles.standardCell}>
          {timelineLabels[
            project.details?.timeline
          ] ?? 'Not set'}
        </strong>
      </td>

      <td>
        <span
          className={`${styles.statusBadge} ${
            styles[
              `status${projectStatus
                .split('-')
                .map(
                  word =>
                    word.charAt(0).toUpperCase() +
                    word.slice(1),
                )
                .join('')}`
            ] ?? ''
          }`}
        >
          {statusLabels[projectStatus] ??
            'Submitted'}
        </span>
      </td>

      <td>
        <span className={styles.dateCell}>
          {formatDate(project.createdAt)}
        </span>
      </td>

      <td>
        <Link
          to={`/team/projects/${project.id}`}
          className={styles.openButton}
          aria-label={`Open ${project.title}`}
        >
          <ArrowIcon />
        </Link>
      </td>
    </motion.tr>
  );
};

const MobileProjectCard = ({
  project,
  index,
  reducedMotion,
}) => {
  const projectStatus =
    project.status ?? 'submitted';

  return (
    <motion.article
      className={styles.mobileProjectCard}
      initial={{
        opacity: 0,
        y: reducedMotion ? 0 : 14,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
      }}
      whileHover={
        reducedMotion
          ? undefined
          : {
              y: -3,
            }
      }
    >
      <div className={styles.mobileProjectTop}>
        <span className={styles.projectIcon}>
          <ProjectIcon />
        </span>

        <span
          className={`${styles.statusBadge} ${
            styles[
              `status${projectStatus
                .split('-')
                .map(
                  word =>
                    word.charAt(0).toUpperCase() +
                    word.slice(1),
                )
                .join('')}`
            ] ?? ''
          }`}
        >
          {statusLabels[projectStatus] ??
            'Submitted'}
        </span>
      </div>

      <div className={styles.mobileProjectCopy}>
        <span>
          {categoryLabels[project.category] ??
            'Digital product'}
        </span>

        <h3>{project.title}</h3>

        <p>
          {project.description ||
            'ShipPilot project request'}
        </p>
      </div>

      <div className={styles.mobileProjectMeta}>
        <div>
          <span>Client</span>
          <strong>{project.clientName}</strong>
        </div>

        <div>
          <span>Priority</span>
          <strong>
            {priorityLabels[
              project.requirements?.priority
            ] ?? 'Not set'}
          </strong>
        </div>

        <div>
          <span>Budget</span>
          <strong>
            {budgetLabels[
              project.details?.budget
            ] ?? 'Not set'}
          </strong>
        </div>

        <div>
          <span>Timeline</span>
          <strong>
            {timelineLabels[
              project.details?.timeline
            ] ?? 'Not set'}
          </strong>
        </div>
      </div>

      <Link
        to={`/team/projects/${project.id}`}
        className={styles.mobileOpenButton}
      >
        Open project
        <ArrowIcon />
      </Link>
    </motion.article>
  );
};

const TeamDashboardPage = () => {
  const navigate = useNavigate();
  const prefersReducedMotion =
    useReducedMotion();

  const projects = useMemo(
    () =>
      getStoredProjects().map(normalizeProject),
    [],
  );

  const [selectedStatus, setSelectedStatus] =
    useState('all');

  const [selectedSort, setSelectedSort] =
    useState('newest');

  const [searchValue, setSearchValue] =
    useState('');

  const [isSidebarOpen, setIsSidebarOpen] =
    useState(false);

  const [isSortOpen, setIsSortOpen] =
    useState(false);

  const filteredProjects = useMemo(() => {
    const normalizedSearch = searchValue
      .trim()
      .toLowerCase();

    const matchingProjects = projects.filter(
      project => {
        const matchesStatus =
          selectedStatus === 'all' ||
          project.status === selectedStatus;

        const searchableContent = [
          project.title,
          project.description,
          categoryLabels[project.category],
          project.clientName,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        const matchesSearch =
          !normalizedSearch ||
          searchableContent.includes(
            normalizedSearch,
          );

        return matchesStatus && matchesSearch;
      },
    );

    return sortProjects(
      matchingProjects,
      selectedSort,
    );
  }, [
    projects,
    searchValue,
    selectedSort,
    selectedStatus,
  ]);

  const statistics = useMemo(() => {
    return {
      total: projects.length,
      needsReview: projects.filter(project =>
        ['submitted', 'in-review'].includes(
          project.status,
        ),
      ).length,
      planning: projects.filter(
        project =>
          project.status === 'planning',
      ).length,
      inProgress: projects.filter(
        project =>
          project.status === 'in-progress',
      ).length,
    };
  }, [projects]);

  const reviewQueue = useMemo(() => {
    const waitingProjects = projects.filter(
      project =>
        project.status === 'submitted',
    );

    return {
      waiting: waitingProjects.length,
      averageReview:
        waitingProjects.length > 0
          ? '18 hours'
          : 'No queue',
      today: getTodaySubmissions(projects),
    };
  }, [projects]);

  const selectedSortLabel =
    sortOptions.find(
      option => option.id === selectedSort,
    )?.label ?? 'Newest first';

  const recentActivity = projects
    .slice()
    .sort(
      (firstProject, secondProject) =>
        new Date(secondProject.createdAt) -
        new Date(firstProject.createdAt),
    )
    .slice(0, 5);

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
            aria-label="ShipPilot home"
          >
            <span className={styles.logoMark}>
              <span />
              <span />
              <span />
            </span>

            <span>ShipPilot</span>
          </Link>

          <button
            type="button"
            className={
              styles.mobileCloseButton
            }
            aria-label="Close menu"
            onClick={() =>
              setIsSidebarOpen(false)
            }
          >
            <CloseIcon />
          </button>
        </div>

        <div className={styles.teamBadge}>
          <span>Internal</span>

          <strong>Team workspace</strong>
        </div>

        <nav className={styles.navigation}>
          <span className={styles.navigationLabel}>
            Workspace
          </span>

          <Link
            to="/team/dashboard"
            className={`${styles.navigationLink} ${styles.navigationLinkActive}`}
          >
            <DashboardIcon />
            Dashboard
          </Link>

          <Link
            to="/team/dashboard"
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
            <UsersIcon />
            Clients
          </button>

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

          <button
            type="button"
            className={styles.navigationLink}
          >
            <AnalyticsIcon />
            Analytics
          </button>

          <span
            className={`${styles.navigationLabel} ${styles.secondaryLabel}`}
          >
            System
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
          <div className={styles.capacityCard}>
            <span>Team capacity</span>

            <div>
              <strong>68%</strong>
              <small>Available</small>
            </div>

            <div className={styles.capacityTrack}>
              <span />
            </div>

            <p>
              The team can currently take on new
              discovery and planning work.
            </p>
          </div>

          <div className={styles.profileCard}>
            <span className={styles.avatar}>
              BM
            </span>

            <div>
              <strong>ShipPilot Manager</strong>
              <span>Team administrator</span>
            </div>

            <button
              type="button"
              aria-label="Open profile menu"
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
            aria-label="Open navigation"
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
              placeholder="Search projects or clients"
              aria-label="Search projects or clients"
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
              className={
                styles.notificationButton
              }
              aria-label="Notifications"
            >
              <BellIcon />
              <span />
            </button>

            <button
              type="button"
              className={styles.newProjectButton}
              onClick={() =>
                navigate('/client/projects/new')
              }
            >
              <PlusIcon />
              New project
            </button>
          </div>
        </header>

        <motion.div
          className={styles.dashboardContent}
          initial={{
            opacity: 0,
            y: prefersReducedMotion ? 0 : 18,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.55,
          }}
        >
          <section className={styles.heroSection}>
            <div>
              <span className={styles.eyebrow}>
                ShipPilot operations
              </span>

              <h1>
                Good morning
                <span> 👋</span>
              </h1>

              <p>
                Review incoming requests, organize
                active work and keep every ShipPilot
                project moving.
              </p>
            </div>

            <div className={styles.heroMeta}>
              <span>Team workspace</span>

              <strong>
                {statistics.needsReview}{' '}
                projects need attention
              </strong>

              <p>
                New submissions should receive
                their first review within two
                business days.
              </p>
            </div>
          </section>

          <section className={styles.statisticsGrid}>
            <motion.article
              whileHover={
                prefersReducedMotion
                  ? undefined
                  : {
                      y: -4,
                    }
              }
            >
              <div>
                <span>Total projects</span>
                <strong>{statistics.total}</strong>
              </div>

              <small>
                All client submissions
              </small>
            </motion.article>

            <motion.article
              whileHover={
                prefersReducedMotion
                  ? undefined
                  : {
                      y: -4,
                    }
              }
            >
              <div>
                <span>Needs review</span>
                <strong>
                  {statistics.needsReview}
                </strong>
              </div>

              <small>
                Submitted or under review
              </small>
            </motion.article>

            <motion.article
              whileHover={
                prefersReducedMotion
                  ? undefined
                  : {
                      y: -4,
                    }
              }
            >
              <div>
                <span>Planning</span>
                <strong>
                  {statistics.planning}
                </strong>
              </div>

              <small>
                Scope and team preparation
              </small>
            </motion.article>

            <motion.article
              whileHover={
                prefersReducedMotion
                  ? undefined
                  : {
                      y: -4,
                    }
              }
            >
              <div>
                <span>In development</span>
                <strong>
                  {statistics.inProgress}
                </strong>
              </div>

              <small>
                Projects actively being built
              </small>
            </motion.article>
          </section>

          <section className={styles.workspaceGrid}>
            <div className={styles.projectsPanel}>
              <div className={styles.panelHeader}>
                <div>
                  <span>Project pipeline</span>
                  <h2>All projects</h2>
                </div>

                <div
                  className={
                    styles.panelHeaderActions
                  }
                >
                  <div
                    className={
                      styles.sortWrapper
                    }
                  >
                    <button
                      type="button"
                      className={styles.sortButton}
                      aria-expanded={isSortOpen}
                      onClick={() =>
                        setIsSortOpen(
                          currentValue =>
                            !currentValue,
                        )
                      }
                    >
                      <FilterIcon />
                      {selectedSortLabel}
                    </button>

                    <AnimatePresence>
                      {isSortOpen && (
                        <motion.div
                          className={
                            styles.sortMenu
                          }
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
                          {sortOptions.map(
                            option => (
                              <button
                                key={option.id}
                                type="button"
                                className={
                                  selectedSort ===
                                  option.id
                                    ? styles.sortOptionActive
                                    : ''
                                }
                                onClick={() => {
                                  setSelectedSort(
                                    option.id,
                                  );

                                  setIsSortOpen(
                                    false,
                                  );
                                }}
                              >
                                {option.label}
                              </button>
                            ),
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
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
                        selectedStatus ===
                        filter.id
                          ? styles.filterActive
                          : ''
                      }
                      onClick={() =>
                        setSelectedStatus(
                          filter.id,
                        )
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
                <>
                  <div
                    className={
                      styles.tableWrapper
                    }
                  >
                    <table
                      className={styles.projectTable}
                    >
                      <thead>
                        <tr>
                          <th>Project</th>
                          <th>Category</th>
                          <th>Client</th>
                          <th>Priority</th>
                          <th>Budget</th>
                          <th>Timeline</th>
                          <th>Status</th>
                          <th>Created</th>
                          <th>
                            <span
                              className={
                                styles.visuallyHidden
                              }
                            >
                              Open
                            </span>
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {filteredProjects.map(
                          (project, index) => (
                            <ProjectRow
                              key={project.id}
                              project={project}
                              index={index}
                              reducedMotion={
                                prefersReducedMotion
                              }
                            />
                          ),
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div
                    className={
                      styles.mobileProjects
                    }
                  >
                    {filteredProjects.map(
                      (project, index) => (
                        <MobileProjectCard
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
                </>
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
                    <EmptyIcon />
                  </span>

                  <h3>
                    {projects.length === 0
                      ? 'No submitted projects'
                      : 'No matching projects'}
                  </h3>

                  <p>
                    {projects.length === 0
                      ? 'Client project submissions will appear here automatically.'
                      : 'Try another status, sorting option or search term.'}
                  </p>
                </motion.div>
              )}
            </div>

            <aside className={styles.insightsColumn}>
              <motion.section
                className={styles.reviewQueue}
                whileHover={
                  prefersReducedMotion
                    ? undefined
                    : {
                        y: -3,
                      }
                }
              >
                <div
                  className={
                    styles.insightHeader
                  }
                >
                  <div>
                    <span>Priority queue</span>
                    <h2>Needs attention</h2>
                  </div>

                  <span
                    className={
                      styles.attentionIcon
                    }
                  >
                    <AttentionIcon />
                  </span>
                </div>

                <div className={styles.queueStats}>
                  <article>
                    <span>Waiting projects</span>
                    <strong>
                      {reviewQueue.waiting}
                    </strong>
                  </article>

                  <article>
                    <span>Average review</span>
                    <strong>
                      {reviewQueue.averageReview}
                    </strong>
                  </article>

                  <article>
                    <span>
                      Today&apos;s submissions
                    </span>
                    <strong>
                      {reviewQueue.today}
                    </strong>
                  </article>
                </div>

                {projects.find(
                  project =>
                    project.status ===
                    'submitted',
                ) ? (
                  <Link
                    to={`/team/projects/${
                      projects.find(
                        project =>
                          project.status ===
                          'submitted',
                      ).id
                    }`}
                  >
                    Review next project
                    <ArrowIcon />
                  </Link>
                ) : (
                  <span
                    className={
                      styles.queueComplete
                    }
                  >
                    Review queue is clear
                  </span>
                )}
              </motion.section>

              <section className={styles.activityPanel}>
                <div
                  className={
                    styles.activityHeading
                  }
                >
                  <div>
                    <span>Live workspace</span>
                    <h2>Recent activity</h2>
                  </div>

                  <ClockIcon />
                </div>

                <div className={styles.activityList}>
                  {recentActivity.length > 0 ? (
                    recentActivity.map(
                      (project, index) => (
                        <article key={project.id}>
                          <div
                            className={
                              styles.activityTimeline
                            }
                          >
                            <span />

                            {index <
                              recentActivity.length -
                                1 && <div />}
                          </div>

                          <div
                            className={
                              styles.activityContent
                            }
                          >
                            <strong>
                              Project submitted
                            </strong>

                            <p>
                              “{project.title}” was
                              added by{' '}
                              {project.clientName}.
                            </p>

                            <time>
                              {formatRelativeDate(
                                project.createdAt,
                              )}
                            </time>
                          </div>
                        </article>
                      ),
                    )
                  ) : (
                    <p
                      className={
                        styles.activityEmpty
                      }
                    >
                      Team activity will appear
                      after the first client
                      submission.
                    </p>
                  )}
                </div>
              </section>
            </aside>
          </section>
        </motion.div>
      </section>
    </main>
  );
};

export default TeamDashboardPage;