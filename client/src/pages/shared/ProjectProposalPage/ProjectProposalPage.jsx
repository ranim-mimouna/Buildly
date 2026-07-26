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

import { STORAGE_KEYS } from '../../../constants/storageKeys';
import styles from './ProjectProposalPage.module.css';

const proposalStatuses = {
  draft: 'Draft',
  published: 'Awaiting approval',
  approved: 'Approved',
  'changes-requested': 'Changes requested',
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

const phases = [
  'Discovery',
  'Design',
  'Development',
  'Testing',
  'Launch',
  'Support',
];

const getStoredProjects = () => {
  const storedProjects = localStorage.getItem(
    STORAGE_KEYS.PROJECTS,
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
    localStorage.removeItem(STORAGE_KEYS.PROJECTS);

    return [];
  }
};

const getStoredProposals = () => {
  const storedProposals = localStorage.getItem(
    STORAGE_KEYS.PROJECT_PROPOSALS,
  );

  if (!storedProposals) {
    return {};
  }

  try {
    const parsedProposals = JSON.parse(
      storedProposals,
    );

    return parsedProposals &&
      typeof parsedProposals === 'object' &&
      !Array.isArray(parsedProposals)
      ? parsedProposals
      : {};
  } catch {
    localStorage.removeItem(
      STORAGE_KEYS.PROJECT_PROPOSALS,
    );

    return {};
  }
};

const createDefaultProposal = project => {
  const createdAt = new Date().toISOString();

  return {
    projectId: project.id,
    status: 'draft',
    currency: 'EUR',
    notes:
      'This proposal covers the first recommended product release. Optional items can be included or removed before approval.',
    createdAt,
    updatedAt: createdAt,
    publishedAt: null,
    approvedAt: null,
    changeRequest: '',
    items: [
      {
        id: `proposal-discovery-${project.id}`,
        title: 'Product discovery and planning',
        description:
          'Requirements review, product scope, user flows and technical planning.',
        phase: 'Discovery',
        quantity: 1,
        unitPrice: 750,
        estimatedDays: 5,
        required: true,
        selected: true,
      },
      {
        id: `proposal-design-${project.id}`,
        title: 'Core interface design',
        description:
          'Responsive designs for the main product screens and user journeys.',
        phase: 'Design',
        quantity: 1,
        unitPrice: 1400,
        estimatedDays: 8,
        required: true,
        selected: true,
      },
      {
        id: `proposal-development-${project.id}`,
        title: 'First product release',
        description:
          'Development of the approved core features for the first working release.',
        phase: 'Development',
        quantity: 1,
        unitPrice: 4200,
        estimatedDays: 25,
        required: true,
        selected: true,
      },
      {
        id: `proposal-testing-${project.id}`,
        title: 'Quality assurance and launch testing',
        description:
          'Functional testing, responsive review, bug fixing and launch preparation.',
        phase: 'Testing',
        quantity: 1,
        unitPrice: 850,
        estimatedDays: 6,
        required: true,
        selected: true,
      },
      {
        id: `proposal-support-${project.id}`,
        title: 'Post-launch support',
        description:
          'Thirty days of technical support and launch monitoring.',
        phase: 'Support',
        quantity: 1,
        unitPrice: 600,
        estimatedDays: 30,
        required: false,
        selected: false,
      },
    ],
  };
};

const formatCurrency = (
  value,
  currency = 'EUR',
) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
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

const calculateItemTotal = item => {
  return (
    (Number(item.quantity) || 0) *
    (Number(item.unitPrice) || 0)
  );
};

const calculateProposalTotal = items => {
  return items
    .filter(item => item.required || item.selected)
    .reduce(
      (total, item) =>
        total + calculateItemTotal(item),
      0,
    );
};

const calculateDeliveryDays = items => {
  return items
    .filter(item => item.required || item.selected)
    .reduce(
      (total, item) =>
        total +
        (Number(item.estimatedDays) || 0),
      0,
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

const ProjectProposalPage = ({
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

  const initialProposal = useMemo(() => {
    if (!project) {
      return null;
    }

    const storedProposals =
      getStoredProposals();

    return (
      storedProposals[project.id] ??
      createDefaultProposal(project)
    );
  }, [project]);

  const [proposal, setProposal] =
    useState(initialProposal);

  const [isSidebarOpen, setIsSidebarOpen] =
    useState(false);

  const [isSaving, setIsSaving] =
    useState(false);

  const [showSavedMessage, setShowSavedMessage] =
    useState(false);

  const [showChangeForm, setShowChangeForm] =
    useState(false);

  const [changeRequest, setChangeRequest] =
    useState(
      initialProposal?.changeRequest ?? '',
    );

  if (!project || !proposal) {
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

  const total = calculateProposalTotal(
    proposal.items,
  );

  const deliveryDays =
    calculateDeliveryDays(proposal.items);

  const includedItems = proposal.items.filter(
    item => item.required || item.selected,
  ).length;

  const updateProposal = updates => {
    setProposal(currentProposal => ({
      ...currentProposal,
      ...updates,
    }));
  };

  const updateItem = (
    itemId,
    field,
    value,
  ) => {
    setProposal(currentProposal => ({
      ...currentProposal,
      items: currentProposal.items.map(item =>
        item.id === itemId
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    }));
  };

  const addItem = () => {
    setProposal(currentProposal => ({
      ...currentProposal,
      items: [
        ...currentProposal.items,
        {
          id: `proposal-item-${Date.now()}`,
          title: 'New scope item',
          description:
            'Describe the feature or service included in this item.',
          phase: 'Development',
          quantity: 1,
          unitPrice: 0,
          estimatedDays: 1,
          required: false,
          selected: false,
        },
      ],
    }));
  };

  const removeItem = itemId => {
    setProposal(currentProposal => ({
      ...currentProposal,
      items: currentProposal.items.filter(
        item => item.id !== itemId,
      ),
    }));
  };

  const persistProposal = nextProposal => {
    const storedProposals =
      getStoredProposals();

    localStorage.setItem(
      STORAGE_KEYS.PROJECT_PROPOSALS,
      JSON.stringify({
        ...storedProposals,
        [project.id]: nextProposal,
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

    const nextProposal = {
      ...proposal,
      updatedAt: new Date().toISOString(),
    };

    persistProposal(nextProposal);

    await new Promise(resolve => {
      window.setTimeout(resolve, 450);
    });

    setProposal(nextProposal);
    setIsSaving(false);
    showSuccessMessage();
  };

  const handlePublish = () => {
    const nextProposal = {
      ...proposal,
      status: 'published',
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      changeRequest: '',
    };

    persistProposal(nextProposal);
    setProposal(nextProposal);
    setChangeRequest('');
    showSuccessMessage();
  };

  const handleApprove = () => {
    const nextProposal = {
      ...proposal,
      status: 'approved',
      approvedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      changeRequest: '',
    };

    persistProposal(nextProposal);
    setProposal(nextProposal);
    showSuccessMessage();
  };

  const handleRequestChanges = () => {
    if (!changeRequest.trim()) {
      return;
    }

    const nextProposal = {
      ...proposal,
      status: 'changes-requested',
      changeRequest: changeRequest.trim(),
      updatedAt: new Date().toISOString(),
    };

    persistProposal(nextProposal);
    setProposal(nextProposal);
    setShowChangeForm(false);
    showSuccessMessage();
  };

  const canClientReview =
    !isTeam &&
    ['published', 'changes-requested'].includes(
      proposal.status,
    );

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

            <span>ShipPilot</span>
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
              ? 'Commercial planning'
              : 'Project proposal'}
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
            className={`${styles.navigationLink} ${styles.navigationLinkActive}`}
          >
            <ProposalIcon />
            Proposal
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

            {proposalStatuses[
              proposal.status
            ] ?? 'Draft'}
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
                  ? 'ShipPilot Team'
                  : clientName}
              </strong>

              <small>
                {isTeam
                  ? 'Proposal manager'
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
              className={styles.mobileMenuButton}
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
                  Proposal updated
                </motion.span>
              )}
            </AnimatePresence>

            {isTeam && (
              <>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={addItem}
                >
                  <PlusIcon />
                  Add item
                </button>

                <button
                  type="button"
                  className={styles.secondaryButton}
                  disabled={isSaving}
                  onClick={handleSave}
                >
                  <SaveIcon />
                  Save draft
                </button>

                <button
                  type="button"
                  className={styles.primaryButton}
                  onClick={handlePublish}
                >
                  Publish proposal
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
                Scope and commercial plan
              </span>

              <h1>Project proposal</h1>

              <p>
                {isTeam
                  ? 'Build the recommended project scope, pricing and expected delivery effort before the client approves development.'
                  : 'Review the proposed project scope, optional features, estimated cost and expected delivery effort.'}
              </p>

              <div className={styles.heroMeta}>
                <span>{project.title}</span>

                <span>
                  {proposalStatuses[
                    proposal.status
                  ]}
                </span>

                <span>
                  Updated{' '}
                  {formatDate(
                    proposal.updatedAt,
                  )}
                </span>
              </div>
            </div>

            <aside className={styles.totalCard}>
              <span>Current proposal</span>

              <strong>
                {formatCurrency(
                  total,
                  proposal.currency,
                )}
              </strong>

              <p>
                Based on {includedItems} included
                scope items.
              </p>

              <div>
                <span>Estimated effort</span>
                <strong>
                  {deliveryDays} days
                </strong>
              </div>

              <div>
                <span>Proposal status</span>
                <strong>
                  {
                    proposalStatuses[
                      proposal.status
                    ]
                  }
                </strong>
              </div>
            </aside>
          </section>

          {proposal.status === 'draft' &&
            !isTeam && (
              <section
                className={styles.notice}
              >
                <ProposalIcon />

                <div>
                  <strong>
                    Proposal not published yet
                  </strong>

                  <p>
                    The ShipPilot team is preparing
                    the detailed scope and pricing.
                  </p>
                </div>
              </section>
            )}

          {proposal.changeRequest && (
            <section
              className={
                styles.changeRequestNotice
              }
            >
              <span>Client change request</span>

              <p>{proposal.changeRequest}</p>
            </section>
          )}

          <section className={styles.summaryGrid}>
            <article>
              <span>Total items</span>
              <strong>
                {proposal.items.length}
              </strong>
              <small>
                Required and optional items
              </small>
            </article>

            <article>
              <span>Included items</span>
              <strong>{includedItems}</strong>
              <small>
                Included in current total
              </small>
            </article>

            <article>
              <span>Estimated effort</span>
              <strong>
                {deliveryDays} days
              </strong>
              <small>
                Combined delivery estimate
              </small>
            </article>

            <article>
              <span>Client</span>
              <strong>{clientName}</strong>
              <small>Proposal recipient</small>
            </article>
          </section>

          <section className={styles.scopeSection}>
            <div className={styles.sectionHeading}>
              <div>
                <span>Detailed pricing</span>
                <h2>Scope items</h2>
              </div>

              {isTeam && (
                <button
                  type="button"
                  onClick={addItem}
                >
                  <PlusIcon />
                  Add scope item
                </button>
              )}
            </div>

            <div className={styles.scopeList}>
              {proposal.items.map(
                (item, index) => (
                  <motion.article
                    key={item.id}
                    className={`${styles.scopeItem} ${
                      !item.required &&
                      !item.selected
                        ? styles.scopeItemExcluded
                        : ''
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
                      delay: index * 0.035,
                    }}
                  >
                    <div className={styles.itemNumber}>
                      {item.required ||
                      item.selected ? (
                        <CheckIcon />
                      ) : (
                        index + 1
                      )}
                    </div>

                    <div className={styles.itemContent}>
                      <div className={styles.itemHeader}>
                        <div>
                          {isTeam ? (
                            <input
                              type="text"
                              value={item.title}
                              aria-label={`Scope item ${
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
                              styles.itemBadges
                            }
                          >
                            <span>{item.phase}</span>

                            <span>
                              {item.required
                                ? 'Required'
                                : 'Optional'}
                            </span>
                          </div>
                        </div>

                        <strong
                          className={
                            styles.itemTotal
                          }
                        >
                          {formatCurrency(
                            calculateItemTotal(
                              item,
                            ),
                            proposal.currency,
                          )}
                        </strong>
                      </div>

                      {isTeam ? (
                        <textarea
                          rows="3"
                          value={item.description}
                          aria-label={`Scope item ${
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

                      <div className={styles.itemFooter}>
                        {isTeam ? (
                          <div
                            className={
                              styles.editorFields
                            }
                          >
                            <label>
                              Phase
                              <select
                                value={item.phase}
                                onChange={event =>
                                  updateItem(
                                    item.id,
                                    'phase',
                                    event.target
                                      .value,
                                  )
                                }
                              >
                                {phases.map(
                                  phase => (
                                    <option
                                      key={phase}
                                      value={phase}
                                    >
                                      {phase}
                                    </option>
                                  ),
                                )}
                              </select>
                            </label>

                            <label>
                              Quantity
                              <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={event =>
                                  updateItem(
                                    item.id,
                                    'quantity',
                                    event.target
                                      .value,
                                  )
                                }
                              />
                            </label>

                            <label>
                              Unit price
                              <input
                                type="number"
                                min="0"
                                value={
                                  item.unitPrice
                                }
                                onChange={event =>
                                  updateItem(
                                    item.id,
                                    'unitPrice',
                                    event.target
                                      .value,
                                  )
                                }
                              />
                            </label>

                            <label>
                              Delivery days
                              <input
                                type="number"
                                min="0"
                                value={
                                  item.estimatedDays
                                }
                                onChange={event =>
                                  updateItem(
                                    item.id,
                                    'estimatedDays',
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
                              styles.clientItemMeta
                            }
                          >
                            <span>
                              Quantity:{' '}
                              <strong>
                                {item.quantity}
                              </strong>
                            </span>

                            <span>
                              Estimated effort:{' '}
                              <strong>
                                {
                                  item.estimatedDays
                                }{' '}
                                days
                              </strong>
                            </span>
                          </div>
                        )}

                        <div className={styles.itemControls}>
                          {isTeam ? (
                            <>
                              <label
                                className={
                                  styles.checkboxLabel
                                }
                              >
                                <input
                                  type="checkbox"
                                  checked={
                                    item.required
                                  }
                                  onChange={event => {
                                    updateItem(
                                      item.id,
                                      'required',
                                      event.target
                                        .checked,
                                    );

                                    if (
                                      event.target
                                        .checked
                                    ) {
                                      updateItem(
                                        item.id,
                                        'selected',
                                        true,
                                      );
                                    }
                                  }}
                                />

                                Required
                              </label>

                              <button
                                type="button"
                                className={
                                  styles.deleteButton
                                }
                                aria-label={`Delete ${item.title}`}
                                onClick={() =>
                                  removeItem(item.id)
                                }
                              >
                                <DeleteIcon />
                              </button>
                            </>
                          ) : (
                            !item.required && (
                              <label
                                className={
                                  styles.optionalToggle
                                }
                              >
                                <input
                                  type="checkbox"
                                  checked={
                                    item.selected
                                  }
                                  disabled={
                                    proposal.status ===
                                    'approved'
                                  }
                                  onChange={event =>
                                    updateItem(
                                      item.id,
                                      'selected',
                                      event.target
                                        .checked,
                                    )
                                  }
                                />

                                <span />

                                {item.selected
                                  ? 'Included'
                                  : 'Add optional item'}
                              </label>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.article>
                ),
              )}
            </div>
          </section>

          <section className={styles.notesSection}>
            <div className={styles.sectionHeading}>
              <div>
                <span>Proposal details</span>
                <h2>Notes and conditions</h2>
              </div>
            </div>

            {isTeam ? (
              <textarea
                rows="6"
                value={proposal.notes}
                placeholder="Add payment terms, delivery assumptions, exclusions or important conditions..."
                onChange={event =>
                  updateProposal({
                    notes: event.target.value,
                  })
                }
              />
            ) : (
              <p>
                {proposal.notes ||
                  'No additional proposal notes were provided.'}
              </p>
            )}
          </section>

          <section className={styles.totalSection}>
            <div>
              <span>Selected scope</span>

              <h2>
                {formatCurrency(
                  total,
                  proposal.currency,
                )}
              </h2>

              <p>
                {includedItems} items · Approximately{' '}
                {deliveryDays} delivery days
              </p>
            </div>

            <div className={styles.totalActions}>
              <Link
                to={`${basePath}/messages`}
              >
                <MessageIcon />
                Message team
              </Link>

              {canClientReview && (
                <>
                  <button
                    type="button"
                    className={
                      styles.requestButton
                    }
                    onClick={() =>
                      setShowChangeForm(true)
                    }
                  >
                    Request changes
                  </button>

                  <button
                    type="button"
                    className={
                      styles.approveButton
                    }
                    onClick={handleApprove}
                  >
                    <CheckIcon />
                    Approve proposal
                  </button>
                </>
              )}

              {!isTeam &&
                proposal.status ===
                  'approved' && (
                  <span
                    className={
                      styles.approvedMessage
                    }
                  >
                    <CheckIcon />
                    Approved on{' '}
                    {formatDate(
                      proposal.approvedAt,
                    )}
                  </span>
                )}
            </div>
          </section>
        </motion.div>
      </section>

      <AnimatePresence>
        {showChangeForm && (
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
                  <span>Proposal feedback</span>
                  <h2>Request changes</h2>
                </div>

                <button
                  type="button"
                  aria-label="Close change request"
                  onClick={() =>
                    setShowChangeForm(false)
                  }
                >
                  <CloseIcon />
                </button>
              </header>

              <p>
                Explain what should be updated
                before you approve the proposal.
              </p>

              <textarea
                rows="7"
                value={changeRequest}
                placeholder="For example: remove a feature, adjust the launch scope or clarify a price..."
                onChange={event =>
                  setChangeRequest(
                    event.target.value,
                  )
                }
              />

              <div>
                <button
                  type="button"
                  onClick={() =>
                    setShowChangeForm(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={
                    !changeRequest.trim()
                  }
                  onClick={handleRequestChanges}
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

export default ProjectProposalPage;