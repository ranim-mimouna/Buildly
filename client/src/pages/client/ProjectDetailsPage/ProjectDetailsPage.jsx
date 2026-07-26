import { useMemo, useState } from 'react';
import {
  Link,
  Navigate,
  useNavigate,
} from 'react-router-dom';

import {
  motion,
  useReducedMotion,
} from 'motion/react';

import { STORAGE_KEYS } from '../../../constants/storageKeys';
import styles from './ProjectDetailsPage.module.css';

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

const budgetOptions = [
  {
    id: 'under-250',
    label: 'Under €250',
    description:
      'Small fixes, university projects or very small improvements.',
  },
  {
    id: '250-500',
    label: '€250 – €500',
    description:
      'Landing pages, simple websites or small feature requests.',
  },
  {
    id: '500-1000',
    label: '€500 – €1,000',
    description:
      'Small MVPs, internal tools or larger improvements.',
  },
  {
    id: '1000-2500',
    label: '€1,000 – €2,500',
    description:
      'A complete MVP or a professional business application.',
  },
  {
    id: '2500-5000',
    label: '€2,500 – €5,000',
    description:
      'Larger products with multiple features and user roles.',
  },
  {
    id: '5000-10000',
    label: '€5,000 – €10,000',
    description:
      'Complex products requiring several development phases.',
  },
  {
    id: '10000-plus',
    label: 'More than €10,000',
    description:
      'Large custom platforms and long-term development.',
  },
  {
    id: 'not-sure',
    label: 'Not sure yet',
    description:
      'Help me estimate the right budget.',
  },
];

const timelineOptions = [
  {
    id: 'under-2-weeks',
    label: 'Within 2 weeks',
    description:
      'Best for urgent fixes, small improvements or simple pages.',
  },
  {
    id: '2-4-weeks',
    label: 'Within 2–4 weeks',
    description:
      'Suitable for websites, prototypes and focused small projects.',
  },
  {
    id: '1-2-months',
    label: 'Within 1–2 months',
    description:
      'A realistic timeline for small MVPs and business applications.',
  },
  {
    id: '3-4-months',
    label: 'Within 3–4 months',
    description:
      'More time for discovery, design, development and testing.',
  },
  {
    id: 'over-4-months',
    label: 'More than 4 months',
    description:
      'Best for larger platforms or projects delivered in phases.',
  },
  {
    id: 'flexible',
    label: 'Flexible',
    description:
      'Quality, scope and planning matter more than a fixed deadline.',
  },
];

const designOptions = [
  {
    id: 'none',
    label: 'No design yet',
    description: 'I need ShipPilot to shape the experience.',
  },
  {
    id: 'ideas',
    label: 'Ideas and references',
    description: 'I have inspiration but no finished screens.',
  },
  {
    id: 'wireframes',
    label: 'Wireframes ready',
    description: 'I already have basic product layouts.',
  },
  {
    id: 'finished-design',
    label: 'Finished designs',
    description: 'The visual interface is ready for development.',
  },
];

const ownershipOptions = [
  {
    id: 'full-team',
    label: 'ShipPilot builds the entire project',
    description:
      'Our team handles planning, design, development, testing and delivery.',
  },
  {
    id: 'collaborative',
    label: 'Work together with my team',
    description:
      'We collaborate with your developers, designers or product team.',
  },
  {
    id: 'development-only',
    label: 'Development only',
    description:
      'You already have designs or specifications and need implementation.',
  },
  {
    id: 'technical-partner',
    label: 'Long-term technical partner',
    description:
      'ShipPilot becomes your ongoing development partner as your product grows.',
  },
  {
    id: 'not-sure',
    label: 'Help me decide',
    description:
      'Recommend the best collaboration model for this project.',
  },
];

const supportOptions = [
  {
    id: 'handover-only',
    label: 'Delivery and handover only',
    description:
      'Receive the completed project, documentation and setup guidance.',
  },
  {
    id: 'warranty-support',
    label: 'Short warranty period',
    description:
      'Get help fixing launch-related issues after delivery.',
  },
  {
    id: 'improvement-package',
    label: 'Post-launch improvements',
    description:
      'Continue with a defined package of updates and refinements.',
  },
  {
    id: 'ongoing',
    label: 'Ongoing product support',
    description:
      'Keep a ShipPilot team available for maintenance and new features.',
  },
  {
    id: 'not-sure',
    label: 'Not sure yet',
    description:
      'Let ShipPilot recommend the right support model.',
  },
];

