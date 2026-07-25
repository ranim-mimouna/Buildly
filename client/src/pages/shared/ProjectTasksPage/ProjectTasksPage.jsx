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

import styles from './ProjectTasksPage.module.css';

const columns = [
  {
    id: 'backlog',
    label: 'Backlog',
    description: 'Planned work',
  },
  {
    id: 'todo',
    label: 'To do',
    description: 'Ready to start',
  },
  {
    id: 'in-progress',
    label: 'In progress',
    description: 'Currently being built',
  },
  {
    id: 'review',
    label: 'Review',
    description: 'Testing and approval',
  },
  {
    id: 'completed',
    label: 'Completed',
    description: 'Finished work',
  },
];

const priorities = [
  {
    id: 'low',
    label: 'Low',
  },
  {
    id: 'medium',
    label: 'Medium',
  },
  {
    id: 'high',
    label: 'High',
  },
  {
    id: 'urgent',
    label: 'Urgent',
  },
];

const teamMembers = [
  {
    id: 'unassigned',
    name: 'Unassigned',
    initials: '—',
  },
  {
    id: 'product-lead',
    name: 'Product Lead',
    initials: 'PL',
  },
  {
    id: 'designer',
    name: 'Product Designer',
    initials: 'PD',
  },
  {
    id: 'frontend',
    name: 'Frontend Developer',
    initials: 'FD',
  },
  {
    id: 'backend',
    name: 'Backend Developer',
    initials: 'BD',
  },
  {
    id: 'qa',
    name: 'QA Engineer',
    initials: 'QA',
  },
];

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
  const storedProjects = localStorage.getItem(
    'buildly-projects',
  );

  if (!storedProjects) {
    return [];
  }

  try {
    const parsedProjects = JSON.parse(
      storedProjects,
    );

    return Array.isArray(parsedProjects)
      ? parsedProjects
      : [];
  } catch {
    localStorage.removeItem('buildly-projects');

    return [];
  }
};

const getStoredTasks = () => {
  const storedTasks = localStorage.getItem(
    'buildly-project-tasks',
  );

  if (!storedTasks) {
    return {};
  }

  try {
    const parsedTasks = JSON.parse(storedTasks);

    return parsedTasks &&
      typeof parsedTasks === 'object' &&
      !Array.isArray(parsedTasks)
      ? parsedTasks
      : {};
  } catch {
    localStorage.removeItem(
      'buildly-project-tasks',
    );

    return {};
  }
};

const createDefaultBoard = project => {
  const createdAt = new Date().toISOString();

  return {
    projectId: project.id,
    updatedAt: createdAt,
    tasks: [
      {
        id: `task-review-${project.id}`,
        title: 'Review client requirements',
        description:
          'Confirm the submitted brief, required features and expected project outcome.',
        status: 'completed',
        priority: 'high',
        assigneeId: 'product-lead',
        milestone: 'Discovery and project review',
        dueDate: '',
        clientVisible: true,
        createdAt,
        updatedAt: createdAt,
      },
      {
        id: `task-flows-${project.id}`,
        title: 'Create primary user flows',
        description:
          'Define the main user journeys before interface design begins.',
        status: 'in-progress',
        priority: 'high',
        assigneeId: 'designer',
        milestone: 'Product design',
        dueDate: '',
        clientVisible: true,
        createdAt,
        updatedAt: createdAt,
      },
      {
        id: `task-architecture-${project.id}`,
        title: 'Prepare technical architecture',
        description:
          'Define the application structure, data model and main technical decisions.',
        status: 'todo',
        priority: 'medium',
        assigneeId: 'backend',
        milestone: 'Scope and technical planning',
        dueDate: '',
        clientVisible: false,
        createdAt,
        updatedAt: createdAt,
      },
      {
        id: `task-interface-${project.id}`,
        title: 'Build the first interface module',
        description:
          'Implement the first approved product section as a working release.',
        status: 'backlog',
        priority: 'medium',
        assigneeId: 'frontend',
        milestone: 'Development and testing',
        dueDate: '',
        clientVisible: true,
        createdAt,
        updatedAt: createdAt,
      },
    ],
  };
};

const formatDate = value => {
  if (!value) {
    return 'No due date';
  }

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return 'No due date';
  }

  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

const getInitials = name => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
};

