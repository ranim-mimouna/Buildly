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

import styles from './ProjectTeamPage.module.css';

const TEAM_STORAGE_KEY = 'buildly-project-teams';

const departmentOptions = [
  {
    id: 'product',
    label: 'Product',
  },
  {
    id: 'project-management',
    label: 'Project Management',
  },
  {
    id: 'design',
    label: 'Design',
  },
  {
    id: 'frontend',
    label: 'Frontend',
  },
  {
    id: 'backend',
    label: 'Backend',
  },
  {
    id: 'full-stack',
    label: 'Full-stack',
  },
  {
    id: 'engineering',
    label: 'Engineering',
  },
  {
    id: 'quality-assurance',
    label: 'Quality Assurance',
  },
  {
    id: 'devops',
    label: 'DevOps',
  },
  {
    id: 'other',
    label: 'Other',
  },
];

const levelOptions = [
  {
    id: 'senior',
    label: 'Senior',
  },
  {
    id: 'mid',
    label: 'Mid-level',
  },
  {
    id: 'junior',
    label: 'Junior',
  },
  {
    id: 'intern',
    label: 'Intern',
  },
];

const availabilityOptions = [
  {
    id: 'available',
    label: 'Available',
  },
  {
    id: 'part-time',
    label: 'Part-time',
  },
  {
    id: 'limited',
    label: 'Limited availability',
  },
  {
    id: 'unavailable',
    label: 'Unavailable',
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

const getStoredTeams = () => {
  const storedTeams = localStorage.getItem(
    TEAM_STORAGE_KEY,
  );

  if (!storedTeams) {
    return {};
  }

  try {
    const parsedTeams = JSON.parse(storedTeams);

    return parsedTeams &&
      typeof parsedTeams === 'object' &&
      !Array.isArray(parsedTeams)
      ? parsedTeams
      : {};
  } catch {
    localStorage.removeItem(TEAM_STORAGE_KEY);

    return {};
  }
};

const createDefaultTeam = project => {
  const createdAt = new Date().toISOString();

  return {
    projectId: project.id,
    updatedAt: createdAt,
    members: [
      {
        id: `member-product-${project.id}`,
        name: 'Product Lead',
        email: 'product@buildly.example',
        role: 'Product Manager',
        level: 'senior',
        department: 'product',
        availability: 'available',
        clientVisible: true,
        isProjectLead: true,
        isReviewer: false,
        internalNotes:
          'Responsible for project direction, client alignment and delivery priorities.',
        createdAt,
        updatedAt: createdAt,
      },
      {
        id: `member-frontend-${project.id}`,
        name: 'Frontend Developer',
        email: 'frontend@buildly.example',
        role: 'Frontend Developer',
        level: 'mid',
        department: 'frontend',
        availability: 'available',
        clientVisible: true,
        isProjectLead: false,
        isReviewer: false,
        internalNotes:
          'Responsible for interface implementation and responsive frontend development.',
        createdAt,
        updatedAt: createdAt,
      },
      {
        id: `member-reviewer-${project.id}`,
        name: 'Senior Reviewer',
        email: 'reviewer@buildly.example',
        role: 'Technical Reviewer',
        level: 'senior',
        department: 'engineering',
        availability: 'part-time',
        clientVisible: true,
        isProjectLead: false,
        isReviewer: true,
        internalNotes:
          'Reviews architecture, code quality, security and delivery readiness.',
        createdAt,
        updatedAt: createdAt,
      },
    ],
  };
};

const getInitials = name => {
  if (!name?.trim()) {
    return '?';
  }

  return name
    .trim()
    .split(/\s+/)
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
};

const getOptionLabel = (
  options,
  optionId,
  fallback = 'Not specified',
) => {
  return (
    options.find(option => option.id === optionId)
      ?.label ?? fallback
  );
};

const formatDate = value => {
  if (!value) {
    return 'Not available';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Not available';
  }

  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
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

const TeamIcon = () => {
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
        r="2.2"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M3.5 19C3.5 15.7 6 13.5 9 13.5C12 13.5 14.5 15.7 14.5 19"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      <path
        d="M15 14.5C18.2 14.5 20.5 16.3 20.5 19"
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

const WarningIcon = () => {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 3L22 20H2L12 3Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />

      <path
        d="M12 9V14M12 17.5V18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
};

const CrownIcon = () => {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 8L8 12L12 5L16 12L20 8L18 18H6L4 8Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const ShieldIcon = () => {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 3L19 6V11C19 15.5 16.2 19 12 21C7.8 19 5 15.5 5 11V6L12 3Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />

      <path
        d="M9 12L11 14L15 10"
        stroke="currentColor"
        strokeWidth="1.7"
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

const ProjectTeamPage = ({
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

  const initialTeam = useMemo(() => {
    if (!project) {
      return null;
    }

    const storedTeams = getStoredTeams();

    return (
      storedTeams[project.id] ??
      createDefaultTeam(project)
    );
  }, [project]);

  const [team, setTeam] = useState(initialTeam);
  const [isSidebarOpen, setIsSidebarOpen] =
    useState(false);
  const [isSaving, setIsSaving] =
    useState(false);
  const [showSavedMessage, setShowSavedMessage] =
    useState(false);

  if (!project || !team) {
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

  const activeMembers = team.members.filter(
    member =>
      member.availability !== 'unavailable',
  );

  const clientVisibleMembers =
    team.members.filter(
      member => member.clientVisible,
    );

  const displayedMembers = isTeam
    ? team.members
    : clientVisibleMembers;

  const projectLead = team.members.find(
    member => member.isProjectLead,
  );

  const reviewer = team.members.find(
    member => member.isReviewer,
  );

  const seniorCount = team.members.filter(
    member => member.level === 'senior',
  ).length;

  const midCount = team.members.filter(
    member => member.level === 'mid',
  ).length;

  const internCount = team.members.filter(
    member => member.level === 'intern',
  ).length;

  const hasTechnicalDeveloper =
    activeMembers.some(member =>
      [
        'frontend',
        'backend',
        'full-stack',
        'engineering',
        'devops',
      ].includes(member.department),
    );

  const warnings = [];

  if (activeMembers.length < 3) {
    warnings.push(
      'This project has fewer than three active team members.',
    );
  }

  if (!projectLead) {
    warnings.push(
      'A project lead has not been assigned.',
    );
  }

  if (!reviewer) {
    warnings.push(
      'A technical reviewer has not been assigned.',
    );
  }

  if (
    projectLead &&
    reviewer &&
    projectLead.id === reviewer.id
  ) {
    warnings.push(
      'The project lead and reviewer should be different people.',
    );
  }

  if (!hasTechnicalDeveloper) {
    warnings.push(
      'No active technical developer is assigned to this project.',
    );
  }

  const updateMember = (
    memberId,
    field,
    value,
  ) => {
    setTeam(currentTeam => ({
      ...currentTeam,
      members: currentTeam.members.map(
        member => {
          if (member.id !== memberId) {
            if (
              field === 'isProjectLead' &&
              value === true
            ) {
              return {
                ...member,
                isProjectLead: false,
              };
            }

            return member;
          }

          return {
            ...member,
            [field]: value,
            updatedAt:
              new Date().toISOString(),
          };
        },
      ),
    }));
  };

  const addMember = () => {
    const createdAt =
      new Date().toISOString();

    setTeam(currentTeam => ({
      ...currentTeam,
      members: [
        ...currentTeam.members,
        {
          id: `member-${Date.now()}`,
          name: 'New team member',
          email: '',
          role: 'Project Contributor',
          level: 'mid',
          department: 'other',
          availability: 'available',
          clientVisible: true,
          isProjectLead: false,
          isReviewer: false,
          internalNotes: '',
          createdAt,
          updatedAt: createdAt,
        },
      ],
    }));
  };

  const removeMember = memberId => {
    setTeam(currentTeam => ({
      ...currentTeam,
      members: currentTeam.members.filter(
        member => member.id !== memberId,
      ),
    }));
  };

  const saveTeam = async () => {
    setIsSaving(true);

    const nextTeam = {
      ...team,
      updatedAt: new Date().toISOString(),
    };

    const storedTeams = getStoredTeams();

    localStorage.setItem(
      TEAM_STORAGE_KEY,
      JSON.stringify({
        ...storedTeams,
        [project.id]: nextTeam,
      }),
    );

    await new Promise(resolve => {
      window.setTimeout(resolve, 450);
    });

    setTeam(nextTeam);
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
          <Link to="/" className={styles.logo}>
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
              ? 'Project team management'
              : 'Your delivery team'}
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
            className={styles.navigationLink}
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
            to={`${basePath}/team`}
            className={`${styles.navigationLink} ${styles.navigationLinkActive}`}
          >
            <TeamIcon />
            Team
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

            {activeMembers.length} active members
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
                  ? 'Team workspace'
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
                  Project team saved
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
                  onClick={addMember}
                >
                  <PlusIcon />
                  Add member
                </button>

                <button
                  type="button"
                  className={
                    styles.primaryButton
                  }
                  disabled={isSaving}
                  onClick={saveTeam}
                >
                  <SaveIcon />

                  {isSaving
                    ? 'Saving'
                    : 'Save team'}
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
                Project collaboration
              </span>

              <h1>Project team</h1>

              <p>
                {isTeam
                  ? 'Build the delivery team, assign clear responsibilities and make sure every project has leadership, technical execution and independent review.'
                  : 'Meet the people responsible for planning, designing, building, testing and reviewing your project.'}
              </p>

              <div className={styles.heroMeta}>
                <span>{project.title}</span>

                <span>
                  {displayedMembers.length}{' '}
                  {displayedMembers.length === 1
                    ? 'member'
                    : 'members'}
                </span>

                <span>
                  Updated{' '}
                  {formatDate(team.updatedAt)}
                </span>
              </div>
            </div>

            <aside className={styles.teamOverview}>
              <span>Team configuration</span>

              <strong>
                {warnings.length === 0
                  ? 'Healthy team'
                  : `${warnings.length} ${
                      warnings.length === 1
                        ? 'warning'
                        : 'warnings'
                    }`}
              </strong>

              <div
                className={
                  styles.configurationStatus
                }
              >
                <span
                  className={
                    warnings.length === 0
                      ? styles.healthyStatus
                      : styles.warningStatus
                  }
                >
                  {warnings.length === 0 ? (
                    <CheckIcon />
                  ) : (
                    <WarningIcon />
                  )}
                </span>

                <p>
                  {warnings.length === 0
                    ? 'This project has leadership, technical delivery and independent review.'
                    : 'Review the team configuration before project execution continues.'}
                </p>
              </div>

              <div className={styles.leadershipGrid}>
                <div>
                  <span>Project lead</span>

                  <strong>
                    {projectLead?.name ??
                      'Not assigned'}
                  </strong>
                </div>

                <div>
                  <span>Reviewer</span>

                  <strong>
                    {reviewer?.name ??
                      'Not assigned'}
                  </strong>
                </div>
              </div>
            </aside>
          </section>

          <section className={styles.summaryGrid}>
            <article>
              <span>Total members</span>
              <strong>{team.members.length}</strong>
              <small>
                Everyone assigned to the project
              </small>
            </article>

            <article>
              <span>Active members</span>
              <strong>{activeMembers.length}</strong>
              <small>
                Available for project work
              </small>
            </article>

            <article>
              <span>Senior members</span>
              <strong>{seniorCount}</strong>
              <small>
                Senior delivery experience
              </small>
            </article>

            <article>
              <span>Client-visible</span>
              <strong>
                {clientVisibleMembers.length}
              </strong>
              <small>
                Members shown to the client
              </small>
            </article>
          </section>

          {isTeam && (
            <section
              className={`${styles.validationPanel} ${
                warnings.length === 0
                  ? styles.validationHealthy
                  : styles.validationWarning
              }`}
            >
              <div
                className={
                  styles.validationHeading
                }
              >
                <span>
                  {warnings.length === 0 ? (
                    <CheckIcon />
                  ) : (
                    <WarningIcon />
                  )}
                </span>

                <div>
                  <h2>
                    {warnings.length === 0
                      ? 'Team configuration looks healthy'
                      : 'Team configuration needs attention'}
                  </h2>

                  <p>
                    Buildly projects should have at
                    least three active members,
                    clear leadership and an
                    independent reviewer.
                  </p>
                </div>
              </div>

              {warnings.length > 0 && (
                <ul>
                  {warnings.map(warning => (
                    <li key={warning}>
                      <WarningIcon />
                      {warning}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          <section className={styles.teamSection}>
            <div className={styles.sectionHeading}>
              <div>
                <span>
                  {isTeam
                    ? 'Assigned people'
                    : 'Delivery specialists'}
                </span>

                <h2>
                  {isTeam
                    ? 'Manage project members'
                    : 'Meet your Buildly team'}
                </h2>
              </div>

              {isTeam && (
                <button
                  type="button"
                  onClick={addMember}
                >
                  <PlusIcon />
                  Add member
                </button>
              )}
            </div>

            {displayedMembers.length > 0 ? (
              <div className={styles.memberGrid}>
                {displayedMembers.map(
                  (member, index) => (
                    <motion.article
                      key={member.id}
                      className={styles.memberCard}
                      initial={{
                        opacity: 0,
                        y: prefersReducedMotion
                          ? 0
                          : 10,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay: index * 0.04,
                      }}
                    >
                      <header
                        className={
                          styles.memberHeader
                        }
                      >
                        <div
                          className={
                            styles.memberIdentity
                          }
                        >
                          <span
                            className={
                              styles.memberAvatar
                            }
                          >
                            {getInitials(
                              member.name,
                            )}
                          </span>

                          <div>
                            {isTeam ? (
                              <input
                                type="text"
                                value={member.name}
                                aria-label="Member name"
                                onChange={event =>
                                  updateMember(
                                    member.id,
                                    'name',
                                    event.target
                                      .value,
                                  )
                                }
                              />
                            ) : (
                              <h3>{member.name}</h3>
                            )}

                            <div
                              className={
                                styles.memberBadges
                              }
                            >
                              {member.isProjectLead && (
                                <span
                                  className={
                                    styles.leadBadge
                                  }
                                >
                                  <CrownIcon />
                                  Project lead
                                </span>
                              )}

                              {member.isReviewer && (
                                <span
                                  className={
                                    styles.reviewerBadge
                                  }
                                >
                                  <ShieldIcon />
                                  Reviewer
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {isTeam && (
                          <button
                            type="button"
                            className={
                              styles.deleteButton
                            }
                            aria-label={`Remove ${member.name}`}
                            onClick={() =>
                              removeMember(
                                member.id,
                              )
                            }
                          >
                            <DeleteIcon />
                          </button>
                        )}
                      </header>

                      {isTeam ? (
                        <div
                          className={
                            styles.memberEditor
                          }
                        >
                          <label
                            className={
                              styles.fullWidthField
                            }
                          >
                            Email address

                            <input
                              type="email"
                              value={member.email}
                              placeholder="member@buildly.com"
                              onChange={event =>
                                updateMember(
                                  member.id,
                                  'email',
                                  event.target
                                    .value,
                                )
                              }
                            />
                          </label>

                          <label
                            className={
                              styles.fullWidthField
                            }
                          >
                            Project role

                            <input
                              type="text"
                              value={member.role}
                              placeholder="Frontend Developer"
                              onChange={event =>
                                updateMember(
                                  member.id,
                                  'role',
                                  event.target
                                    .value,
                                )
                              }
                            />
                          </label>

                          <label>
                            Department

                            <select
                              value={
                                member.department
                              }
                              onChange={event =>
                                updateMember(
                                  member.id,
                                  'department',
                                  event.target
                                    .value,
                                )
                              }
                            >
                              {departmentOptions.map(
                                department => (
                                  <option
                                    key={
                                      department.id
                                    }
                                    value={
                                      department.id
                                    }
                                  >
                                    {
                                      department.label
                                    }
                                  </option>
                                ),
                              )}
                            </select>
                          </label>

                          <label>
                            Seniority

                            <select
                              value={member.level}
                              onChange={event =>
                                updateMember(
                                  member.id,
                                  'level',
                                  event.target
                                    .value,
                                )
                              }
                            >
                              {levelOptions.map(
                                level => (
                                  <option
                                    key={level.id}
                                    value={level.id}
                                  >
                                    {level.label}
                                  </option>
                                ),
                              )}
                            </select>
                          </label>

                          <label
                            className={
                              styles.fullWidthField
                            }
                          >
                            Availability

                            <select
                              value={
                                member.availability
                              }
                              onChange={event =>
                                updateMember(
                                  member.id,
                                  'availability',
                                  event.target
                                    .value,
                                )
                              }
                            >
                              {availabilityOptions.map(
                                availability => (
                                  <option
                                    key={
                                      availability.id
                                    }
                                    value={
                                      availability.id
                                    }
                                  >
                                    {
                                      availability.label
                                    }
                                  </option>
                                ),
                              )}
                            </select>
                          </label>

                          <div
                            className={
                              styles.memberOptions
                            }
                          >
                            <label>
                              <input
                                type="checkbox"
                                checked={
                                  member.clientVisible
                                }
                                onChange={event =>
                                  updateMember(
                                    member.id,
                                    'clientVisible',
                                    event.target
                                      .checked,
                                  )
                                }
                              />

                              Visible to client
                            </label>

                            <label>
                              <input
                                type="checkbox"
                                checked={
                                  member.isProjectLead
                                }
                                onChange={event =>
                                  updateMember(
                                    member.id,
                                    'isProjectLead',
                                    event.target
                                      .checked,
                                  )
                                }
                              />

                              Project lead
                            </label>

                            <label>
                              <input
                                type="checkbox"
                                checked={
                                  member.isReviewer
                                }
                                onChange={event =>
                                  updateMember(
                                    member.id,
                                    'isReviewer',
                                    event.target
                                      .checked,
                                  )
                                }
                              />

                              Technical reviewer
                            </label>
                          </div>

                          <label
                            className={
                              styles.fullWidthField
                            }
                          >
                            Internal notes

                            <textarea
                              rows="4"
                              value={
                                member.internalNotes
                              }
                              placeholder="Private team notes..."
                              onChange={event =>
                                updateMember(
                                  member.id,
                                  'internalNotes',
                                  event.target
                                    .value,
                                )
                              }
                            />
                          </label>
                        </div>
                      ) : (
                        <div
                          className={
                            styles.clientMemberContent
                          }
                        >
                          <p
                            className={
                              styles.memberRole
                            }
                          >
                            {member.role}
                          </p>

                          <div
                            className={
                              styles.memberDetails
                            }
                          >
                            <div>
                              <span>
                                Department
                              </span>

                              <strong>
                                {getOptionLabel(
                                  departmentOptions,
                                  member.department,
                                )}
                              </strong>
                            </div>

                            <div>
                              <span>Experience</span>

                              <strong>
                                {getOptionLabel(
                                  levelOptions,
                                  member.level,
                                )}
                              </strong>
                            </div>

                            <div>
                              <span>
                                Availability
                              </span>

                              <strong>
                                {getOptionLabel(
                                  availabilityOptions,
                                  member.availability,
                                )}
                              </strong>
                            </div>
                          </div>

                          <div
                            className={
                              styles.memberResponsibility
                            }
                          >
                            <span>
                              Project responsibility
                            </span>

                            <p>
                              {member.isProjectLead
                                ? 'Leads project coordination, priorities and client alignment.'
                                : member.isReviewer
                                  ? 'Reviews quality, technical decisions and delivery readiness.'
                                  : `Supports the project through ${getOptionLabel(
                                      departmentOptions,
                                      member.department,
                                    ).toLowerCase()} work and delivery.`}
                            </p>
                          </div>
                        </div>
                      )}
                    </motion.article>
                  ),
                )}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <span>
                  <TeamIcon />
                </span>

                <h3>
                  {isTeam
                    ? 'No team members yet'
                    : 'The project team is being prepared'}
                </h3>

                <p>
                  {isTeam
                    ? 'Add at least three people with clear delivery, leadership and review responsibilities.'
                    : 'Visible project members will appear here after the Buildly team confirms the delivery team.'}
                </p>

                {isTeam && (
                  <button
                    type="button"
                    onClick={addMember}
                  >
                    <PlusIcon />
                    Add first member
                  </button>
                )}
              </div>
            )}
          </section>

          {isTeam && (
            <section
              className={styles.levelSummary}
            >
              <div>
                <span>Team seniority</span>

                <h2>
                  Experience distribution
                </h2>
              </div>

              <div
                className={
                  styles.levelSummaryGrid
                }
              >
                <article>
                  <span>Senior</span>
                  <strong>{seniorCount}</strong>
                </article>

                <article>
                  <span>Mid-level</span>
                  <strong>{midCount}</strong>
                </article>

                <article>
                  <span>Intern</span>
                  <strong>{internCount}</strong>
                </article>
              </div>
            </section>
          )}

          <section className={styles.helpBanner}>
            <div>
              <span>Direct collaboration</span>

              <h2>
                Work with one coordinated project
                team.
              </h2>

              <p>
                Use project messages to discuss
                priorities, questions and delivery
                decisions with the people building
                your product.
              </p>
            </div>

            <Link
              to={`${basePath}/messages`}
            >
              <MessageIcon />
              Open messages
            </Link>
          </section>
        </motion.div>
      </section>
    </main>
  );
};

export default ProjectTeamPage;