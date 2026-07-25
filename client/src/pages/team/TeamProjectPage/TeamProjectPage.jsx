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

import styles from './TeamProjectPage.module.css';

const statusOptions = [
  {
    id: 'submitted',
    label: 'Submitted',
    description: 'Waiting for the first Buildly review.',
  },
  {
    id: 'in-review',
    label: 'In review',
    description: 'The team is reviewing the request.',
  },
  {
    id: 'planning',
    label: 'Planning',
    description: 'Scope, architecture and delivery are being planned.',
  },
  {
    id: 'in-progress',
    label: 'Development',
    description: 'The project is actively being built.',
  },
  {
    id: 'completed',
    label: 'Completed',
    description: 'The project has been delivered.',
  },
];

const teamMembers = [
  {
    id: 'yesser',
    name: 'Yesser Mimouna',
    role: 'Technical Lead',
    initials: 'YM',
  },
  {
    id: 'ranim',
    name: 'Ranim Mimouna',
    role: 'Product Manager',
    initials: 'RM',
  },
  {
    id: 'sami',
    name: 'Sami Ben Ali',
    role: 'Senior Developer',
    initials: 'SB',
  },
  {
    id: 'nour',
    name: 'Nour Trabelsi',
    role: 'UI/UX Designer',
    initials: 'NT',
  },
  {
    id: 'aziz',
    name: 'Aziz Gharbi',
    role: 'Full-stack Developer',
    initials: 'AG',
  },
];

