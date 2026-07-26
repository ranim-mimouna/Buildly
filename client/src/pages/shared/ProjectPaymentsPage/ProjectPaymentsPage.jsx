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
import styles from './ProjectPaymentsPage.module.css';

const paymentStatuses = {
  draft: 'Draft',
  pending: 'Pending',
  due: 'Due',
  paid: 'Paid',
  overdue: 'Overdue',
  cancelled: 'Cancelled',
};

const planStatuses = {
  draft: 'Draft',
  published: 'Active',
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

const paymentTypes = [
  {
    id: 'deposit',
    label: 'Initial deposit',
  },
  {
    id: 'milestone',
    label: 'Milestone payment',
  },
  {
    id: 'final',
    label: 'Final payment',
  },
  {
    id: 'support',
    label: 'Support payment',
  },
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

const getStoredPaymentPlans = () => {
  const storedPlans = localStorage.getItem(
    STORAGE_KEYS.PROJECT_PAYMENT_PLANS,
  );

  if (!storedPlans) {
    return {};
  }

  try {
    const parsedPlans = JSON.parse(storedPlans);

    return parsedPlans &&
      typeof parsedPlans === 'object' &&
      !Array.isArray(parsedPlans)
      ? parsedPlans
      : {};
  } catch {
    localStorage.removeItem(
      STORAGE_KEYS.PROJECT_PAYMENT_PLANS,
    );

    return {};
  }
};

const calculateProposalTotal = proposal => {
  if (!proposal?.items) {
    return 0;
  }

  return proposal.items
    .filter(item => item.required || item.selected)
    .reduce((total, item) => {
      return (
        total +
        (Number(item.quantity) || 0) *
          (Number(item.unitPrice) || 0)
      );
    }, 0);
};

const createDefaultPaymentPlan = (
  project,
  proposal,
) => {
  const createdAt = new Date().toISOString();

  const proposalTotal =
    calculateProposalTotal(proposal);

  const total =
    proposalTotal > 0 ? proposalTotal : 7200;

  const depositAmount = Math.round(total * 0.3);
  const planningAmount = Math.round(total * 0.2);
  const developmentAmount = Math.round(
    total * 0.3,
  );

  const finalAmount =
    total -
    depositAmount -
    planningAmount -
    developmentAmount;

  return {
    projectId: project.id,
    currency: proposal?.currency ?? 'USD',
    status: 'draft',
    notes:
      'Payments are connected to visible delivery checkpoints. Work continues after the related payment is confirmed.',
    createdAt,
    updatedAt: createdAt,
    publishedAt: null,
    payments: [
      {
        id: `payment-deposit-${project.id}`,
        title: 'Initial project deposit',
        description:
          'Confirms the project start and reserves the ShipPilot delivery team.',
        type: 'deposit',
        amount: depositAmount,
        dueDate: '',
        status: 'pending',
        milestone: 'Project kickoff',
        paidAt: null,
        createdAt,
      },
      {
        id: `payment-planning-${project.id}`,
        title: 'Planning approval payment',
        description:
          'Due after the client reviews and approves the product scope and delivery plan.',
        type: 'milestone',
        amount: planningAmount,
        dueDate: '',
        status: 'pending',
        milestone: 'Scope and planning approved',
        paidAt: null,
        createdAt,
      },
      {
        id: `payment-development-${project.id}`,
        title: 'Development progress payment',
        description:
          'Due after the first working product release is demonstrated.',
        type: 'milestone',
        amount: developmentAmount,
        dueDate: '',
        status: 'pending',
        milestone: 'First working release',
        paidAt: null,
        createdAt,
      },
      {
        id: `payment-final-${project.id}`,
        title: 'Final delivery payment',
        description:
          'Due before final production handover and transfer of agreed project files.',
        type: 'final',
        amount: finalAmount,
        dueDate: '',
        status: 'pending',
        milestone: 'Launch and handover',
        paidAt: null,
        createdAt,
      },
    ],
  };
};

const formatCurrency = (
  amount,
  currency = 'USD',
) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);
};

const formatDate = value => {
  if (!value) {
    return 'Date not set';
  }

  const date = value.includes('T')
    ? new Date(value)
    : new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return 'Date not set';
  }

  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

