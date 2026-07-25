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

import styles from './ProjectDeliverablesPage.module.css';

const deliverableStatuses = {
  draft: 'Draft',
  review: 'Ready for review',
  approved: 'Approved',
  revision: 'Revision requested',
  archived: 'Archived',
};

const deliverableTypes = [
  {
    id: 'design',
    label: 'Design',
  },
  {
    id: 'prototype',
    label: 'Prototype',
  },
  {
    id: 'development',
    label: 'Development build',
  },
  {
    id: 'document',
    label: 'Document',
  },
  {
    id: 'repository',
    label: 'Code repository',
  },
  {
    id: 'release',
    label: 'Release',
  },
  {
    id: 'other',
    label: 'Other',
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

const getStoredDeliverables = () => {
  const storedDeliverables = localStorage.getItem(
    'buildly-project-deliverables',
  );

  if (!storedDeliverables) {
    return {};
  }

  try {
    const parsedDeliverables = JSON.parse(
      storedDeliverables,
    );

    return parsedDeliverables &&
      typeof parsedDeliverables === 'object' &&
      !Array.isArray(parsedDeliverables)
      ? parsedDeliverables
      : {};
  } catch {
    localStorage.removeItem(
      'buildly-project-deliverables',
    );

    return {};
  }
};

const createDefaultDeliverables = project => {
  const createdAt = new Date().toISOString();

  return {
    projectId: project.id,
    updatedAt: createdAt,
    items: [
      {
        id: `deliverable-brief-${project.id}`,
        title: 'Approved project brief',
        description:
          'The confirmed project scope, audience, priorities and delivery requirements.',
        type: 'document',
        milestone: 'Discovery and project review',
        version: '1.0',
        url: '',
        status: 'draft',
        releaseNotes:
          'Initial project brief created from the client onboarding submission.',
        feedback: '',
        createdAt,
        updatedAt: createdAt,
        approvedAt: null,
      },
      {
        id: `deliverable-design-${project.id}`,
        title: 'Core product design',
        description:
          'Main interface direction and approved product screens.',
        type: 'design',
        milestone: 'Product design',
        version: '1.0',
        url: '',
        status: 'draft',
        releaseNotes:
          'Design deliverable will be published after the main user flows are completed.',
        feedback: '',
        createdAt,
        updatedAt: createdAt,
        approvedAt: null,
      },
    ],
  };
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

const getInitials = name => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
};

const isValidUrl = value => {
  if (!value.trim()) {
    return false;
  }

  try {
    const url = new URL(value);

    return ['http:', 'https:'].includes(
      url.protocol,
    );
  } catch {
    return false;
  }
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

const LinkIcon = () => {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M10 14L14 10"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M8.5 16.5L6.5 18.5C4.8 20.2 2.1 20.2 0.5 18.5C-1.2 16.8 -1.2 14.1 0.5 12.5L4.5 8.5C6.2 6.8 8.9 6.8 10.5 8.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M15.5 7.5L17.5 5.5C19.2 3.8 21.9 3.8 23.5 5.5C25.2 7.2 25.2 9.9 23.5 11.5L19.5 15.5C17.8 17.2 15.1 17.2 13.5 15.5"
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

const ProjectDeliverablesPage = ({
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

  const initialDeliverables = useMemo(() => {
    if (!project) {
      return null;
    }

    const storedDeliverables =
      getStoredDeliverables();

    return (
      storedDeliverables[project.id] ??
      createDefaultDeliverables(project)
    );
  }, [project]);

  const [deliverables, setDeliverables] =
    useState(initialDeliverables);

  const [isSidebarOpen, setIsSidebarOpen] =
    useState(false);

  const [isSaving, setIsSaving] =
    useState(false);

  const [showSavedMessage, setShowSavedMessage] =
    useState(false);

  const [revisionTarget, setRevisionTarget] =
    useState(null);

  const [revisionFeedback, setRevisionFeedback] =
    useState('');

  if (!project || !deliverables) {
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

  const approvedCount =
    deliverables.items.filter(
      item => item.status === 'approved',
    ).length;

  const reviewCount =
    deliverables.items.filter(
      item => item.status === 'review',
    ).length;

  const revisionCount =
    deliverables.items.filter(
      item => item.status === 'revision',
    ).length;

  const visibleItems = isTeam
    ? deliverables.items
    : deliverables.items.filter(
        item => item.status !== 'archived',
      );

  const updateItem = (
    itemId,
    field,
    value,
  ) => {
    setDeliverables(currentDeliverables => ({
      ...currentDeliverables,
      items: currentDeliverables.items.map(
        item =>
          item.id === itemId
            ? {
                ...item,
                [field]: value,
                updatedAt:
                  new Date().toISOString(),
              }
            : item,
      ),
    }));
  };

  const addDeliverable = () => {
    const createdAt =
      new Date().toISOString();

    setDeliverables(currentDeliverables => ({
      ...currentDeliverables,
      items: [
        ...currentDeliverables.items,
        {
          id: `deliverable-${Date.now()}`,
          title: 'New deliverable',
          description:
            'Describe what the client will receive in this deliverable.',
          type: 'development',
          milestone: 'Development and testing',
          version: '1.0',
          url: '',
          status: 'draft',
          releaseNotes:
            'Add the main changes, improvements or important review details.',
          feedback: '',
          createdAt,
          updatedAt: createdAt,
          approvedAt: null,
        },
      ],
    }));
  };

  const deleteDeliverable = itemId => {
    setDeliverables(currentDeliverables => ({
      ...currentDeliverables,
      items: currentDeliverables.items.filter(
        item => item.id !== itemId,
      ),
    }));
  };

  const persistDeliverables =
    nextDeliverables => {
      const storedDeliverables =
        getStoredDeliverables();

      localStorage.setItem(
        'buildly-project-deliverables',
        JSON.stringify({
          ...storedDeliverables,
          [project.id]: nextDeliverables,
        }),
      );
    };

  const showSuccessMessage = () => {
    setShowSavedMessage(true);

    window.setTimeout(() => {
      setShowSavedMessage(false);
    }, 2200);
  };

  const handleSave = async () => {
    setIsSaving(true);

    const nextDeliverables = {
      ...deliverables,
      updatedAt: new Date().toISOString(),
    };

    persistDeliverables(nextDeliverables);

    await new Promise(resolve => {
      window.setTimeout(resolve, 450);
    });

    setDeliverables(nextDeliverables);
    setIsSaving(false);
    showSuccessMessage();
  };

  const publishDeliverable = itemId => {
    const nextDeliverables = {
      ...deliverables,
      updatedAt: new Date().toISOString(),
      items: deliverables.items.map(item =>
        item.id === itemId
          ? {
              ...item,
              status: 'review',
              feedback: '',
              approvedAt: null,
              updatedAt:
                new Date().toISOString(),
            }
          : item,
      ),
    };

    persistDeliverables(nextDeliverables);
    setDeliverables(nextDeliverables);
    showSuccessMessage();
  };

  const approveDeliverable = itemId => {
    const nextDeliverables = {
      ...deliverables,
      updatedAt: new Date().toISOString(),
      items: deliverables.items.map(item =>
        item.id === itemId
          ? {
              ...item,
              status: 'approved',
              feedback: '',
              approvedAt:
                new Date().toISOString(),
              updatedAt:
                new Date().toISOString(),
            }
          : item,
      ),
    };

    persistDeliverables(nextDeliverables);
    setDeliverables(nextDeliverables);
    showSuccessMessage();
  };

  const submitRevisionRequest = () => {
    if (
      !revisionTarget ||
      !revisionFeedback.trim()
    ) {
      return;
    }

    const nextDeliverables = {
      ...deliverables,
      updatedAt: new Date().toISOString(),
      items: deliverables.items.map(item =>
        item.id === revisionTarget.id
          ? {
              ...item,
              status: 'revision',
              feedback:
                revisionFeedback.trim(),
              approvedAt: null,
              updatedAt:
                new Date().toISOString(),
            }
          : item,
      ),
    };

    persistDeliverables(nextDeliverables);
    setDeliverables(nextDeliverables);
    setRevisionTarget(null);
    setRevisionFeedback('');
    showSuccessMessage();
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
            className={styles.mobileCloseButton}
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
            className={`${styles.navigationLink} ${styles.navigationLinkActive}`}
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
            {approvedCount} approved
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
                  ? 'Delivery manager'
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
                  Deliverables updated
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
                  onClick={addDeliverable}
                >
                  <PlusIcon />
                  Add deliverable
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
                    : 'Save changes'}
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
                Shared delivery hub
              </span>

              <h1>Project deliverables</h1>

              <p>
                {isTeam
                  ? 'Publish designs, builds, documents and releases for client review and approval.'
                  : 'Review project outputs, open shared files and approve each completed delivery.'}
              </p>

              <div className={styles.heroMeta}>
                <span>{project.title}</span>

                <span>
                  {visibleItems.length}{' '}
                  deliverables
                </span>

                <span>
                  Updated{' '}
                  {formatDate(
                    deliverables.updatedAt,
                  )}
                </span>
              </div>
            </div>

            <aside className={styles.progressCard}>
              <span>Delivery approval</span>

              <strong>
                {visibleItems.length === 0
                  ? 0
                  : Math.round(
                      (approvedCount /
                        visibleItems.length) *
                        100,
                    )}
                %
              </strong>

              <div className={styles.progressTrack}>
                <span
                  style={{
                    width: `${
                      visibleItems.length === 0
                        ? 0
                        : Math.round(
                            (approvedCount /
                              visibleItems.length) *
                              100,
                          )
                    }%`,
                  }}
                />
              </div>

              <div className={styles.progressValues}>
                <div>
                  <span>Approved</span>
                  <strong>
                    {approvedCount}
                  </strong>
                </div>

                <div>
                  <span>In review</span>
                  <strong>{reviewCount}</strong>
                </div>

                <div>
                  <span>Revisions</span>
                  <strong>
                    {revisionCount}
                  </strong>
                </div>
              </div>
            </aside>
          </section>

          <section className={styles.summaryGrid}>
            <article>
              <span>Total deliverables</span>
              <strong>
                {visibleItems.length}
              </strong>
              <small>
                Published project outputs
              </small>
            </article>

            <article>
              <span>Ready for review</span>
              <strong>{reviewCount}</strong>
              <small>
                Waiting for client feedback
              </small>
            </article>

            <article>
              <span>Approved</span>
              <strong>{approvedCount}</strong>
              <small>
                Accepted project outputs
              </small>
            </article>

            <article>
              <span>Revision requests</span>
              <strong>{revisionCount}</strong>
              <small>
                Deliverables needing updates
              </small>
            </article>
          </section>

          <section className={styles.deliverablesSection}>
            <div className={styles.sectionHeading}>
              <div>
                <span>Project outputs</span>
                <h2>Deliverables</h2>
              </div>

              {isTeam && (
                <button
                  type="button"
                  onClick={addDeliverable}
                >
                  <PlusIcon />
                  Add deliverable
                </button>
              )}
            </div>

            {visibleItems.length > 0 ? (
              <div className={styles.deliverableList}>
                {visibleItems.map(
                  (item, index) => (
                    <motion.article
                      key={item.id}
                      className={`${styles.deliverableCard} ${
                        styles[
                          `deliverable${item.status
                            .charAt(0)
                            .toUpperCase()}${item.status.slice(
                            1,
                          )}`
                        ] ?? ''
                      }`}
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
                      <div
                        className={
                          styles.deliverableNumber
                        }
                      >
                        {item.status ===
                        'approved' ? (
                          <CheckIcon />
                        ) : (
                          index + 1
                        )}
                      </div>

                      <div
                        className={
                          styles.deliverableContent
                        }
                      >
                        <div
                          className={
                            styles.deliverableHeader
                          }
                        >
                          <div>
                            {isTeam ? (
                              <input
                                type="text"
                                value={item.title}
                                aria-label={`Deliverable ${
                                  index + 1
                                } title`}
                                onChange={event =>
                                  updateItem(
                                    item.id,
                                    'title',
                                    event.target
                                      .value,
                                  )
                                }
                              />
                            ) : (
                              <h3>{item.title}</h3>
                            )}

                            <div
                              className={
                                styles.badges
                              }
                            >
                              <span>
                                {
                                  deliverableTypes.find(
                                    type =>
                                      type.id ===
                                      item.type,
                                  )?.label
                                }
                              </span>

                              <span>
                                Version{' '}
                                {item.version}
                              </span>

                              <span>
                                {
                                  deliverableStatuses[
                                    item.status
                                  ]
                                }
                              </span>
                            </div>
                          </div>

                          {isTeam && (
                            <button
                              type="button"
                              className={
                                styles.deleteButton
                              }
                              aria-label={`Delete ${item.title}`}
                              onClick={() =>
                                deleteDeliverable(
                                  item.id,
                                )
                              }
                            >
                              <DeleteIcon />
                            </button>
                          )}
                        </div>

                        {isTeam ? (
                          <textarea
                            rows="3"
                            value={item.description}
                            aria-label={`Deliverable ${
                              index + 1
                            } description`}
                            onChange={event =>
                              updateItem(
                                item.id,
                                'description',
                                event.target.value,
                              )
                            }
                          />
                        ) : (
                          <p>{item.description}</p>
                        )}

                        <div className={styles.milestoneBox}>
                          <span>
                            Connected milestone
                          </span>

                          {isTeam ? (
                            <input
                              type="text"
                              value={item.milestone}
                              onChange={event =>
                                updateItem(
                                  item.id,
                                  'milestone',
                                  event.target.value,
                                )
                              }
                            />
                          ) : (
                            <strong>
                              {item.milestone}
                            </strong>
                          )}
                        </div>

                        {isTeam ? (
                          <div className={styles.editorGrid}>
                            <label>
                              Type
                              <select
                                value={item.type}
                                onChange={event =>
                                  updateItem(
                                    item.id,
                                    'type',
                                    event.target
                                      .value,
                                  )
                                }
                              >
                                {deliverableTypes.map(
                                  type => (
                                    <option
                                      key={type.id}
                                      value={type.id}
                                    >
                                      {type.label}
                                    </option>
                                  ),
                                )}
                              </select>
                            </label>

                            <label>
                              Version
                              <input
                                type="text"
                                value={item.version}
                                onChange={event =>
                                  updateItem(
                                    item.id,
                                    'version',
                                    event.target
                                      .value,
                                  )
                                }
                              />
                            </label>

                            <label>
                              File or preview URL
                              <input
                                type="url"
                                value={item.url}
                                placeholder="https://..."
                                onChange={event =>
                                  updateItem(
                                    item.id,
                                    'url',
                                    event.target
                                      .value,
                                  )
                                }
                              />
                            </label>

                            <label>
                              Status
                              <select
                                value={item.status}
                                onChange={event =>
                                  updateItem(
                                    item.id,
                                    'status',
                                    event.target
                                      .value,
                                  )
                                }
                              >
                                {Object.entries(
                                  deliverableStatuses,
                                ).map(
                                  ([
                                    statusId,
                                    label,
                                  ]) => (
                                    <option
                                      key={statusId}
                                      value={statusId}
                                    >
                                      {label}
                                    </option>
                                  ),
                                )}
                              </select>
                            </label>
                          </div>
                        ) : (
                          isValidUrl(item.url) && (
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noreferrer"
                              className={
                                styles.openLink
                              }
                            >
                              <LinkIcon />
                              Open deliverable
                              <ArrowIcon />
                            </a>
                          )
                        )}

                        <div className={styles.releaseNotes}>
                          <span>Release notes</span>

                          {isTeam ? (
                            <textarea
                              rows="3"
                              value={item.releaseNotes}
                              onChange={event =>
                                updateItem(
                                  item.id,
                                  'releaseNotes',
                                  event.target.value,
                                )
                              }
                            />
                          ) : (
                            <p>
                              {item.releaseNotes ||
                                'No release notes were provided.'}
                            </p>
                          )}
                        </div>

                        {item.feedback && (
                          <div
                            className={
                              styles.feedbackBox
                            }
                          >
                            <span>
                              Client revision request
                            </span>

                            <p>{item.feedback}</p>
                          </div>
                        )}

                        <div
                          className={
                            styles.deliverableFooter
                          }
                        >
                          <div>
                            <span>
                              Last updated
                            </span>

                            <strong>
                              {formatDate(
                                item.updatedAt,
                              )}
                            </strong>
                          </div>

                          <div
                            className={
                              styles.deliverableActions
                            }
                          >
                            {isTeam &&
                              item.status !==
                                'archived' && (
                                <button
                                  type="button"
                                  className={
                                    styles.publishButton
                                  }
                                  onClick={() =>
                                    publishDeliverable(
                                      item.id,
                                    )
                                  }
                                >
                                  <DeliverableIcon />
                                  Send for review
                                </button>
                              )}

                            {!isTeam &&
                              item.status ===
                                'review' && (
                                <>
                                  <button
                                    type="button"
                                    className={
                                      styles.revisionButton
                                    }
                                    onClick={() => {
                                      setRevisionTarget(
                                        item,
                                      );
                                      setRevisionFeedback(
                                        '',
                                      );
                                    }}
                                  >
                                    Request revision
                                  </button>

                                  <button
                                    type="button"
                                    className={
                                      styles.approveButton
                                    }
                                    onClick={() =>
                                      approveDeliverable(
                                        item.id,
                                      )
                                    }
                                  >
                                    <CheckIcon />
                                    Approve
                                  </button>
                                </>
                              )}

                            {!isTeam &&
                              item.status ===
                                'approved' && (
                                <span
                                  className={
                                    styles.approvedLabel
                                  }
                                >
                                  <CheckIcon />
                                  Approved{' '}
                                  {formatDate(
                                    item.approvedAt,
                                  )}
                                </span>
                              )}
                          </div>
                        </div>
                      </div>
                    </motion.article>
                  ),
                )}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <span>
                  <DeliverableIcon />
                </span>

                <h3>No deliverables yet</h3>

                <p>
                  {isTeam
                    ? 'Add the first project output when it is ready to be prepared for delivery.'
                    : 'The Buildly team has not published any deliverables yet.'}
                </p>

                {isTeam && (
                  <button
                    type="button"
                    onClick={addDeliverable}
                  >
                    <PlusIcon />
                    Add first deliverable
                  </button>
                )}
              </div>
            )}
          </section>

          <section className={styles.helpBanner}>
            <div>
              <span>Delivery communication</span>

              <h2>
                Review every project output in one
                place.
              </h2>

              <p>
                Use project messages to discuss
                feedback, revisions or approval
                details with the Buildly team.
              </p>
            </div>

            <Link
              to={`${basePath}/messages`}
            >
              <MessageIcon />
              Discuss deliverables
            </Link>
          </section>
        </motion.div>
      </section>

      <AnimatePresence>
        {revisionTarget && (
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
            <motion.section
              className={styles.modal}
              initial={{
                opacity: 0,
                y: prefersReducedMotion ? 0 : 20,
                scale: 0.98,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: prefersReducedMotion ? 0 : 12,
              }}
            >
              <header>
                <div>
                  <span>Delivery feedback</span>

                  <h2>Request a revision</h2>
                </div>

                <button
                  type="button"
                  aria-label="Close revision request"
                  onClick={() =>
                    setRevisionTarget(null)
                  }
                >
                  <CloseIcon />
                </button>
              </header>

              <p>
                Explain what should be changed in{' '}
                <strong>
                  {revisionTarget.title}
                </strong>
                .
              </p>

              <textarea
                rows="7"
                value={revisionFeedback}
                placeholder="Describe the issue, missing detail or requested improvement..."
                onChange={event =>
                  setRevisionFeedback(
                    event.target.value,
                  )
                }
              />

              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={() =>
                    setRevisionTarget(null)
                  }
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={
                    !revisionFeedback.trim()
                  }
                  onClick={
                    submitRevisionRequest
                  }
                >
                  Submit request
                </button>
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default ProjectDeliverablesPage;