const getStorageData = (key) => {
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

const getInitialDetails = () => {
  const savedDetails = getStorageData(
    STORAGE_KEYS.PROJECT_DETAILS_DRAFT,
  );

  return {
    budget: savedDetails?.budget ?? '',
    timeline: savedDetails?.timeline ?? '',
    launchDate: savedDetails?.launchDate ?? '',
    designStatus: savedDetails?.designStatus ?? '',
    ownership: savedDetails?.ownership ?? '',
    support: savedDetails?.support ?? '',
    detailsNotes: savedDetails?.detailsNotes ?? '',
  };
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
        transform: isLeft
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

const CalendarIcon = () => {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="16"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M8 3V7M16 3V7M3 10H21"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
};

const OptionCard = ({
  option,
  selected,
  onSelect,
  reducedMotion,
}) => {
  return (
    <motion.button
      type="button"
      className={`${styles.optionCard} ${
        selected
          ? styles.optionCardSelected
          : ''
      }`}
      onClick={onSelect}
      whileHover={
        reducedMotion
          ? undefined
          : {
              y: -3,
            }
      }
      whileTap={
        reducedMotion
          ? undefined
          : {
              scale: 0.98,
            }
      }
      aria-pressed={selected}
    >
      <span className={styles.optionTop}>
        <strong>{option.label}</strong>

        <span className={styles.selectionMark}>
          {selected && <CheckIcon />}
        </span>
      </span>

      <small>{option.description}</small>
    </motion.button>
  );
};

const ProjectDetailsPage = () => {
  const navigate = useNavigate();
  const prefersReducedMotion =
    useReducedMotion();

  const projectDraft = useMemo(
    () =>
      getStorageData(
        STORAGE_KEYS.NEW_PROJECT_DRAFT,
      ),
    [],
  );

  const requirementsDraft = useMemo(
    () =>
      getStorageData(
        STORAGE_KEYS.PROJECT_REQUIREMENTS_DRAFT,
      ),
    [],
  );

  const initialDetails = useMemo(
    () => getInitialDetails(),
    [],
  );

  const [budget, setBudget] = useState(
    initialDetails.budget,
  );

  const [timeline, setTimeline] = useState(
    initialDetails.timeline,
  );

  const [launchDate, setLaunchDate] = useState(
    initialDetails.launchDate,
  );

  const [designStatus, setDesignStatus] =
    useState(initialDetails.designStatus);

  const [ownership, setOwnership] = useState(
    initialDetails.ownership,
  );

  const [support, setSupport] = useState(
    initialDetails.support,
  );

  const [detailsNotes, setDetailsNotes] =
    useState(initialDetails.detailsNotes);

  const [errors, setErrors] = useState({});
  const [saveMessage, setSaveMessage] =
    useState('');

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

  const createDetailsDraft = () => {
    return {
      budget,
      timeline,
      launchDate,
      designStatus,
      ownership,
      support,
      detailsNotes: detailsNotes.trim(),
      updatedAt: new Date().toISOString(),
    };
  };

  const saveDetails = () => {
    localStorage.setItem(
      STORAGE_KEYS.PROJECT_DETAILS_DRAFT,
      JSON.stringify(createDetailsDraft()),
    );
  };

  const handleSaveDraft = () => {
    saveDetails();
    setSaveMessage('Draft saved');

    window.setTimeout(() => {
      setSaveMessage('');
    }, 2500);
  };

  const clearError = (field) => {
    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: '',
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = {};

    if (!budget) {
      nextErrors.budget =
        'Please select a budget range.';
    }

    if (!timeline) {
      nextErrors.timeline =
        'Please select a preferred timeline.';
    }

    if (!designStatus) {
      nextErrors.designStatus =
        'Please select the current design status.';
    }

    if (!ownership) {
      nextErrors.ownership =
        'Please select how you want to work with ShipPilot.';
    }

    if (!support) {
      nextErrors.support =
        'Please select a support preference.';
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    saveDetails();

    navigate('/client/projects/new/review');
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
            x: prefersReducedMotion
              ? 0
              : -25,
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
            aria-label="ShipPilot home"
          >
            <span className={styles.logoMark}>
              <span />
              <span />
              <span />
            </span>

            <span>ShipPilot</span>
          </Link>

          <div className={styles.sidebarCopy}>
            <span
              className={styles.sidebarEyebrow}
            >
              Project onboarding
            </span>

            <h1>Plan the delivery.</h1>

            <p>
              Share the practical details that
              will help us recommend the right
              team and project approach.
            </p>
          </div>

          <div className={styles.progress}>
            {progressSteps.map(
              (step, index) => {
                const isComplete = index < 2;
                const isActive = index === 2;

                return (
                  <div
                    key={step.label}
                    className={`${
                      styles.progressStep
                    } ${
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
                        className={`${
                          styles.progressCircle
                        } ${
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
                        progressSteps.length -
                          1 && (
                        <span
                          className={
                            styles.progressLine
                          }
                        />
                      )}
                    </div>

                    <div>
                      <strong>
                        {step.label}
                      </strong>

                      <span>
                        {step.description}
                      </span>
                    </div>
                  </div>
                );
              },
            )}
          </div>

          <div className={styles.projectPreview}>
            <span>Current project</span>

            <strong>
              {projectDraft.projectTitle}
            </strong>

            <p>
              {projectDraft.description ||
                'Your project description'}
            </p>
          </div>

          <span
            className={styles.sidebarCopyright}
          >
            © {new Date().getFullYear()}{' '}
            ShipPilot
          </span>
        </motion.aside>

        <section className={styles.content}>
          <motion.div
            className={styles.formContainer}
            initial={{
              opacity: 0,
              y: prefersReducedMotion
                ? 0
                : 28,
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
                <span>Step 3 of 4</span>

                <h2>
                  Set the project details
                </h2>

                <p>
                  Estimates are completely fine.
                  These choices help us prepare the
                  right recommendation.
                </p>
              </div>

              <div
                className={
                  styles.completionBadge
                }
              >
                <span>75%</span>

                <div>
                  <span />
                </div>
              </div>
            </header>

            <div className={styles.guidanceCard}>
              <span>
                <CalendarIcon />
              </span>

              <div>
                <strong>
                  Nothing here locks you in.
                </strong>

                <p>
                  Budget, timing and delivery phases 
                  and support can all be refined after 
                  ShipPilot reviews your request.
                </p>
              </div>
            </div>

            <form
              className={styles.form}
              onSubmit={handleSubmit}
              noValidate
            >
              <fieldset
                className={styles.fieldset}
              >
                <legend>
                  <span
                    className={styles.fieldLabel}
                  >
                    What investment are you planning 
                    for this project?
                    <small>Required</small>
                  </span>
                </legend>

                <p className={styles.fieldHint}>
                  Don't worry if you aren't sure. ShipPilot can recommend the
                  most suitable budget after reviewing your project.
                </p>

                <div
                  className={styles.optionGrid}
                >
                  {budgetOptions.map(
                    (option) => (
                      <OptionCard
                        key={option.id}
                        option={option}
                        selected={
                          budget === option.id
                        }
                        reducedMotion={
                          prefersReducedMotion
                        }
                        onSelect={() => {
                          setBudget(option.id);
                          clearError('budget');
                        }}
                      />
                    ),
                  )}
                </div>

                {errors.budget && (
                  <span
                    className={
                      styles.errorMessage
                    }
                  >
                    {errors.budget}
                  </span>
                )}
              </fieldset>

              <fieldset
                className={styles.fieldset}
              >
                <legend>
                  <span
                    className={styles.fieldLabel}
                  >
                    When would you like the project completed?
                    <small>Required</small>
                  </span>
                </legend>

                <div
                  className={styles.optionGrid}
                >
                  {timelineOptions.map(
                    (option) => (
                      <OptionCard
                        key={option.id}
                        option={option}
                        selected={
                          timeline === option.id
                        }
                        reducedMotion={
                          prefersReducedMotion
                        }
                        onSelect={() => {
                          setTimeline(option.id);
                          clearError('timeline');
                        }}
                      />
                    ),
                  )}
                </div>

                {errors.timeline && (
                  <span
                    className={
                      styles.errorMessage
                    }
                  >
                    {errors.timeline}
                  </span>
                )}
              </fieldset>

              <label className={styles.field}>
                <span
                  className={styles.fieldLabel}
                >
                  Specific launch date
                  <small>Optional</small>
                </span>

                <input
                  type="date"
                  value={launchDate}
                  onChange={(event) => {
                    setLaunchDate(
                      event.target.value,
                    );
                  }}
                />

                <small
                  className={styles.fieldHint}
                >
                  Leave this empty when the date is
                  still flexible.
                </small>
              </label>

              <fieldset
                className={styles.fieldset}
              >
                <legend>
                  <span
                    className={styles.fieldLabel}
                  >
                    What design material do you
                    already have?
                    <small>Required</small>
                  </span>
                </legend>

                <div
                  className={styles.optionGrid}
                >
                  {designOptions.map(
                    (option) => (
                      <OptionCard
                        key={option.id}
                        option={option}
                        selected={
                          designStatus ===
                          option.id
                        }
                        reducedMotion={
                          prefersReducedMotion
                        }
                        onSelect={() => {
                          setDesignStatus(
                            option.id,
                          );

                          clearError(
                            'designStatus',
                          );
                        }}
                      />
                    ),
                  )}
                </div>

                {errors.designStatus && (
                  <span
                    className={
                      styles.errorMessage
                    }
                  >
                    {errors.designStatus}
                  </span>
                )}
              </fieldset>

              <fieldset
                className={styles.fieldset}
              >
                <legend>
                  <span
                    className={styles.fieldLabel}
                  >
                    How would you like to 
                    work with ShipPilot?
                    <small>Required</small>
                  </span>
                </legend>

                <div
                  className={styles.optionGrid}
                >
                  {ownershipOptions.map(
                    (option) => (
                      <OptionCard
                        key={option.id}
                        option={option}
                        selected={
                          ownership === option.id
                        }
                        reducedMotion={
                          prefersReducedMotion
                        }
                        onSelect={() => {
                          setOwnership(option.id);
                          clearError('ownership');
                        }}
                      />
                    ),
                  )}
                </div>

                {errors.ownership && (
                  <span
                    className={
                      styles.errorMessage
                    }
                  >
                    {errors.ownership}
                  </span>
                )}
              </fieldset>

              <fieldset
                className={styles.fieldset}
              >
                <legend>
                  <span
                    className={styles.fieldLabel}
                  >
                    What support would you prefer
                    after delivery?
                    <small>Required</small>
                  </span>
                </legend>

                <div
                  className={styles.optionGrid}
                >
                  {supportOptions.map(
                    (option) => (
                      <OptionCard
                        key={option.id}
                        option={option}
                        selected={
                          support === option.id
                        }
                        reducedMotion={
                          prefersReducedMotion
                        }
                        onSelect={() => {
                          setSupport(option.id);
                          clearError('support');
                        }}
                      />
                    ),
                  )}
                </div>

                {errors.support && (
                  <span
                    className={
                      styles.errorMessage
                    }
                  >
                    {errors.support}
                  </span>
                )}
              </fieldset>

              <label className={styles.field}>
                <span
                  className={styles.fieldLabel}
                >
                  Additional delivery notes
                  <small>Optional</small>
                </span>

                <textarea
                  value={detailsNotes}
                  rows="5"
                  maxLength="1000"
                  placeholder="Mention deadlines, team availability, technical preferences or any delivery constraints."
                  onChange={(event) => {
                    setDetailsNotes(
                      event.target.value,
                    );
                  }}
                />

                <div
                  className={styles.textareaFooter}
                >
                  <span>
                    Add anything that could affect
                    planning.
                  </span>

                  <span>
                    {detailsNotes.length}/1000
                  </span>
                </div>
              </label>

              <div
                className={styles.formActions}
              >
                <motion.button
                  type="button"
                  className={styles.backButton}
                  onClick={() => {
                    saveDetails();

                    navigate(
                      '/client/projects/new/requirements',
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

                <div
                  className={styles.rightActions}
                >
                  <div
                    className={styles.saveArea}
                  >
                    <button
                      type="button"
                      className={
                        styles.saveButton
                      }
                      onClick={handleSaveDraft}
                    >
                      Save draft
                    </button>

                    {saveMessage && (
                      <span
                        className={
                          styles.saveMessage
                        }
                      >
                        <CheckIcon />
                        {saveMessage}
                      </span>
                    )}
                  </div>

                  <motion.button
                    type="submit"
                    className={
                      styles.continueButton
                    }
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
                    Review project
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

export default ProjectDetailsPage;