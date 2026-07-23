import { useMemo, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import { motion, useReducedMotion } from 'motion/react';

import styles from './ProjectRequirementsPage.module.css';

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

const projectStages = [
  {
    id: 'idea',
    label: 'Just an idea',
    description: 'I am still shaping the concept.',
  },
  {
    id: 'research',
    label: 'Researching',
    description: 'I have explored users, competitors or features.',
  },
  {
    id: 'design',
    label: 'Design ready',
    description: 'I already have wireframes or visual designs.',
  },
  {
    id: 'existing-product',
    label: 'Existing product',
    description: 'I want to improve or rebuild something.',
  },
];

const projectPriorities = [
  {
    id: 'speed',
    label: 'Launch quickly',
    description: 'Get a focused first version live soon.',
  },
  {
    id: 'quality',
    label: 'Highest quality',
    description: 'Prioritize polish, scalability and details.',
  },
  {
    id: 'budget',
    label: 'Stay efficient',
    description: 'Focus on the most valuable features first.',
  },
  {
    id: 'exploration',
    label: 'Help me decide',
    description: 'I need guidance on the right direction.',
  },
];

const featureSuggestions = [
  'User accounts',
  'Admin dashboard',
  'Payments',
  'Subscriptions',
  'Search and filters',
  'Messaging',
  'Notifications',
  'Analytics',
  'AI features',
  'File uploads',
  'Booking system',
  'Reviews and ratings',
];

const getSavedProjectDraft = () => {
  const savedDraft = localStorage.getItem(
    'buildly-new-project-draft',
  );

  if (!savedDraft) {
    return null;
  }

  try {
    return JSON.parse(savedDraft);
  } catch {
    localStorage.removeItem('buildly-new-project-draft');

    return null;
  }
};

const getInitialRequirements = () => {
  const savedRequirements = localStorage.getItem(
    'buildly-project-requirements-draft',
  );

  if (!savedRequirements) {
    return {
      targetUsers: '',
      selectedFeatures: [],
      customFeature: '',
      projectStage: '',
      priority: '',
      additionalNotes: '',
    };
  }

  try {
    const parsedRequirements = JSON.parse(savedRequirements);

    return {
      targetUsers: parsedRequirements.targetUsers ?? '',
      selectedFeatures: Array.isArray(
        parsedRequirements.selectedFeatures,
      )
        ? parsedRequirements.selectedFeatures
        : [],
      customFeature: parsedRequirements.customFeature ?? '',
      projectStage: parsedRequirements.projectStage ?? '',
      priority: parsedRequirements.priority ?? '',
      additionalNotes:
        parsedRequirements.additionalNotes ?? '',
    };
  } catch {
    localStorage.removeItem(
      'buildly-project-requirements-draft',
    );

    return {
      targetUsers: '',
      selectedFeatures: [],
      customFeature: '',
      projectStage: '',
      priority: '',
      additionalNotes: '',
    };
  }
};

const ArrowIcon = ({ direction = 'right' }) => {
  const isLeft = direction === 'left';

  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      style={{
        transform: isLeft ? 'rotate(180deg)' : undefined,
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
      width="14"
      height="14"
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

const SparkIcon = () => {
  return (
    <svg
      width="21"
      height="21"
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
        d="M18.5 16L19.3 18.2L21.5 19L19.3 19.8L18.5 22L17.7 19.8L15.5 19L17.7 18.2L18.5 16Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const ProjectRequirementsPage = () => {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();

  const projectDraft = useMemo(
    () => getSavedProjectDraft(),
    [],
  );

  const initialRequirements = useMemo(
    () => getInitialRequirements(),
    [],
  );

  const [targetUsers, setTargetUsers] = useState(
    initialRequirements.targetUsers,
  );

  const [selectedFeatures, setSelectedFeatures] = useState(
    initialRequirements.selectedFeatures,
  );

  const [customFeature, setCustomFeature] = useState(
    initialRequirements.customFeature,
  );

  const [projectStage, setProjectStage] = useState(
    initialRequirements.projectStage,
  );

  const [priority, setPriority] = useState(
    initialRequirements.priority,
  );

  const [additionalNotes, setAdditionalNotes] = useState(
    initialRequirements.additionalNotes,
  );

  const [errors, setErrors] = useState({});
  const [saveMessage, setSaveMessage] = useState('');

  if (!projectDraft) {
    return <Navigate to="/client/projects/new" replace />;
  }

  const createRequirementsDraft = () => {
    return {
      targetUsers: targetUsers.trim(),
      selectedFeatures,
      customFeature: customFeature.trim(),
      projectStage,
      priority,
      additionalNotes: additionalNotes.trim(),
      updatedAt: new Date().toISOString(),
    };
  };

  const saveRequirements = () => {
    localStorage.setItem(
      'buildly-project-requirements-draft',
      JSON.stringify(createRequirementsDraft()),
    );
  };

  const handleSaveDraft = () => {
    saveRequirements();
    setSaveMessage('Draft saved');

    window.setTimeout(() => {
      setSaveMessage('');
    }, 2500);
  };

  const toggleFeature = feature => {
    setSelectedFeatures(currentFeatures => {
      if (currentFeatures.includes(feature)) {
        return currentFeatures.filter(
          currentFeature => currentFeature !== feature,
        );
      }

      return [...currentFeatures, feature];
    });

    setErrors(currentErrors => ({
      ...currentErrors,
      selectedFeatures: '',
    }));
  };

  const handleSubmit = event => {
    event.preventDefault();

    const nextErrors = {};

    if (!targetUsers.trim()) {
      nextErrors.targetUsers =
        'Please describe who will use this product.';
    }

    if (
      selectedFeatures.length === 0 &&
      !customFeature.trim()
    ) {
      nextErrors.selectedFeatures =
        'Please select or add at least one feature.';
    }

    if (!projectStage) {
      nextErrors.projectStage =
        'Please select the current project stage.';
    }

    if (!priority) {
      nextErrors.priority =
        'Please select your main project priority.';
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    saveRequirements();

    navigate('/client/projects/new/details');
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

            <h1>Shape the product.</h1>

            <p>
              Tell us who the product is for and what it should
              help them accomplish.
            </p>
          </div>

          <div className={styles.progress}>
            {progressSteps.map((step, index) => {
              const isComplete = index === 0;
              const isActive = index === 1;

              return (
                <div
                  key={step.label}
                  className={`${styles.progressStep} ${
                    isActive
                      ? styles.progressStepActive
                      : ''
                  }`}
                >
                  <div className={styles.progressIndicator}>
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

                    {index < progressSteps.length - 1 && (
                      <span className={styles.progressLine} />
                    )}
                  </div>

                  <div>
                    <strong>{step.label}</strong>
                    <span>{step.description}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className={styles.projectPreview}>
            <span>Current project</span>

            <strong>{projectDraft.projectTitle}</strong>

            <p>
              {projectDraft.description ||
                'Your project description'}
            </p>
          </div>

          <span className={styles.sidebarCopyright}>
            © {new Date().getFullYear()} Buildly
          </span>
        </motion.aside>

        <section className={styles.content}>
          <motion.div
            className={styles.formContainer}
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
            <header className={styles.formHeader}>
              <div>
                <span>Step 2 of 4</span>

                <h2>Define the requirements</h2>

                <p>
                  Choose the closest answers. Your Buildly team
                  will help refine everything later.
                </p>
              </div>

              <div className={styles.completionBadge}>
                <span>50%</span>

                <div>
                  <span />
                </div>
              </div>
            </header>

            <div className={styles.guidanceCard}>
              <span>
                <SparkIcon />
              </span>

              <div>
                <strong>You do not need a technical brief.</strong>

                <p>
                  Describe the outcome you want. We will turn it
                  into a clear product plan.
                </p>
              </div>
            </div>

            <form
              className={styles.form}
              onSubmit={handleSubmit}
              noValidate
            >
              <label className={styles.field}>
                <span className={styles.fieldLabel}>
                  Who will use this product?
                  <small>Required</small>
                </span>

                <textarea
                  value={targetUsers}
                  rows="4"
                  maxLength="600"
                  placeholder="For example: freelance designers who need an easier way to find clients and manage project payments."
                  aria-invalid={Boolean(errors.targetUsers)}
                  onChange={event => {
                    setTargetUsers(event.target.value);

                    setErrors(currentErrors => ({
                      ...currentErrors,
                      targetUsers: '',
                    }));
                  }}
                />

                <div className={styles.textareaFooter}>
                  <span>
                    Describe the main users and their problem.
                  </span>

                  <span>{targetUsers.length}/600</span>
                </div>

                {errors.targetUsers && (
                  <span className={styles.errorMessage}>
                    {errors.targetUsers}
                  </span>
                )}
              </label>

              <fieldset className={styles.fieldset}>
                <legend>
                  <span className={styles.fieldLabel}>
                    Which features might it need?
                    <small>Required</small>
                  </span>
                </legend>

                <p className={styles.fieldDescription}>
                  Select everything that feels relevant. This is
                  not a final commitment.
                </p>

                <div className={styles.featureGrid}>
                  {featureSuggestions.map(
                    (feature, index) => {
                      const isSelected =
                        selectedFeatures.includes(feature);

                      return (
                        <motion.button
                          key={feature}
                          type="button"
                          className={`${styles.featureButton} ${
                            isSelected
                              ? styles.featureButtonSelected
                              : ''
                          }`}
                          onClick={() =>
                            toggleFeature(feature)
                          }
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
                            duration: 0.35,
                            delay: index * 0.025,
                          }}
                          whileTap={
                            prefersReducedMotion
                              ? undefined
                              : {
                                  scale: 0.97,
                                }
                          }
                          aria-pressed={isSelected}
                        >
                          <span
                            className={
                              styles.featureCheck
                            }
                          >
                            {isSelected && <CheckIcon />}
                          </span>

                          {feature}
                        </motion.button>
                      );
                    },
                  )}
                </div>

                <label className={styles.customFeature}>
                  <span>Something else?</span>

                  <input
                    type="text"
                    value={customFeature}
                    maxLength="120"
                    placeholder="Add another important feature"
                    onChange={event => {
                      setCustomFeature(event.target.value);

                      setErrors(currentErrors => ({
                        ...currentErrors,
                        selectedFeatures: '',
                      }));
                    }}
                  />
                </label>

                {errors.selectedFeatures && (
                  <span className={styles.errorMessage}>
                    {errors.selectedFeatures}
                  </span>
                )}
              </fieldset>

              <fieldset className={styles.fieldset}>
                <legend>
                  <span className={styles.fieldLabel}>
                    What stage are you currently at?
                    <small>Required</small>
                  </span>
                </legend>

                <div className={styles.optionGrid}>
                  {projectStages.map(stage => {
                    const isSelected =
                      projectStage === stage.id;

                    return (
                      <motion.button
                        key={stage.id}
                        type="button"
                        className={`${styles.optionCard} ${
                          isSelected
                            ? styles.optionCardSelected
                            : ''
                        }`}
                        onClick={() => {
                          setProjectStage(stage.id);

                          setErrors(currentErrors => ({
                            ...currentErrors,
                            projectStage: '',
                          }));
                        }}
                        whileHover={
                          prefersReducedMotion
                            ? undefined
                            : {
                                y: -3,
                              }
                        }
                        whileTap={
                          prefersReducedMotion
                            ? undefined
                            : {
                                scale: 0.98,
                              }
                        }
                        aria-pressed={isSelected}
                      >
                        <span className={styles.optionTop}>
                          <strong>{stage.label}</strong>

                          <span
                            className={styles.selectionMark}
                          >
                            {isSelected && <CheckIcon />}
                          </span>
                        </span>

                        <small>{stage.description}</small>
                      </motion.button>
                    );
                  })}
                </div>

                {errors.projectStage && (
                  <span className={styles.errorMessage}>
                    {errors.projectStage}
                  </span>
                )}
              </fieldset>

              <fieldset className={styles.fieldset}>
                <legend>
                  <span className={styles.fieldLabel}>
                    What matters most right now?
                    <small>Required</small>
                  </span>
                </legend>

                <div className={styles.optionGrid}>
                  {projectPriorities.map(
                    projectPriority => {
                      const isSelected =
                        priority === projectPriority.id;

                      return (
                        <motion.button
                          key={projectPriority.id}
                          type="button"
                          className={`${styles.optionCard} ${
                            isSelected
                              ? styles.optionCardSelected
                              : ''
                          }`}
                          onClick={() => {
                            setPriority(
                              projectPriority.id,
                            );

                            setErrors(
                              currentErrors => ({
                                ...currentErrors,
                                priority: '',
                              }),
                            );
                          }}
                          whileHover={
                            prefersReducedMotion
                              ? undefined
                              : {
                                  y: -3,
                                }
                          }
                          whileTap={
                            prefersReducedMotion
                              ? undefined
                              : {
                                  scale: 0.98,
                                }
                          }
                          aria-pressed={isSelected}
                        >
                          <span className={styles.optionTop}>
                            <strong>
                              {projectPriority.label}
                            </strong>

                            <span
                              className={
                                styles.selectionMark
                              }
                            >
                              {isSelected && <CheckIcon />}
                            </span>
                          </span>

                          <small>
                            {projectPriority.description}
                          </small>
                        </motion.button>
                      );
                    },
                  )}
                </div>

                {errors.priority && (
                  <span className={styles.errorMessage}>
                    {errors.priority}
                  </span>
                )}
              </fieldset>

              <label className={styles.field}>
                <span className={styles.fieldLabel}>
                  Anything else we should know?
                  <small>Optional</small>
                </span>

                <textarea
                  value={additionalNotes}
                  rows="5"
                  maxLength="1000"
                  placeholder="Share references, existing tools, special requirements or anything important to your idea."
                  onChange={event => {
                    setAdditionalNotes(event.target.value);
                  }}
                />

                <div className={styles.textareaFooter}>
                  <span>
                    Links and rough notes are welcome.
                  </span>

                  <span>
                    {additionalNotes.length}/1000
                  </span>
                </div>
              </label>

              <div className={styles.formActions}>
                <motion.button
                  type="button"
                  className={styles.backButton}
                  onClick={() => {
                    saveRequirements();
                    navigate('/client/projects/new');
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

                <div className={styles.rightActions}>
                  <div className={styles.saveArea}>
                    <button
                      type="button"
                      className={styles.saveButton}
                      onClick={handleSaveDraft}
                    >
                      Save draft
                    </button>

                    {saveMessage && (
                      <span className={styles.saveMessage}>
                        <CheckIcon />
                        {saveMessage}
                      </span>
                    )}
                  </div>

                  <motion.button
                    type="submit"
                    className={styles.continueButton}
                    whileHover={
                      prefersReducedMotion
                        ? undefined
                        : {
                            y: -2,
                          }
                    }
                    whileTap={
                      prefersReducedMotion
                        ? undefined
                        : {
                            scale: 0.98,
                          }
                    }
                  >
                    Continue
                    <ArrowIcon />
                  </motion.button>
                </div>
              </div>
            </form>
          </motion.div>
        </section>
      </div>
    </main>
  );
};

export default ProjectRequirementsPage;