const getPaymentProgress = payments => {
  if (payments.length === 0) {
    return 0;
  }

  const total = payments.reduce(
    (sum, payment) =>
      sum + (Number(payment.amount) || 0),
    0,
  );

  const paid = payments
    .filter(payment => payment.status === 'paid')
    .reduce(
      (sum, payment) =>
        sum + (Number(payment.amount) || 0),
      0,
    );

  if (total === 0) {
    return 0;
  }

  return Math.round((paid / total) * 100);
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

const ProjectPaymentsPage = ({
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

  const proposal = useMemo(() => {
    if (!project) {
      return null;
    }

    return getStoredProposals()[project.id] ?? null;
  }, [project]);

  const initialPlan = useMemo(() => {
    if (!project) {
      return null;
    }

    const storedPlans = getStoredPaymentPlans();

    return (
      storedPlans[project.id] ??
      createDefaultPaymentPlan(
        project,
        proposal,
      )
    );
  }, [project, proposal]);

  const [plan, setPlan] =
    useState(initialPlan);

  const [isSidebarOpen, setIsSidebarOpen] =
    useState(false);

  const [isSaving, setIsSaving] =
    useState(false);

  const [showSavedMessage, setShowSavedMessage] =
    useState(false);

  const [selectedPayment, setSelectedPayment] =
    useState(null);

  if (!project || !plan) {
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

  const totalAmount = plan.payments.reduce(
    (sum, payment) =>
      sum + (Number(payment.amount) || 0),
    0,
  );

  const paidAmount = plan.payments
    .filter(payment => payment.status === 'paid')
    .reduce(
      (sum, payment) =>
        sum + (Number(payment.amount) || 0),
      0,
    );

  const remainingAmount =
    totalAmount - paidAmount;

  const progress = getPaymentProgress(
    plan.payments,
  );

  const nextPayment = plan.payments.find(
    payment =>
      !['paid', 'cancelled'].includes(
        payment.status,
      ),
  );

  const updatePlan = updates => {
    setPlan(currentPlan => ({
      ...currentPlan,
      ...updates,
    }));
  };

  const updatePayment = (
    paymentId,
    field,
    value,
  ) => {
    setPlan(currentPlan => ({
      ...currentPlan,
      payments: currentPlan.payments.map(
        payment =>
          payment.id === paymentId
            ? {
                ...payment,
                [field]: value,
              }
            : payment,
      ),
    }));
  };

  const addPayment = () => {
    setPlan(currentPlan => ({
      ...currentPlan,
      payments: [
        ...currentPlan.payments,
        {
          id: `payment-${Date.now()}`,
          title: 'New payment checkpoint',
          description:
            'Describe what must be completed before this payment becomes due.',
          type: 'milestone',
          amount: 0,
          dueDate: '',
          status: 'pending',
          milestone: 'New delivery checkpoint',
          paidAt: null,
          createdAt: new Date().toISOString(),
        },
      ],
    }));
  };

  const deletePayment = paymentId => {
    setPlan(currentPlan => ({
      ...currentPlan,
      payments: currentPlan.payments.filter(
        payment => payment.id !== paymentId,
      ),
    }));
  };

  const persistPlan = nextPlan => {
    const storedPlans = getStoredPaymentPlans();

    localStorage.setItem(
      STORAGE_KEYS.PROJECT_PAYMENT_PLANS,
      JSON.stringify({
        ...storedPlans,
        [project.id]: nextPlan,
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

    const nextPlan = {
      ...plan,
      updatedAt: new Date().toISOString(),
    };

    persistPlan(nextPlan);

    await new Promise(resolve => {
      window.setTimeout(resolve, 450);
    });

    setPlan(nextPlan);
    setIsSaving(false);
    showSuccessMessage();
  };

  const handlePublish = () => {
    const nextPlan = {
      ...plan,
      status: 'published',
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    persistPlan(nextPlan);
    setPlan(nextPlan);
    showSuccessMessage();
  };

  const markPaymentPaid = paymentId => {
    const nextPayments = plan.payments.map(
      payment =>
        payment.id === paymentId
          ? {
              ...payment,
              status: 'paid',
              paidAt: new Date().toISOString(),
            }
          : payment,
    );

    const allPaid = nextPayments.every(
      payment =>
        ['paid', 'cancelled'].includes(
          payment.status,
        ),
    );

    const nextPlan = {
      ...plan,
      payments: nextPayments,
      status: allPaid
        ? 'completed'
        : plan.status,
      updatedAt: new Date().toISOString(),
    };

    persistPlan(nextPlan);
    setPlan(nextPlan);
    setSelectedPayment(null);
    showSuccessMessage();
  };

  const clientCanPay =
    !isTeam && plan.status === 'published';

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
              ? 'Payment management'
              : 'Project payments'}
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
            className={`${styles.navigationLink} ${styles.navigationLinkActive}`}
          >
            <PaymentIcon />
            Payments
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

            {planStatuses[plan.status] ??
              'Draft'}
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
                  ? 'Payment manager'
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
                  Payment plan updated
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
                  onClick={addPayment}
                >
                  <PlusIcon />
                  Add payment
                </button>

                <button
                  type="button"
                  className={
                    styles.secondaryButton
                  }
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
                  Publish plan
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
                Staged project funding
              </span>

              <h1>Payment plan</h1>

              <p>
                {isTeam
                  ? 'Create clear payment checkpoints connected to visible delivery progress.'
                  : 'Review project payments, due dates and completed transactions throughout delivery.'}
              </p>

              <div className={styles.heroMeta}>
                <span>{project.title}</span>

                <span>
                  {planStatuses[plan.status]}
                </span>

                <span>
                  Updated{' '}
                  {formatDate(plan.updatedAt)}
                </span>
              </div>
            </div>

            <aside className={styles.progressCard}>
              <span>Payment progress</span>

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
                  <span>Paid</span>
                  <strong>
                    {formatCurrency(
                      paidAmount,
                      plan.currency,
                    )}
                  </strong>
                </div>

                <div>
                  <span>Remaining</span>
                  <strong>
                    {formatCurrency(
                      remainingAmount,
                      plan.currency,
                    )}
                  </strong>
                </div>
              </div>
            </aside>
          </section>

          {plan.status === 'draft' &&
            !isTeam && (
              <section className={styles.notice}>
                <PaymentIcon />

                <div>
                  <strong>
                    Payment plan not published
                  </strong>

                  <p>
                    The ShipPilot team is preparing
                    your staged payment schedule.
                  </p>
                </div>
              </section>
            )}

          <section className={styles.summaryGrid}>
            <article>
              <span>Project total</span>
              <strong>
                {formatCurrency(
                  totalAmount,
                  plan.currency,
                )}
              </strong>
              <small>
                Total planned project payments
              </small>
            </article>

            <article>
              <span>Paid</span>
              <strong>
                {formatCurrency(
                  paidAmount,
                  plan.currency,
                )}
              </strong>
              <small>
                Confirmed project payments
              </small>
            </article>

            <article>
              <span>Remaining</span>
              <strong>
                {formatCurrency(
                  remainingAmount,
                  plan.currency,
                )}
              </strong>
              <small>
                Amount still outstanding
              </small>
            </article>

            <article>
              <span>Next payment</span>
              <strong>
                {nextPayment
                  ? formatCurrency(
                      nextPayment.amount,
                      plan.currency,
                    )
                  : 'Completed'}
              </strong>
              <small>
                {nextPayment?.title ??
                  'All payments completed'}
              </small>
            </article>
          </section>

          <section className={styles.paymentsSection}>
            <div className={styles.sectionHeading}>
              <div>
                <span>Payment checkpoints</span>
                <h2>Project schedule</h2>
              </div>

              {isTeam && (
                <button
                  type="button"
                  onClick={addPayment}
                >
                  <PlusIcon />
                  Add checkpoint
                </button>
              )}
            </div>

            <div className={styles.paymentList}>
              {plan.payments.map(
                (payment, index) => (
                  <motion.article
                    key={payment.id}
                    className={`${styles.paymentCard} ${
                      styles[
                        `payment${payment.status
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
                    <div className={styles.paymentIndex}>
                      {payment.status === 'paid' ? (
                        <CheckIcon />
                      ) : (
                        index + 1
                      )}
                    </div>

                    <div className={styles.paymentContent}>
                      <div className={styles.paymentHeader}>
                        <div>
                          {isTeam ? (
                            <input
                              type="text"
                              value={payment.title}
                              aria-label={`Payment ${
                                index + 1
                              } title`}
                              onChange={event =>
                                updatePayment(
                                  payment.id,
                                  'title',
                                  event.target
                                    .value,
                                )
                              }
                            />
                          ) : (
                            <h3>
                              {payment.title}
                            </h3>
                          )}

                          <div className={styles.badges}>
                            <span>
                              {
                                paymentTypes.find(
                                  type =>
                                    type.id ===
                                    payment.type,
                                )?.label
                              }
                            </span>

                            <span>
                              {
                                paymentStatuses[
                                  payment.status
                                ]
                              }
                            </span>
                          </div>
                        </div>

                        <strong
                          className={styles.amount}
                        >
                          {formatCurrency(
                            payment.amount,
                            plan.currency,
                          )}
                        </strong>
                      </div>

                      {isTeam ? (
                        <textarea
                          rows="3"
                          value={payment.description}
                          aria-label={`Payment ${
                            index + 1
                          } description`}
                          onChange={event =>
                            updatePayment(
                              payment.id,
                              'description',
                              event.target.value,
                            )
                          }
                        />
                      ) : (
                        <p>{payment.description}</p>
                      )}

                      <div className={styles.milestone}>
                        <span>Release checkpoint</span>

                        {isTeam ? (
                          <input
                            type="text"
                            value={payment.milestone}
                            onChange={event =>
                              updatePayment(
                                payment.id,
                                'milestone',
                                event.target.value,
                              )
                            }
                          />
                        ) : (
                          <strong>
                            {payment.milestone}
                          </strong>
                        )}
                      </div>

                      <div className={styles.paymentFooter}>
                        {isTeam ? (
                          <div className={styles.editorFields}>
                            <label>
                              Payment type
                              <select
                                value={payment.type}
                                onChange={event =>
                                  updatePayment(
                                    payment.id,
                                    'type',
                                    event.target
                                      .value,
                                  )
                                }
                              >
                                {paymentTypes.map(
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
                              Amount
                              <input
                                type="number"
                                min="0"
                                value={payment.amount}
                                onChange={event =>
                                  updatePayment(
                                    payment.id,
                                    'amount',
                                    event.target
                                      .value,
                                  )
                                }
                              />
                            </label>

                            <label>
                              Due date
                              <input
                                type="date"
                                value={payment.dueDate}
                                onChange={event =>
                                  updatePayment(
                                    payment.id,
                                    'dueDate',
                                    event.target
                                      .value,
                                  )
                                }
                              />
                            </label>

                            <label>
                              Status
                              <select
                                value={payment.status}
                                onChange={event =>
                                  updatePayment(
                                    payment.id,
                                    'status',
                                    event.target
                                      .value,
                                  )
                                }
                              >
                                {Object.entries(
                                  paymentStatuses,
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
                          <div className={styles.clientMeta}>
                            <span>
                              Due:{' '}
                              <strong>
                                {formatDate(
                                  payment.dueDate,
                                )}
                              </strong>
                            </span>

                            {payment.paidAt && (
                              <span>
                                Paid:{' '}
                                <strong>
                                  {formatDate(
                                    payment.paidAt,
                                  )}
                                </strong>
                              </span>
                            )}
                          </div>
                        )}

                        <div className={styles.paymentActions}>
                          {isTeam ? (
                            <button
                              type="button"
                              className={
                                styles.deleteButton
                              }
                              aria-label={`Delete ${payment.title}`}
                              onClick={() =>
                                deletePayment(
                                  payment.id,
                                )
                              }
                            >
                              <DeleteIcon />
                            </button>
                          ) : (
                            clientCanPay &&
                            ![
                              'paid',
                              'cancelled',
                            ].includes(
                              payment.status,
                            ) && (
                              <button
                                type="button"
                                className={
                                  styles.payButton
                                }
                                onClick={() =>
                                  setSelectedPayment(
                                    payment,
                                  )
                                }
                              >
                                <PaymentIcon />
                                Mark as paid
                              </button>
                            )
                          )}

                          {!isTeam &&
                            payment.status ===
                              'paid' && (
                              <span
                                className={
                                  styles.paidLabel
                                }
                              >
                                <CheckIcon />
                                Payment completed
                              </span>
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
                <span>Payment terms</span>
                <h2>Plan notes</h2>
              </div>
            </div>

            {isTeam ? (
              <textarea
                rows="6"
                value={plan.notes}
                placeholder="Add payment terms, conditions or important delivery rules..."
                onChange={event =>
                  updatePlan({
                    notes: event.target.value,
                  })
                }
              />
            ) : (
              <p>
                {plan.notes ||
                  'No additional payment notes were provided.'}
              </p>
            )}
          </section>

          <section className={styles.helpBanner}>
            <div>
              <span>
                Clear payment checkpoints
              </span>

              <h2>
                Keep delivery and payment aligned.
              </h2>

              <p>
                Every payment is linked to a visible
                project result, so both sides know
                what happens next.
              </p>
            </div>

            <Link
              to={`${basePath}/messages`}
            >
              <MessageIcon />
              Discuss payments
            </Link>
          </section>
        </motion.div>
      </section>

      <AnimatePresence>
        {selectedPayment && (
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
                  <span>Payment confirmation</span>
                  <h2>
                    Confirm payment
                  </h2>
                </div>

                <button
                  type="button"
                  aria-label="Close payment confirmation"
                  onClick={() =>
                    setSelectedPayment(null)
                  }
                >
                  <CloseIcon />
                </button>
              </header>

              <div className={styles.modalPayment}>
                <span>
                  {selectedPayment.title}
                </span>

                <strong>
                  {formatCurrency(
                    selectedPayment.amount,
                    plan.currency,
                  )}
                </strong>

                <p>
                  This prototype records the
                  payment as completed in local
                  storage. A real payment provider
                  will be connected later.
                </p>
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedPayment(null)
                  }
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() =>
                    markPaymentPaid(
                      selectedPayment.id,
                    )
                  }
                >
                  <CheckIcon />
                  Confirm payment
                </button>
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default ProjectPaymentsPage;