const getAssignee = assigneeId => {
  return (
    teamMembers.find(
      member => member.id === assigneeId,
    ) ?? teamMembers[0]
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
        y="4"
        width="16"
        height="16"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M8 9L10 11L14 7M8 16H16"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
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

const ProposalIcon = () => {
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
        y="3"
        width="16"
        height="18"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M8 8H16M8 12H16M8 16H12"
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
        y="5"
        width="18"
        height="14"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M3 10H21M7 15H11"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
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
        d="M5 3H15L20 8V21H5V3Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />

      <path
        d="M15 3V8H20M9 13H16M9 17H14"
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
        d="M7 7L8 21H16L17 7"
        stroke="currentColor"
        strokeWidth="1.7"
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

const ProjectTasksPage = ({
  role = 'client',
}) => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const prefersReducedMotion =
    useReducedMotion();

  const isTeam = role === 'team';

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

  const initialBoard = useMemo(() => {
    if (!project) {
      return null;
    }

    const storedBoards = getStoredTasks();

    return (
      storedBoards[project.id] ??
      createDefaultBoard(project)
    );
  }, [project]);

  const [board, setBoard] =
    useState(initialBoard);

  const [searchValue, setSearchValue] =
    useState('');

  const [priorityFilter, setPriorityFilter] =
    useState('all');

  const [isSidebarOpen, setIsSidebarOpen] =
    useState(false);

  const [isSaving, setIsSaving] =
    useState(false);

  const [showSavedMessage, setShowSavedMessage] =
    useState(false);

  const [editingTaskId, setEditingTaskId] =
    useState(null);

  if (!project || !board) {
    return (
      <Navigate
        to={
          isTeam
            ? '/team/dashboard'
            : '/client/dashboard'
        }
        replace
      />
    );
  }

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

  const visibleTasks = board.tasks.filter(
    task =>
      (isTeam || task.clientVisible) &&
      (!searchValue.trim() ||
        task.title
          .toLowerCase()
          .includes(
            searchValue.trim().toLowerCase(),
          ) ||
        task.description
          .toLowerCase()
          .includes(
            searchValue.trim().toLowerCase(),
          ) ||
        task.milestone
          .toLowerCase()
          .includes(
            searchValue.trim().toLowerCase(),
          )) &&
      (priorityFilter === 'all' ||
        task.priority === priorityFilter),
  );

  const completedCount = visibleTasks.filter(
    task => task.status === 'completed',
  ).length;

  const inProgressCount = visibleTasks.filter(
    task => task.status === 'in-progress',
  ).length;

  const reviewCount = visibleTasks.filter(
    task => task.status === 'review',
  ).length;

  const progress =
    visibleTasks.length === 0
      ? 0
      : Math.round(
          (completedCount /
            visibleTasks.length) *
            100,
        );

  const updateTask = (
    taskId,
    field,
    value,
  ) => {
    setBoard(currentBoard => ({
      ...currentBoard,
      tasks: currentBoard.tasks.map(task =>
        task.id === taskId
          ? {
              ...task,
              [field]: value,
              updatedAt:
                new Date().toISOString(),
            }
          : task,
      ),
    }));
  };

  const addTask = () => {
    const createdAt =
      new Date().toISOString();

    const newTask = {
      id: `task-${Date.now()}`,
      title: 'New project task',
      description:
        'Describe what must be completed and the expected result.',
      status: 'backlog',
      priority: 'medium',
      assigneeId: 'unassigned',
      milestone: 'General project work',
      dueDate: '',
      clientVisible: false,
      createdAt,
      updatedAt: createdAt,
    };

    setBoard(currentBoard => ({
      ...currentBoard,
      tasks: [
        ...currentBoard.tasks,
        newTask,
      ],
    }));

    setEditingTaskId(newTask.id);
  };

  const deleteTask = taskId => {
    setBoard(currentBoard => ({
      ...currentBoard,
      tasks: currentBoard.tasks.filter(
        task => task.id !== taskId,
      ),
    }));

    if (editingTaskId === taskId) {
      setEditingTaskId(null);
    }
  };

  const persistBoard = nextBoard => {
    const storedBoards = getStoredTasks();

    localStorage.setItem(
      'buildly-project-tasks',
      JSON.stringify({
        ...storedBoards,
        [project.id]: nextBoard,
      }),
    );
  };

  const handleSave = async () => {
    setIsSaving(true);

    const nextBoard = {
      ...board,
      updatedAt: new Date().toISOString(),
    };

    persistBoard(nextBoard);

    await new Promise(resolve => {
      window.setTimeout(resolve, 450);
    });

    setBoard(nextBoard);
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
              ? 'Project execution'
              : 'Delivery progress'}
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
            to={`${basePath}/tasks`}
            className={`${styles.navigationLink} ${styles.navigationLinkActive}`}
          >
            <TaskIcon />
            Tasks
          </Link>

          <Link
            to={`${basePath}/roadmap`}
            className={styles.navigationLink}
          >
            <RoadmapIcon />
            Roadmap
          </Link>

          <Link
            to={`${basePath}/proposal`}
            className={styles.navigationLink}
          >
            <ProposalIcon />
            Proposal
          </Link>

          <Link
            to={`${basePath}/payments`}
            className={styles.navigationLink}
          >
            <PaymentIcon />
            Payments
          </Link>

          <Link
            to={`${basePath}/deliverables`}
            className={styles.navigationLink}
          >
            <DeliverableIcon />
            Deliverables
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
            {progress}% task progress
          </div>
        </div>

        <div className={styles.sidebarBottom}>
          <div className={styles.profile}>
            <span>
              {isTeam
                ? 'BT'
                : getInitials(clientName)}
            </span>

            <div>
              <strong>
                {isTeam
                  ? 'Buildly Team'
                  : clientName}
              </strong>

              <small>
                {isTeam
                  ? 'Execution workspace'
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
              onClick={() => navigate(basePath)}
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
                  Task board saved
                </motion.span>
              )}
            </AnimatePresence>

            {isTeam && (
              <>
                <button
                  type="button"
                  className={
                    styles.secondaryButton
                  }
                  onClick={addTask}
                >
                  <PlusIcon />
                  Add task
                </button>

                <button
                  type="button"
                  className={
                    styles.primaryButton
                  }
                  disabled={isSaving}
                  onClick={handleSave}
                >
                  <SaveIcon />
                  {isSaving
                    ? 'Saving'
                    : 'Save board'}
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
                Project execution
              </span>

              <h1>Task board</h1>

              <p>
                {isTeam
                  ? 'Break the approved project scope into clear, assignable work and track every task through delivery.'
                  : 'Follow the client-visible work currently planned, being developed, reviewed and completed.'}
              </p>

              <div className={styles.heroMeta}>
                <span>{project.title}</span>

                <span>
                  {visibleTasks.length} visible
                  tasks
                </span>

                <span>
                  {progress}% completed
                </span>
              </div>
            </div>

            <aside className={styles.progressCard}>
              <span>Task completion</span>

              <strong>{progress}%</strong>

              <div className={styles.progressTrack}>
                <span
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>

              <div className={styles.progressValues}>
                <div>
                  <span>In progress</span>
                  <strong>
                    {inProgressCount}
                  </strong>
                </div>

                <div>
                  <span>Review</span>
                  <strong>{reviewCount}</strong>
                </div>

                <div>
                  <span>Completed</span>
                  <strong>
                    {completedCount}
                  </strong>
                </div>
              </div>
            </aside>
          </section>

          <section className={styles.filters}>
            <div className={styles.search}>
              <SearchIcon />

              <input
                type="search"
                value={searchValue}
                placeholder="Search tasks"
                aria-label="Search tasks"
                onChange={event =>
                  setSearchValue(
                    event.target.value,
                  )
                }
              />
            </div>

            <select
              value={priorityFilter}
              aria-label="Filter by priority"
              onChange={event =>
                setPriorityFilter(
                  event.target.value,
                )
              }
            >
              <option value="all">
                All priorities
              </option>

              {priorities.map(priority => (
                <option
                  key={priority.id}
                  value={priority.id}
                >
                  {priority.label}
                </option>
              ))}
            </select>

            {isTeam && (
              <button
                type="button"
                onClick={addTask}
              >
                <PlusIcon />
                New task
              </button>
            )}
          </section>

          <section className={styles.board}>
            {columns.map(column => {
              const columnTasks =
                visibleTasks.filter(
                  task =>
                    task.status === column.id,
                );

              return (
                <article
                  key={column.id}
                  className={styles.column}
                >
                  <header
                    className={styles.columnHeader}
                  >
                    <div>
                      <span
                        className={`${styles.columnDot} ${styles[column.id]}`}
                      />

                      <div>
                        <h2>{column.label}</h2>
                        <p>
                          {column.description}
                        </p>
                      </div>
                    </div>

                    <strong>
                      {columnTasks.length}
                    </strong>
                  </header>

                  <div className={styles.taskList}>
                    {columnTasks.map(
                      (task, index) => {
                        const assignee =
                          getAssignee(
                            task.assigneeId,
                          );

                        return (
                          <motion.button
                            key={task.id}
                            type="button"
                            className={
                              styles.taskCard
                            }
                            initial={{
                              opacity: 0,
                              y: prefersReducedMotion
                                ? 0
                                : 8,
                            }}
                            animate={{
                              opacity: 1,
                              y: 0,
                            }}
                            transition={{
                              delay:
                                index * 0.03,
                            }}
                            onClick={() =>
                              setEditingTaskId(
                                task.id,
                              )
                            }
                          >
                            <div
                              className={
                                styles.taskTop
                              }
                            >
                              <span
                                className={`${styles.priorityBadge} ${styles[task.priority]}`}
                              >
                                {
                                  priorities.find(
                                    priority =>
                                      priority.id ===
                                      task.priority,
                                  )?.label
                                }
                              </span>

                              {task.clientVisible && (
                                <span
                                  className={
                                    styles.visibleBadge
                                  }
                                >
                                  Client
                                </span>
                              )}
                            </div>

                            <h3>{task.title}</h3>

                            <p>
                              {task.description}
                            </p>

                            <div
                              className={
                                styles.milestone
                              }
                            >
                              {task.milestone}
                            </div>

                            <footer>
                              <div
                                className={
                                  styles.assignee
                                }
                              >
                                <span>
                                  {
                                    assignee.initials
                                  }
                                </span>

                                <small>
                                  {assignee.name}
                                </small>
                              </div>

                              <time>
                                {formatDate(
                                  task.dueDate,
                                )}
                              </time>
                            </footer>
                          </motion.button>
                        );
                      },
                    )}

                    {columnTasks.length === 0 && (
                      <div
                        className={
                          styles.emptyColumn
                        }
                      >
                        No tasks
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </section>

          <section className={styles.helpBanner}>
            <div>
              <span>Execution visibility</span>

              <h2>
                Keep project work clear from start
                to finish.
              </h2>

              <p>
                Client-visible tasks communicate
                progress without exposing private
                team notes or internal work.
              </p>
            </div>

            <Link
              to={`${basePath}/messages`}
            >
              <MessageIcon />
              Discuss progress
            </Link>
          </section>
        </motion.div>
      </section>

      <AnimatePresence>
        {editingTaskId && (
          <motion.div
            className={styles.modalOverlay}
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
          >
            {(() => {
              const selectedTask =
                board.tasks.find(
                  task =>
                    task.id === editingTaskId,
                );

              if (!selectedTask) {
                return null;
              }

              const selectedAssignee =
                getAssignee(
                  selectedTask.assigneeId,
                );

              return (
                <motion.section
                  className={styles.modal}
                  initial={{
                    opacity: 0,
                    y: prefersReducedMotion
                      ? 0
                      : 20,
                    scale: 0.98,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    y: prefersReducedMotion
                      ? 0
                      : 12,
                  }}
                >
                  <header>
                    <div>
                      <span>Project task</span>
                      <h2>
                        {isTeam
                          ? 'Edit task'
                          : selectedTask.title}
                      </h2>
                    </div>

                    <button
                      type="button"
                      aria-label="Close task"
                      onClick={() =>
                        setEditingTaskId(null)
                      }
                    >
                      <CloseIcon />
                    </button>
                  </header>

                  {isTeam ? (
                    <div
                      className={
                        styles.taskEditor
                      }
                    >
                      <label>
                        Task title

                        <input
                          type="text"
                          value={
                            selectedTask.title
                          }
                          onChange={event =>
                            updateTask(
                              selectedTask.id,
                              'title',
                              event.target.value,
                            )
                          }
                        />
                      </label>

                      <label>
                        Description

                        <textarea
                          rows="5"
                          value={
                            selectedTask.description
                          }
                          onChange={event =>
                            updateTask(
                              selectedTask.id,
                              'description',
                              event.target.value,
                            )
                          }
                        />
                      </label>

                      <label>
                        Connected milestone

                        <input
                          type="text"
                          value={
                            selectedTask.milestone
                          }
                          onChange={event =>
                            updateTask(
                              selectedTask.id,
                              'milestone',
                              event.target.value,
                            )
                          }
                        />
                      </label>

                      <div
                        className={
                          styles.editorGrid
                        }
                      >
                        <label>
                          Status

                          <select
                            value={
                              selectedTask.status
                            }
                            onChange={event =>
                              updateTask(
                                selectedTask.id,
                                'status',
                                event.target
                                  .value,
                              )
                            }
                          >
                            {columns.map(
                              column => (
                                <option
                                  key={column.id}
                                  value={column.id}
                                >
                                  {column.label}
                                </option>
                              ),
                            )}
                          </select>
                        </label>

                        <label>
                          Priority

                          <select
                            value={
                              selectedTask.priority
                            }
                            onChange={event =>
                              updateTask(
                                selectedTask.id,
                                'priority',
                                event.target
                                  .value,
                              )
                            }
                          >
                            {priorities.map(
                              priority => (
                                <option
                                  key={priority.id}
                                  value={
                                    priority.id
                                  }
                                >
                                  {
                                    priority.label
                                  }
                                </option>
                              ),
                            )}
                          </select>
                        </label>

                        <label>
                          Assignee

                          <select
                            value={
                              selectedTask.assigneeId
                            }
                            onChange={event =>
                              updateTask(
                                selectedTask.id,
                                'assigneeId',
                                event.target
                                  .value,
                              )
                            }
                          >
                            {teamMembers.map(
                              member => (
                                <option
                                  key={member.id}
                                  value={member.id}
                                >
                                  {member.name}
                                </option>
                              ),
                            )}
                          </select>
                        </label>

                        <label>
                          Due date

                          <input
                            type="date"
                            value={
                              selectedTask.dueDate
                            }
                            onChange={event =>
                              updateTask(
                                selectedTask.id,
                                'dueDate',
                                event.target
                                  .value,
                              )
                            }
                          />
                        </label>
                      </div>

                      <label
                        className={
                          styles.checkboxLabel
                        }
                      >
                        <input
                          type="checkbox"
                          checked={
                            selectedTask.clientVisible
                          }
                          onChange={event =>
                            updateTask(
                              selectedTask.id,
                              'clientVisible',
                              event.target.checked,
                            )
                          }
                        />

                        Show this task to the client
                      </label>

                      <div
                        className={
                          styles.modalActions
                        }
                      >
                        <button
                          type="button"
                          className={
                            styles.deleteTaskButton
                          }
                          onClick={() =>
                            deleteTask(
                              selectedTask.id,
                            )
                          }
                        >
                          <DeleteIcon />
                          Delete task
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setEditingTaskId(null)
                          }
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={
                        styles.clientTaskView
                      }
                    >
                      <p>
                        {
                          selectedTask.description
                        }
                      </p>

                      <div>
                        <span>Status</span>
                        <strong>
                          {
                            columns.find(
                              column =>
                                column.id ===
                                selectedTask.status,
                            )?.label
                          }
                        </strong>
                      </div>

                      <div>
                        <span>Priority</span>
                        <strong>
                          {
                            priorities.find(
                              priority =>
                                priority.id ===
                                selectedTask.priority,
                            )?.label
                          }
                        </strong>
                      </div>

                      <div>
                        <span>Milestone</span>
                        <strong>
                          {
                            selectedTask.milestone
                          }
                        </strong>
                      </div>

                      <div>
                        <span>Assigned team</span>
                        <strong>
                          {
                            selectedAssignee.name
                          }
                        </strong>
                      </div>

                      <div>
                        <span>Due date</span>
                        <strong>
                          {formatDate(
                            selectedTask.dueDate,
                          )}
                        </strong>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setEditingTaskId(null)
                        }
                      >
                        Close
                      </button>
                    </div>
                  )}
                </motion.section>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default ProjectTasksPage;