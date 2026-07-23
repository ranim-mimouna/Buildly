import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { motion, useReducedMotion } from 'motion/react';

import styles from './NewProjectPage.module.css';

const projectCategories = [
  {
    id: 'web-app',
    label: 'Web App',
    description: 'A responsive product used in the browser.',
    icon: 'web',
  },
  {
    id: 'mobile-app',
    label: 'Mobile App',
    description: 'An application designed for phones and tablets.',
    icon: 'mobile',
  },
  {
    id: 'saas',
    label: 'SaaS',
    description: 'A subscription-based software platform.',
    icon: 'saas',
  },
  {
    id: 'marketplace',
    label: 'Marketplace',
    description: 'Connect buyers, sellers, providers or customers.',
    icon: 'marketplace',
  },
  {
    id: 'ai-product',
    label: 'AI Product',
    description: 'A product powered by intelligent features.',
    icon: 'ai',
  },
  {
    id: 'internal-tool',
    label: 'Internal Tool',
    description: 'Software that improves your team’s workflow.',
    icon: 'tool',
  },
  {
    id: 'ecommerce',
    label: 'E-commerce',
    description: 'An online store or commerce experience.',
    icon: 'commerce',
  },
  {
    id: 'other',
    label: 'Other',
    description: 'Something different or not fully defined yet.',
    icon: 'other',
  },
];

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

const projectTypeCategoryMap = {
  'Web application': 'web-app',
  'Mobile application': 'mobile-app',
  'SaaS platform': 'saas',
  Marketplace: 'marketplace',
  'Internal tool': 'internal-tool',
  'AI-powered product': 'ai-product',
};

const getInitialFormData = landingPageData => {
  const landingCategory =
    projectTypeCategoryMap[landingPageData.projectType] ?? '';

  const fallbackData = {
    projectTitle: '',
    selectedCategory: landingCategory,
    description: landingPageData.idea,
  };

  const savedDraft = localStorage.getItem(
    'buildly-new-project-draft',
  );

  if (!savedDraft) {
    return fallbackData;
  }

  try {
    const parsedDraft = JSON.parse(savedDraft);

    return {
      projectTitle: parsedDraft.projectTitle ?? '',
      selectedCategory:
        parsedDraft.selectedCategory || landingCategory,
      description:
        parsedDraft.description || landingPageData.idea,
    };
  } catch {
    localStorage.removeItem('buildly-new-project-draft');

    return fallbackData;
  }
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

const WebIcon = () => {
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

      <circle cx="6" cy="6" r="0.8" fill="currentColor" />
      <circle cx="9" cy="6" r="0.8" fill="currentColor" />
    </svg>
  );
};

const MobileIcon = () => {
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

      <path
        d="M10 5H14"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      <circle cx="12" cy="18.5" r="0.9" fill="currentColor" />
    </svg>
  );
};

const SaasIcon = () => {
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
};

const MarketplaceIcon = () => {
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
        strokeLinejoin="round"
      />

      <path
        d="M9 20V14H15V20"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M4 9C4 10.4 5.1 11.5 6.5 11.5C7.9 11.5 9 10.4 9 9C9 10.4 10.1 11.5 11.5 11.5C12.9 11.5 14 10.4 14 9C14 10.4 15.1 11.5 16.5 11.5C17.9 11.5 19 10.4 19 9"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
};

const AiIcon = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="5"
        y="5"
        width="14"
        height="14"
        rx="4"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M9 12H15"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      <circle cx="9" cy="9" r="1" fill="currentColor" />
      <circle cx="15" cy="9" r="1" fill="currentColor" />

      <path
        d="M9 2V5M15 2V5M9 19V22M15 19V22M2 9H5M2 15H5M19 9H22M19 15H22"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
};

const ToolIcon = () => {
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
};

const CommerceIcon = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 5H6L8 15H18L20 8H7"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle
        cx="9"
        cy="19"
        r="1.5"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <circle
        cx="17"
        cy="19"
        r="1.5"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
};