const internalPriorities = [
  {
    id: 'low',
    label: 'Low',
  },
  {
    id: 'normal',
    label: 'Normal',
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
    id: 'submission',
    label: 'Client submission',
  },
  {
    id: 'delivery',
    label: 'Delivery',
  },
  {
    id: 'internal',
    label: 'Internal workspace',
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

const formatDateTime = value => {
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
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const getProgress = status => {
  const values = {
    submitted: 10,
    'in-review': 24,
    planning: 42,
    'in-progress': 68,
    completed: 100,
  };

  return values[status] ?? 10;
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

const RoadmapIcon = () => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 7H20"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M4 12H16"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M4 17H20"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <circle
        cx="18"
        cy="12"
        r="2"
        fill="currentColor"
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

const BriefRow = ({ label, value }) => {
  return (
    <div className={styles.briefRow}>
      <span>{label}</span>
      <strong>{value || 'Not provided'}</strong>
    </div>
  );
};

const TeamProjectPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const prefersReducedMotion =
    useReducedMotion();

  const projects = useMemo(
    () => getStoredProjects(),
    [],
  );

  const storedProject = useMemo(
    () =>
      projects.find(
        project => project.id === projectId,
      ),
    [projectId, projects],
  );

  const [project, setProject] =
    useState(storedProject);

  const [activeSection, setActiveSection] =
    useState('overview');

  const [isSidebarOpen, setIsSidebarOpen] =
    useState(false);

  const [status, setStatus] = useState(
    storedProject?.status ?? 'submitted',
  );

  const [assignedMembers, setAssignedMembers] =
    useState(
      storedProject?.internal?.assignedMembers ??
        [],
    );

  const [internalPriority, setInternalPriority] =
    useState(
      storedProject?.internal?.priority ??
        'normal',
    );

  const [internalNotes, setInternalNotes] =
    useState(
      storedProject?.internal?.notes ?? '',
    );

  const [isSaving, setIsSaving] =
    useState(false);

  const [showSavedMessage, setShowSavedMessage] =
    useState(false);

  if (!storedProject || !project) {
    return (
      <Navigate
        to="/team/dashboard"
        replace
      />
    );
  }

  const progress = getProgress(status);

  const features = [
    ...(project.requirements?.features ?? []),
  ];

  if (project.requirements?.customFeature) {
    features.push(
      project.requirements.customFeature,
    );
  }

  const clientName =
    project.clientName ??
    project.client?.name ??
    'Ranim Mimouna';

  const handleMemberToggle = memberId => {
    setAssignedMembers(currentMembers => {
      if (currentMembers.includes(memberId)) {
        return currentMembers.filter(
          id => id !== memberId,
        );
      }

      return [...currentMembers, memberId];
    });
  };

  const handleSave = async () => {
    setIsSaving(true);

    const updatedProject = {
      ...project,
      status,
      updatedAt: new Date().toISOString(),
      internal: {
        ...(project.internal ?? {}),
        assignedMembers,
        priority: internalPriority,
        notes: internalNotes.trim(),
        lastUpdatedBy: 'Buildly Manager',
        lastUpdatedAt: new Date().toISOString(),
      },
    };

    const updatedProjects = projects.map(
      currentProject =>
        currentProject.id === project.id
          ? updatedProject
          : currentProject,
    );

    localStorage.setItem(
      'buildly-projects',
      JSON.stringify(updatedProjects),
    );

    localStorage.setItem(
      'buildly-last-updated-project',
      JSON.stringify(updatedProject),
    );

    await new Promise(resolve => {
      window.setTimeout(resolve, 550);
    });

    setProject(updatedProject);
    setIsSaving(false);
    setShowSavedMessage(true);

    window.setTimeout(() => {
      setShowSavedMessage(false);
    }, 2600);
  };

  const scrollToSection = sectionId => {
    setActiveSection(sectionId);

    document
      .getElementById(sectionId)
      ?.scrollIntoView({
        behavior: prefersReducedMotion
          ? 'auto'
          : 'smooth',
        block: 'start',
      });

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
            onClick={() =>
              setIsSidebarOpen(false)
            }
            aria-label="Close navigation"
          >
            <CloseIcon />
          </button>
        </div>

        <div className={styles.internalBadge}>
          <span>Internal workspace</span>
          <strong>Team operations</strong>
        </div>

        <nav className={styles.navigation}>
          <span className={styles.navigationLabel}>
            Workspace
          </span>

          <Link
            to="/team/dashboard"
            className={styles.navigationLink}
          >
            <DashboardIcon />
            Dashboard
          </Link>

          <Link
            to="/team/dashboard"
            className={`${styles.navigationLink} ${styles.navigationLinkActive}`}
          >
            <FolderIcon />
            Projects
          </Link>

          <Link
            to={`/team/projects/${project.id}/messages`}
            className={styles.saveButton}
          >
            <MessageIcon />
            Message client
          </Link>

          <Link
            to={`/team/projects/${project.id}/roadmap`}
            className={styles.saveButton}
          >
            <RoadmapIcon />
            Manage roadmap
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
        </nav>

        <div className={styles.projectNavigation}>
          <div>
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
            <span>BM</span>

            <div>
              <strong>Buildly Manager</strong>
              <small>Team administrator</small>
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
              onClick={() =>
                setIsSidebarOpen(true)
              }
              aria-label="Open navigation"
            >
              <MenuIcon />
            </button>

            <button
              type="button"
              className={styles.backButton}
              onClick={() =>
                navigate('/team/dashboard')
              }
            >
              <ArrowIcon direction="left" />
              Back to team dashboard
            </button>
          </div>

          <div className={styles.topbarActions}>
            <AnimatePresence>
              {showSavedMessage && (
                <motion.span
                  className={styles.savedMessage}
                  initial={{
                    opacity: 0,
                    y: -6,
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
                  Changes saved
                </motion.span>
              )}
            </AnimatePresence>

            <button
              type="button"
              className={styles.saveButton}
              disabled={isSaving}
              onClick={handleSave}
            >
              {isSaving ? (
                <span className={styles.spinner} />
              ) : (
                <SaveIcon />
              )}

              {isSaving
                ? 'Saving'
                : 'Save changes'}
            </button>
          </div>
        </header>

        <div className={styles.content}>
          <motion.section
            id="overview"
            className={styles.hero}
            initial={{
              opacity: 0,
              y: prefersReducedMotion ? 0 : 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
          >
            <div className={styles.heroMain}>
              <div className={styles.heroMeta}>
                <span>
                  {categoryLabels[
                    project.category
                  ] ?? 'Digital product'}
                </span>

                <span>{clientName}</span>

                <span>
                  Submitted{' '}
                  {formatDate(project.createdAt)}
                </span>
              </div>

              <h1>{project.title}</h1>

              <p>{project.description}</p>

              <div className={styles.heroFooter}>
                <div>
                  <span>Client priority</span>
                  <strong>
                    {priorityLabels[
                      project.requirements
                        ?.priority
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
            </div>

            <aside className={styles.statusCard}>
              <span className={styles.cardEyebrow}>
                Project management
              </span>

              <h2>Current status</h2>

              <select
                value={status}
                onChange={event =>
                  setStatus(event.target.value)
                }
              >
                {statusOptions.map(option => (
                  <option
                    key={option.id}
                    value={option.id}
                  >
                    {option.label}
                  </option>
                ))}
              </select>

              <div className={styles.progressHeader}>
                <span>Overall progress</span>
                <strong>{progress}%</strong>
              </div>

              <div className={styles.progressTrack}>
                <span
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>

              <p>
                {
                  statusOptions.find(
                    option =>
                      option.id === status,
                  )?.description
                }
              </p>
            </aside>
          </motion.section>

          <section className={styles.summaryGrid}>
            <article>
              <span>Client</span>
              <strong>{clientName}</strong>
              <small>Project owner</small>
            </article>

            <article>
              <span>Created</span>
              <strong>
                {formatDate(project.createdAt)}
              </strong>
              <small>Initial submission</small>
            </article>

            <article>
              <span>Last updated</span>
              <strong>
                {formatDate(
                  project.updatedAt ??
                    project.createdAt,
                )}
              </strong>
              <small>Latest workspace change</small>
            </article>

            <article>
              <span>Assigned members</span>
              <strong>
                {assignedMembers.length}
              </strong>
              <small>Buildly collaborators</small>
            </article>
          </section>

          <section
            id="submission"
            className={styles.section}
          >
            <div className={styles.sectionHeading}>
              <div>
                <span>Client information</span>
                <h2>Submitted brief</h2>
              </div>

              <span className={styles.readOnlyBadge}>
                Client supplied
              </span>
            </div>

            <div className={styles.briefGrid}>
              <article className={styles.briefCard}>
                <header>
                  <span>01</span>

                  <div>
                    <h3>Project idea</h3>
                    <p>
                      Core concept and product
                      category.
                    </p>
                  </div>
                </header>

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
                      styles.descriptionRow
                    }
                  >
                    <span>Description</span>
                    <p>{project.description}</p>
                  </div>
                </div>
              </article>

              <article className={styles.briefCard}>
                <header>
                  <span>02</span>

                  <div>
                    <h3>Requirements</h3>
                    <p>
                      Product audience, stage and
                      requested features.
                    </p>
                  </div>
                </header>

                <div className={styles.cardBody}>
                  <BriefRow
                    label="Stage"
                    value={
                      stageLabels[
                        project.requirements
                          ?.stage
                      ]
                    }
                  />

                  <BriefRow
                    label="Priority"
                    value={
                      priorityLabels[
                        project.requirements
                          ?.priority
                      ]
                    }
                  />

                  <div
                    className={
                      styles.descriptionRow
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
                        styles.descriptionRow
                      }
                    >
                      <span>Additional notes</span>
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
            </div>
          </section>

          <section
            id="delivery"
            className={styles.section}
          >
            <div className={styles.sectionHeading}>
              <div>
                <span>Commercial context</span>
                <h2>Delivery preferences</h2>
              </div>
            </div>

            <div className={styles.deliveryGrid}>
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
                label="Ownership model"
                value={
                  ownershipLabels[
                    project.details?.ownership
                  ]
                }
              />

              <BriefRow
                label="Support"
                value={
                  supportLabels[
                    project.details?.support
                  ]
                }
              />

              {project.details?.notes && (
                <div
                  className={
                    styles.deliveryNotes
                  }
                >
                  <span>Delivery notes</span>
                  <p>{project.details.notes}</p>
                </div>
              )}
            </div>
          </section>

          <section
            id="internal"
            className={styles.section}
          >
            <div className={styles.sectionHeading}>
              <div>
                <span>Buildly private area</span>
                <h2>Internal workspace</h2>
              </div>

              <span className={styles.privateBadge}>
                Team only
              </span>
            </div>

            <div className={styles.internalGrid}>
              <article
                className={styles.assignmentCard}
              >
                <header>
                  <h3>Assigned team</h3>
                  <span>
                    {assignedMembers.length}{' '}
                    selected
                  </span>
                </header>

                <p>
                  Select the Buildly team members
                  responsible for this project.
                </p>

                <div className={styles.teamList}>
                  {teamMembers.map(member => {
                    const selected =
                      assignedMembers.includes(
                        member.id,
                      );

                    return (
                      <button
                        key={member.id}
                        type="button"
                        className={
                          selected
                            ? styles.memberSelected
                            : ''
                        }
                        onClick={() =>
                          handleMemberToggle(
                            member.id,
                          )
                        }
                      >
                        <span
                          className={
                            styles.memberAvatar
                          }
                        >
                          {member.initials}
                        </span>

                        <span
                          className={
                            styles.memberCopy
                          }
                        >
                          <strong>
                            {member.name}
                          </strong>
                          <small>
                            {member.role}
                          </small>
                        </span>

                        <span
                          className={
                            styles.memberCheck
                          }
                        >
                          {selected && (
                            <CheckIcon />
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </article>

              <article
                className={styles.controlsCard}
              >
                <div className={styles.field}>
                  <label htmlFor="internalPriority">
                    Internal priority
                  </label>

                  <select
                    id="internalPriority"
                    value={internalPriority}
                    onChange={event =>
                      setInternalPriority(
                        event.target.value,
                      )
                    }
                  >
                    {internalPriorities.map(
                      priority => (
                        <option
                          key={priority.id}
                          value={priority.id}
                        >
                          {priority.label}
                        </option>
                      ),
                    )}
                  </select>

                  <small>
                    This priority is visible only
                    inside the Buildly workspace.
                  </small>
                </div>

                <div className={styles.field}>
                  <label htmlFor="internalNotes">
                    Internal notes
                  </label>

                  <textarea
                    id="internalNotes"
                    value={internalNotes}
                    rows="10"
                    placeholder="Add review findings, risks, technical ideas, client follow-ups or next actions..."
                    onChange={event =>
                      setInternalNotes(
                        event.target.value,
                      )
                    }
                  />

                  <div
                    className={
                      styles.characterCount
                    }
                  >
                    {internalNotes.length} characters
                  </div>
                </div>
              </article>
            </div>
          </section>

          <section
            id="activity"
            className={styles.section}
          >
            <div className={styles.sectionHeading}>
              <div>
                <span>Workspace history</span>
                <h2>Activity</h2>
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
                    {clientName} completed the
                    Buildly onboarding flow.
                  </p>
                </div>

                <time>
                  {formatDateTime(
                    project.createdAt,
                  )}
                </time>
              </article>

              {project.internal
                ?.lastUpdatedAt && (
                <article>
                  <span
                    className={`${styles.activityIcon} ${styles.activityIconPurple}`}
                  >
                    <SaveIcon />
                  </span>

                  <div>
                    <strong>
                      Internal workspace updated
                    </strong>
                    <p>
                      Changes saved by{' '}
                      {project.internal
                        .lastUpdatedBy ??
                        'Buildly Manager'}
                      .
                    </p>
                  </div>

                  <time>
                    {formatDateTime(
                      project.internal
                        .lastUpdatedAt,
                    )}
                  </time>
                </article>
              )}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
};

export default TeamProjectPage;