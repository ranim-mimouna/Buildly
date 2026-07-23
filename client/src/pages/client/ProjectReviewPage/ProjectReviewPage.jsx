import { useMemo, useState } from 'react';
import {
  Link,
  Navigate,
  useNavigate,
} from 'react-router-dom';

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from 'motion/react';

import styles from './ProjectReviewPage.module.css';

const progressSteps = [
  {
    label: 'Project idea',
    description: 'The product you want to create',
  },
  {
    label: 'Requirements',
    description: 'Features, users and priorities',
  },
  {
    label: 'Project details',
    description: 'Budget, timeline and support',
  },
  {
    label: 'Review',
    description: 'Confirm and submit your request',
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

const getStorageData = key => {
  const savedData = localStorage.getItem(key);

  if (!savedData) {
    return null;
  }

  try {
    return JSON.parse(savedData);
  } catch {
    localStorage.removeItem(key);

    return null;
  }
};

const formatLaunchDate = value => {
  if (!value) {
    return 'Flexible';
  }

  const date = new Date(`${value}T00:00:00`);

  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

const createProjectId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `buildly-${Date.now()}-${Math.random()
    .toString(16)
    .slice(2)}`;
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

const EditIcon = () => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M13.5 5.5L18.5 10.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M4 20L5.2 14.8L16.5 3.5C17.3 2.7 18.7 2.7 19.5 3.5L20.5 4.5C21.3 5.3 21.3 6.7 20.5 7.5L9.2 18.8L4 20Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
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

const ShieldIcon = () => {
  return (
    <svg
      width="22"
      height="22"
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

      <path
        d="M9 12L11 14L15.5 9.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const ReviewRow = ({ label, value }) => {
  return (
    <div className={styles.reviewRow}>
      <span>{label}</span>
      <strong>{value || 'Not provided'}</strong>
    </div>
  );
};

const ReviewSection = ({
  title,
  description,
  editPath,
  children,
}) => {
  return (
    <motion.section
      className={styles.reviewSection}
      initial={{
        opacity: 0,
        y: 18,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.45,
      }}
    >
      <div className={styles.sectionHeader}>
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>

        <Link
          to={editPath}
          className={styles.editButton}
        >
          <EditIcon />
          Edit
        </Link>
      </div>

      <div className={styles.sectionContent}>
        {children}
      </div>
    </motion.section>
  );
};

const ProjectReviewPage = () => {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();

  const projectDraft = useMemo(
    () =>
      getStorageData('buildly-new-project-draft'),
    [],
  );

  const requirementsDraft = useMemo(
    () =>
      getStorageData(
        'buildly-project-requirements-draft',
      ),
    [],
  );

  const detailsDraft = useMemo(
    () =>
      getStorageData(
        'buildly-project-details-draft',
      ),
    [],
  );

  const [acceptedTerms, setAcceptedTerms] =
    useState(false);

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  if (!projectDraft) {
    return (
      <Navigate
        to="/client/projects/new"
        replace
      />
    );
  }

  if (!requirementsDraft) {
    return (
      <Navigate
        to="/client/projects/new/requirements"
        replace
      />
    );
  }

  if (!detailsDraft) {
    return (
      <Navigate
        to="/client/projects/new/details"
        replace
      />
    );
  }

  const handleSubmit = async () => {
    if (!acceptedTerms) {
      setError(
        'Please confirm that the information is correct.',
      );

      return;
    }

    setError('');
    setIsSubmitting(true);

    const submittedProject = {
      id: createProjectId(),
      title: projectDraft.projectTitle,
      category: projectDraft.selectedCategory,
      description: projectDraft.description,
      requirements: {
        targetUsers: requirementsDraft.targetUsers,
        features:
          requirementsDraft.selectedFeatures ?? [],
        customFeature:
          requirementsDraft.customFeature ?? '',
        stage: requirementsDraft.projectStage,
        priority: requirementsDraft.priority,
        notes:
          requirementsDraft.additionalNotes ?? '',
      },
      details: {
        budget: detailsDraft.budget,
        timeline: detailsDraft.timeline,
        launchDate: detailsDraft.launchDate,
        designStatus: detailsDraft.designStatus,
        ownership: detailsDraft.ownership,
        support: detailsDraft.support,
        notes: detailsDraft.detailsNotes ?? '',
      },
      status: 'submitted',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const existingProjects =
      getStorageData('buildly-projects') ?? [];

    localStorage.setItem(
      'buildly-projects',
      JSON.stringify([
        submittedProject,
        ...existingProjects,
      ]),
    );

    localStorage.setItem(
      'buildly-last-submitted-project',
      JSON.stringify(submittedProject),
    );

    localStorage.removeItem(
      'buildly-new-project-draft',
    );

    localStorage.removeItem(
      'buildly-project-requirements-draft',
    );

    localStorage.removeItem(
      'buildly-project-details-draft',
    );

    await new Promise(resolve => {
      window.setTimeout(resolve, 700);
    });

    navigate('/client/dashboard', {
      replace: true,
      state: {
        projectSubmitted: true,
        projectId: submittedProject.id,
      },
    });
  };

  return (
    <main className={styles.page}>
      <div
        className={styles.background}
        aria-hidden="true"
      >
        <div className={styles.grid} />
        <div className={styles.glowOne} />
        <div className={styles.glowTwo} />
      </div>

      <div className={styles.layout}>
        <motion.aside
          className={styles.sidebar}
          initial={{
            opacity: 0,
            x: prefersReducedMotion ? 0 : -25,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.6,
          }}
        >
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

          <div className={styles.sidebarCopy}>
            <span className={styles.sidebarEyebrow}>
              Project onboarding
            </span>

            <h1>Ready to build.</h1>

            <p>
              Review the complete request before
              sending it to your future Buildly
              product team.
            </p>
          </div>

          <div className={styles.progress}>
            {progressSteps.map((step, index) => {
              const isComplete = index < 3;
              const isActive = index === 3;

              return (
                <div
                  key={step.label}
                  className={`${styles.progressStep} ${
                    isActive
                      ? styles.progressStepActive
                      : ''
                  }`}
                >
                  <div
                    className={
                      styles.progressIndicator
                    }
                  >
                    <span
                      className={`${styles.progressCircle} ${
                        isComplete
                          ? styles.progressCircleComplete
                          : ''
                      }`}
                    >
                      {isComplete ? (
                        <CheckIcon />
                      ) : (
                        index + 1
                      )}
                    </span>

                    {index <
                      progressSteps.length - 1 && (
                      <span
                        className={
                          styles.progressLine
                        }
                      />
                    )}
                  </div>

                  <div>
                    <strong>{step.label}</strong>
                    <span>
                      {step.description}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className={styles.projectPreview}>
            <span>Ready to submit</span>

            <strong>
              {projectDraft.projectTitle}
            </strong>

            <p>
              Your answers will be used to prepare
              the first Buildly project review.
            </p>
          </div>

          <span
            className={styles.sidebarCopyright}
          >
            © {new Date().getFullYear()} Buildly
          </span>
        </motion.aside>

        <section className={styles.content}>
          <motion.div
            className={styles.reviewContainer}
            initial={{
              opacity: 0,
              y: prefersReducedMotion ? 0 : 28,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.65,
              delay: 0.08,
            }}
          >
            <header className={styles.pageHeader}>
              <div>
                <span>Step 4 of 4</span>

                <h2>Review your project</h2>

                <p>
                  Make sure everything looks right.
                  You can return to any step before
                  submitting.
                </p>
              </div>

              <div
                className={
                  styles.completionBadge
                }
              >
                <span>100%</span>

                <div>
                  <span />
                </div>
              </div>
            </header>

            <div className={styles.securityCard}>
              <span>
                <ShieldIcon />
              </span>

              <div>
                <strong>
                  Your project stays private.
                </strong>

                <p>
                  Only the Buildly team assigned to
                  review your request will access
                  these details.
                </p>
              </div>
            </div>

            <div className={styles.reviewSections}>
              <ReviewSection
                title="Project idea"
                description="The product and category you want to build."
                editPath="/client/projects/new"
              >
                <ReviewRow
                  label="Project title"
                  value={projectDraft.projectTitle}
                />

                <ReviewRow
                  label="Category"
                  value={
                    categoryLabels[
                      projectDraft.selectedCategory
                    ]
                  }
                />

                <div
                  className={
                    styles.descriptionRow
                  }
                >
                  <span>Description</span>
                  <p>
                    {projectDraft.description}
                  </p>
                </div>
              </ReviewSection>

              <ReviewSection
                title="Requirements"
                description="The users, features and current direction."
                editPath="/client/projects/new/requirements"
              >
                <div
                  className={
                    styles.descriptionRow
                  }
                >
                  <span>Target users</span>
                  <p>
                    {requirementsDraft.targetUsers}
                  </p>
                </div>

                <ReviewRow
                  label="Project stage"
                  value={
                    stageLabels[
                      requirementsDraft.projectStage
                    ]
                  }
                />

                <ReviewRow
                  label="Main priority"
                  value={
                    priorityLabels[
                      requirementsDraft.priority
                    ]
                  }
                />

                <div
                  className={styles.tagsRow}
                >
                  <span>Selected features</span>

                  <div className={styles.tags}>
                    {requirementsDraft.selectedFeatures
                      ?.length > 0 ? (
                      requirementsDraft.selectedFeatures.map(
                        feature => (
                          <span key={feature}>
                            {feature}
                          </span>
                        ),
                      )
                    ) : (
                      <small>
                        No predefined features
                        selected
                      </small>
                    )}

                    {requirementsDraft.customFeature && (
                      <span>
                        {
                          requirementsDraft.customFeature
                        }
                      </span>
                    )}
                  </div>
                </div>

                {requirementsDraft.additionalNotes && (
                  <div
                    className={
                      styles.descriptionRow
                    }
                  >
                    <span>Additional notes</span>
                    <p>
                      {
                        requirementsDraft.additionalNotes
                      }
                    </p>
                  </div>
                )}
              </ReviewSection>

              <ReviewSection
                title="Project details"
                description="The practical delivery preferences."
                editPath="/client/projects/new/details"
              >
                <ReviewRow
                  label="Budget"
                  value={
                    budgetLabels[
                      detailsDraft.budget
                    ]
                  }
                />

                <ReviewRow
                  label="Timeline"
                  value={
                    timelineLabels[
                      detailsDraft.timeline
                    ]
                  }
                />

                <ReviewRow
                  label="Launch date"
                  value={formatLaunchDate(
                    detailsDraft.launchDate,
                  )}
                />

                <ReviewRow
                  label="Design status"
                  value={
                    designLabels[
                      detailsDraft.designStatus
                    ]
                  }
                />

                <ReviewRow
                  label="Team setup"
                  value={
                    ownershipLabels[
                      detailsDraft.ownership
                    ]
                  }
                />

                <ReviewRow
                  label="After-launch support"
                  value={
                    supportLabels[
                      detailsDraft.support
                    ]
                  }
                />

                {detailsDraft.detailsNotes && (
                  <div
                    className={
                      styles.descriptionRow
                    }
                  >
                    <span>Delivery notes</span>
                    <p>
                      {detailsDraft.detailsNotes}
                    </p>
                  </div>
                )}
              </ReviewSection>
            </div>

            <div className={styles.confirmationCard}>
              <label
                className={styles.checkboxLabel}
              >
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={event => {
                    setAcceptedTerms(
                      event.target.checked,
                    );

                    if (event.target.checked) {
                      setError('');
                    }
                  }}
                />

                <span
                  className={styles.customCheckbox}
                >
                  {acceptedTerms && <CheckIcon />}
                </span>

                <span>
                  I confirm that the information
                  above is correct and can be
                  reviewed by the Buildly team.
                </span>
              </label>

              <AnimatePresence>
                {error && (
                  <motion.span
                    className={styles.errorMessage}
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
                    {error}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            <div className={styles.formActions}>
              <motion.button
                type="button"
                className={styles.backButton}
                onClick={() => {
                  navigate(
                    '/client/projects/new/details',
                  );
                }}
                whileHover={
                  prefersReducedMotion
                    ? undefined
                    : {
                        x: -2,
                      }
                }
              >
                <ArrowIcon direction="left" />
                Back
              </motion.button>

              <motion.button
                type="button"
                className={styles.submitButton}
                disabled={isSubmitting}
                onClick={handleSubmit}
                whileHover={
                  prefersReducedMotion ||
                  isSubmitting
                    ? undefined
                    : {
                        y: -2,
                      }
                }
                whileTap={
                  prefersReducedMotion ||
                  isSubmitting
                    ? undefined
                    : {
                        scale: 0.98,
                      }
                }
              >
                {isSubmitting ? (
                  <>
                    <span
                      className={styles.spinner}
                    />
                    Submitting project
                  </>
                ) : (
                  <>
                    Submit project
                    <ArrowIcon />
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </section>
      </div>
    </main>
  );
};

export default ProjectReviewPage;