const OtherIcon = () => {
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

const CategoryIcon = ({ icon }) => {
  const icons = {
    web: <WebIcon />,
    mobile: <MobileIcon />,
    saas: <SaasIcon />,
    marketplace: <MarketplaceIcon />,
    ai: <AiIcon />,
    tool: <ToolIcon />,
    commerce: <CommerceIcon />,
    other: <OtherIcon />,
  };

  return icons[icon] ?? <OtherIcon />;
};

const NewProjectPage = () => {
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();

  const landingPageData = useMemo(() => {
    return {
      projectType: location.state?.projectType ?? '',
      idea: location.state?.idea ?? '',
    };
  }, [location.state]);

  const initialFormData = useMemo(
    () => getInitialFormData(landingPageData),
    [landingPageData],
  );

  const [projectTitle, setProjectTitle] = useState(
    initialFormData.projectTitle,
  );

  const [selectedCategory, setSelectedCategory] = useState(
    initialFormData.selectedCategory,
  );

  const [description, setDescription] = useState(
    initialFormData.description,
  );
  const [errors, setErrors] = useState({});
  const [saveMessage, setSaveMessage] = useState('');
  const [isStepComplete, setIsStepComplete] = useState(false);

  const createDraft = () => {
    return {
      projectTitle: projectTitle.trim(),
      selectedCategory,
      description: description.trim(),
      updatedAt: new Date().toISOString(),
    };
  };

  const handleSaveDraft = () => {
    localStorage.setItem(
      'buildly-new-project-draft',
      JSON.stringify(createDraft()),
    );

    setSaveMessage('Draft saved');

    window.setTimeout(() => {
      setSaveMessage('');
    }, 2500);
  };

  const handleSubmit = event => {
    event.preventDefault();

    const nextErrors = {};

    if (!projectTitle.trim()) {
      nextErrors.projectTitle =
        'Please give your project a temporary title.';
    }

    if (!selectedCategory) {
      nextErrors.selectedCategory =
        'Please select the closest project category.';
    }

    if (!description.trim()) {
      nextErrors.description =
        'Please add a short description of your idea.';
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    localStorage.setItem(
      'buildly-new-project-draft',
      JSON.stringify(createDraft()),
    );

    setIsStepComplete(true);
  };

  const handleCategorySelect = categoryId => {
    setSelectedCategory(categoryId);

    setErrors(currentErrors => ({
      ...currentErrors,
      selectedCategory: '',
    }));
  };

  return (
    <main className={styles.page}>
      <div className={styles.background} aria-hidden="true">
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

            <h1>Start your project.</h1>

            <p>
              Give us the first version of your idea. It does not
              need to be complete or technical.
            </p>
          </div>

          <div className={styles.progress}>
            {progressSteps.map((step, index) => {
              const isActive = index === 0;
              const isComplete = index === 0 && isStepComplete;

              return (
                <div
                  key={step.label}
                  className={`${styles.progressStep} ${
                    isActive ? styles.progressStepActive : ''
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

          <div className={styles.helpCard}>
            <span>Need help?</span>

            <strong>
              Most project requests take less than five minutes.
            </strong>

            <p>
              You can save your progress and return at any time.
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
                <span>Step 1 of 4</span>

                <h2>Tell us about your idea</h2>

                <p>
                  Do not worry if it is not fully defined. We will
                  help shape it together.
                </p>
              </div>

              <div className={styles.completionBadge}>
                <span>25%</span>
                <div>
                  <span />
                </div>
              </div>
            </header>

            {isStepComplete && (
              <motion.div
                className={styles.successMessage}
                initial={{
                  opacity: 0,
                  y: -8,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
              >
                <span>
                  <CheckIcon />
                </span>

                <div>
                  <strong>Step 1 completed</strong>
                  <p>
                    Your project idea has been saved. The
                    requirements step is next.
                  </p>
                </div>
              </motion.div>
            )}

            <form
              className={styles.form}
              onSubmit={handleSubmit}
              noValidate
            >
              <label className={styles.field}>
                <span className={styles.fieldLabel}>
                  Project title
                  <small>Required</small>
                </span>

                <input
                  type="text"
                  value={projectTitle}
                  placeholder="AI Marketplace for Freelancers"
                  aria-invalid={Boolean(errors.projectTitle)}
                  onChange={event => {
                    setProjectTitle(event.target.value);

                    setErrors(currentErrors => ({
                      ...currentErrors,
                      projectTitle: '',
                    }));

                    setIsStepComplete(false);
                  }}
                />

                {errors.projectTitle && (
                  <span className={styles.errorMessage}>
                    {errors.projectTitle}
                  </span>
                )}

                <small className={styles.fieldHint}>
                  A working title is enough. You can change it
                  later.
                </small>
              </label>

              <fieldset className={styles.categoryFieldset}>
                <legend>
                  <span className={styles.fieldLabel}>
                    Project category
                    <small>Required</small>
                  </span>
                </legend>

                <div className={styles.categoryGrid}>
                  {projectCategories.map((category, index) => {
                    const isSelected =
                      selectedCategory === category.id;

                    return (
                      <motion.button
                        key={category.id}
                        type="button"
                        className={`${styles.categoryCard} ${
                          isSelected
                            ? styles.categoryCardSelected
                            : ''
                        }`}
                        onClick={() =>
                          handleCategorySelect(category.id)
                        }
                        initial={{
                          opacity: 0,
                          y: prefersReducedMotion ? 0 : 15,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          duration: 0.4,
                          delay: index * 0.035,
                        }}
                        whileHover={
                          prefersReducedMotion
                            ? undefined
                            : {
                                y: -4,
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
                        <span className={styles.categoryIcon}>
                          <CategoryIcon icon={category.icon} />
                        </span>

                        <span className={styles.categoryCopy}>
                          <strong>{category.label}</strong>
                          <small>{category.description}</small>
                        </span>

                        <span className={styles.selectionMark}>
                          {isSelected && <CheckIcon />}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>

                {errors.selectedCategory && (
                  <span className={styles.errorMessage}>
                    {errors.selectedCategory}
                  </span>
                )}
              </fieldset>

              <label className={styles.field}>
                <span className={styles.fieldLabel}>
                  Short description
                  <small>Required</small>
                </span>

                <textarea
                  value={description}
                  rows="7"
                  maxLength="1200"
                  placeholder="Describe your idea in your own words. What problem does it solve, and who would use it?"
                  aria-invalid={Boolean(errors.description)}
                  onChange={event => {
                    setDescription(event.target.value);

                    setErrors(currentErrors => ({
                      ...currentErrors,
                      description: '',
                    }));

                    setIsStepComplete(false);
                  }}
                />

                <div className={styles.textareaFooter}>
                  <span>
                    A few sentences are enough for this step.
                  </span>

                  <span>{description.length}/1200</span>
                </div>

                {errors.description && (
                  <span className={styles.errorMessage}>
                    {errors.description}
                  </span>
                )}
              </label>

              <div className={styles.formActions}>
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
            </form>
          </motion.div>
        </section>
      </div>
    </main>
  );
};

export default NewProjectPage;