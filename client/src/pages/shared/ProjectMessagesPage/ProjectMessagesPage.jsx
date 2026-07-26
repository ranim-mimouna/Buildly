import { useMemo, useRef, useState } from 'react';
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
import styles from './ProjectMessagesPage.module.css';

const statusLabels = {
  submitted: 'Submitted',
  'in-review': 'In review',
  planning: 'Planning',
  'in-progress': 'Development',
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

const getStoredProjects = () => {
  const value = localStorage.getItem(
    STORAGE_KEYS.PROJECTS,
  );

  if (!value) {
    return [];
  }

  try {
    const projects = JSON.parse(value);

    return Array.isArray(projects)
      ? projects
      : [];
  } catch {
    localStorage.removeItem(STORAGE_KEYS.PROJECTS);

    return [];
  }
};

const getStoredMessages = () => {
  const value = localStorage.getItem(
    STORAGE_KEYS.PROJECT_MESSAGES,
  );

  if (!value) {
    return {};
  }

  try {
    const messages = JSON.parse(value);

    return messages &&
      typeof messages === 'object' &&
      !Array.isArray(messages)
      ? messages
      : {};
  } catch {
    localStorage.removeItem(
      STORAGE_KEYS.PROJECT_MESSAGES,
    );

    return {};
  }
};

const formatTime = value => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat('en', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const formatDateLabel = value => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Recently';
  }

  const today = new Date();
  const yesterday = new Date();

  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (firstDate, secondDate) =>
    firstDate.getFullYear() ===
      secondDate.getFullYear() &&
    firstDate.getMonth() ===
      secondDate.getMonth() &&
    firstDate.getDate() ===
      secondDate.getDate();

  if (isSameDay(date, today)) {
    return 'Today';
  }

  if (isSameDay(date, yesterday)) {
    return 'Yesterday';
  }

  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

const createInitialMessages = (
  project,
  clientName,
) => {
  const createdAt =
    project.createdAt ??
    new Date().toISOString();

  return [
    {
      id: `system-${project.id}`,
      type: 'system',
      text: 'Project conversation created',
      createdAt,
    },
    {
      id: `welcome-${project.id}`,
      type: 'message',
      senderRole: 'team',
      senderName: 'ShipPilot Team',
      senderInitials: 'BT',
      text: `Hi ${clientName}, your project request has been received. This conversation is where we will share questions, progress updates and important decisions.`,
      createdAt,
    },
  ];
};

const groupMessagesByDate = messages => {
  return messages.reduce((groups, message) => {
    const label = formatDateLabel(
      message.createdAt,
    );

    if (!groups[label]) {
      groups[label] = [];
    }

    groups[label].push(message);

    return groups;
  }, {});
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

const SendIcon = () => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 11.5L21 3L14.5 21L11 13L3 11.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      <path
        d="M11 13L21 3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
};

const PaperclipIcon = () => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M8 12.5L14.8 5.7C16.4 4.1 19 4.1 20.6 5.7C22.2 7.3 22.2 9.9 20.6 11.5L11.2 20.9C8.8 23.3 4.9 23.3 2.5 20.9C0.1 18.5 0.1 14.6 2.5 12.2L11.2 3.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
};

const SmileIcon = () => {
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
        r="9"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <circle
        cx="9"
        cy="10"
        r="1"
        fill="currentColor"
      />

      <circle
        cx="15"
        cy="10"
        r="1"
        fill="currentColor"
      />

      <path
        d="M8.5 14C9.3 15.5 10.5 16.2 12 16.2C13.5 16.2 14.7 15.5 15.5 14"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
};

const MoreIcon = () => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="5"
        cy="12"
        r="1.5"
        fill="currentColor"
      />

      <circle
        cx="12"
        cy="12"
        r="1.5"
        fill="currentColor"
      />

      <circle
        cx="19"
        cy="12"
        r="1.5"
        fill="currentColor"
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

const MessageIcon = () => {
  return (
    <svg
      width="19"
      height="19"
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
      width="19"
      height="19"
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

const InfoIcon = () => {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M12 11V16"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      <circle
        cx="12"
        cy="8"
        r="1"
        fill="currentColor"
      />
    </svg>
  );
};

const ProjectMessagesPage = ({
  role = 'client',
}) => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const prefersReducedMotion =
    useReducedMotion();

  const messageListRef = useRef(null);

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

  const clientName =
    project?.clientName ??
    project?.client?.name ??
    'Ranim Mimouna';

  const initialMessages = useMemo(() => {
    if (!project) {
      return [];
    }

    const storedMessages =
      getStoredMessages();

    return storedMessages[project.id] ??
      createInitialMessages(
        project,
        clientName,
      );
  }, [clientName, project]);

  const [messages, setMessages] =
    useState(initialMessages);

  const [messageValue, setMessageValue] =
    useState('');

  const [searchValue, setSearchValue] =
    useState('');

  const [isInfoOpen, setIsInfoOpen] =
    useState(true);

  const [isMobileMenuOpen, setIsMobileMenuOpen] =
    useState(false);

  const [showSentMessage, setShowSentMessage] =
    useState(false);

  if (!project) {
    return (
      <Navigate
        to={
          role === 'team'
            ? '/team/dashboard'
            : '/client/dashboard'
        }
        replace
      />
    );
  }

  const currentUser =
    role === 'team'
      ? {
          name: 'ShipPilot Team',
          initials: 'BT',
        }
      : {
          name: clientName,
          initials: clientName
            .split(' ')
            .map(name => name[0])
            .join('')
            .slice(0, 2),
        };

  const projectBasePath =
    role === 'team'
      ? `/team/projects/${project.id}`
      : `/client/projects/${project.id}`;

  const dashboardPath =
    role === 'team'
      ? '/team/dashboard'
      : '/client/dashboard';

  const filteredMessages = messages.filter(
    message =>
      !searchValue.trim() ||
      message.text
        ?.toLowerCase()
        .includes(
          searchValue
            .trim()
            .toLowerCase(),
        ),
  );

  const groupedMessages =
    groupMessagesByDate(filteredMessages);

  const persistMessages = nextMessages => {
    const storedMessages =
      getStoredMessages();

    const nextStorage = {
      ...storedMessages,
      [project.id]: nextMessages,
    };

    localStorage.setItem(
      STORAGE_KEYS.PROJECT_MESSAGES,
      JSON.stringify(nextStorage),
    );
  };

  const scrollToBottom = () => {
    window.requestAnimationFrame(() => {
      messageListRef.current?.scrollTo({
        top:
          messageListRef.current
            .scrollHeight,
        behavior: prefersReducedMotion
          ? 'auto'
          : 'smooth',
      });
    });
  };

  const handleSubmit = event => {
    event.preventDefault();

    const trimmedMessage =
      messageValue.trim();

    if (!trimmedMessage) {
      return;
    }

    const newMessage = {
      id: `message-${Date.now()}`,
      type: 'message',
      senderRole: role,
      senderName: currentUser.name,
      senderInitials:
        currentUser.initials,
      text: trimmedMessage,
      createdAt:
        new Date().toISOString(),
    };

    const nextMessages = [
      ...messages,
      newMessage,
    ];

    setMessages(nextMessages);
    setMessageValue('');
    persistMessages(nextMessages);
    setShowSentMessage(true);
    scrollToBottom();

    window.setTimeout(() => {
      setShowSentMessage(false);
    }, 1800);
  };

  const addEmoji = emoji => {
    setMessageValue(
      currentValue =>
        `${currentValue}${emoji}`,
    );
  };

  return (
    <main
      className={`${styles.page} ${
        role === 'team'
          ? styles.teamPage
          : styles.clientPage
      }`}
    >
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.button
            type="button"
            className={styles.mobileOverlay}
            aria-label="Close project navigation"
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
              setIsMobileMenuOpen(false)
            }
          />
        )}
      </AnimatePresence>

      <motion.aside
        className={`${styles.sidebar} ${
          isMobileMenuOpen
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
              setIsMobileMenuOpen(false)
            }
          >
            <CloseIcon />
          </button>
        </div>

        <div className={styles.workspaceBadge}>
          <span>
            {role === 'team'
              ? 'Internal workspace'
              : 'Client workspace'}
          </span>

          <strong>
            {role === 'team'
              ? 'Team collaboration'
              : 'Project collaboration'}
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
            to={projectBasePath}
            className={styles.navigationLink}
          >
            <FolderIcon />
            Project overview
          </Link>

          <Link
            to={`${projectBasePath}/messages`}
            className={`${styles.navigationLink} ${styles.navigationLinkActive}`}
          >
            <MessageIcon />
            Messages

            <span className={styles.unreadBadge}>
              {messages.filter(
                message =>
                  message.type ===
                    'message' &&
                  message.senderRole !==
                    role,
              ).length}
            </span>
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
            <span
              className={
                styles.projectStatusDot
              }
            />

            {statusLabels[
              project.status
            ] ?? 'Submitted'}
          </div>
        </div>

        <div className={styles.sidebarBottom}>
          <div className={styles.profile}>
            <span>
              {currentUser.initials}
            </span>

            <div>
              <strong>
                {currentUser.name}
              </strong>

              <small>
                {role === 'team'
                  ? 'ShipPilot workspace'
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
                setIsMobileMenuOpen(true)
              }
            >
              <MenuIcon />
            </button>

            <button
              type="button"
              className={styles.backButton}
              onClick={() =>
                navigate(projectBasePath)
              }
            >
              <ArrowIcon direction="left" />
              Back to project
            </button>
          </div>

          <div className={styles.topbarActions}>
            <AnimatePresence>
              {showSentMessage && (
                <motion.span
                  className={styles.sentMessage}
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
                  Message sent
                </motion.span>
              )}
            </AnimatePresence>

            <button
              type="button"
              className={styles.infoButton}
              aria-label="Toggle project details"
              aria-expanded={isInfoOpen}
              onClick={() =>
                setIsInfoOpen(
                  currentValue =>
                    !currentValue,
                )
              }
            >
              <InfoIcon />
            </button>
          </div>
        </header>

        <div
          className={`${styles.workspace} ${
            !isInfoOpen
              ? styles.workspaceWithoutInfo
              : ''
          }`}
        >
          <section
            className={
              styles.conversationPanel
            }
          >
            <header
              className={
                styles.conversationHeader
              }
            >
              <div>
                <span
                  className={
                    styles.conversationIcon
                  }
                >
                  <MessageIcon />
                </span>

                <div>
                  <h1>Project conversation</h1>

                  <p>
                    {project.title}
                  </p>
                </div>
              </div>

              <div className={styles.search}>
                <SearchIcon />

                <input
                  type="search"
                  value={searchValue}
                  placeholder="Search messages"
                  aria-label="Search messages"
                  onChange={event =>
                    setSearchValue(
                      event.target.value,
                    )
                  }
                />
              </div>
            </header>

            <div
              ref={messageListRef}
              className={styles.messageList}
            >
              {Object.entries(
                groupedMessages,
              ).map(
                ([dateLabel, dateMessages]) => (
                  <section
                    key={dateLabel}
                    className={
                      styles.messageGroup
                    }
                  >
                    <div
                      className={
                        styles.dateDivider
                      }
                    >
                      <span>{dateLabel}</span>
                    </div>

                    {dateMessages.map(
                      message => {
                        if (
                          message.type ===
                          'system'
                        ) {
                          return (
                            <div
                              key={message.id}
                              className={
                                styles.systemMessage
                              }
                            >
                              <span>
                                <CheckIcon />
                              </span>

                              {message.text}
                            </div>
                          );
                        }

                        const isOwnMessage =
                          message.senderRole ===
                          role;

                        return (
                          <motion.article
                            key={message.id}
                            className={`${styles.message} ${
                              isOwnMessage
                                ? styles.ownMessage
                                : styles.otherMessage
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
                          >
                            {!isOwnMessage && (
                              <span
                                className={
                                  styles.messageAvatar
                                }
                              >
                                {
                                  message.senderInitials
                                }
                              </span>
                            )}

                            <div
                              className={
                                styles.messageContent
                              }
                            >
                              <div
                                className={
                                  styles.messageMeta
                                }
                              >
                                <strong>
                                  {
                                    message.senderName
                                  }
                                </strong>

                                <time>
                                  {formatTime(
                                    message.createdAt,
                                  )}
                                </time>
                              </div>

                              <div
                                className={
                                  styles.messageBubble
                                }
                              >
                                <p>
                                  {message.text}
                                </p>
                              </div>

                              {isOwnMessage && (
                                <span
                                  className={
                                    styles.deliveryStatus
                                  }
                                >
                                  <CheckIcon />
                                  Saved
                                </span>
                              )}
                            </div>
                          </motion.article>
                        );
                      },
                    )}
                  </section>
                ),
              )}

              {filteredMessages.length ===
                0 && (
                <div
                  className={
                    styles.noSearchResults
                  }
                >
                  <SearchIcon />

                  <h2>No messages found</h2>

                  <p>
                    Try another search term.
                  </p>
                </div>
              )}
            </div>

            <form
              className={styles.composer}
              onSubmit={handleSubmit}
            >
              <div
                className={
                  styles.composerToolbar
                }
              >
                <button
                  type="button"
                  aria-label="Attach a file"
                  title="File uploads will be added later"
                >
                  <PaperclipIcon />
                </button>

                <div
                  className={
                    styles.emojiActions
                  }
                >
                  <button
                    type="button"
                    onClick={() =>
                      addEmoji('👍')
                    }
                  >
                    👍
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      addEmoji('✅')
                    }
                  >
                    ✅
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      addEmoji('🎉')
                    }
                  >
                    🎉
                  </button>

                  <button
                    type="button"
                    aria-label="Add emoji"
                    onClick={() =>
                      addEmoji('🙂')
                    }
                  >
                    <SmileIcon />
                  </button>
                </div>
              </div>

              <textarea
                value={messageValue}
                rows="3"
                maxLength="2000"
                placeholder={
                  role === 'team'
                    ? 'Write an update or ask the client a question...'
                    : 'Write a message to the ShipPilot team...'
                }
                onChange={event =>
                  setMessageValue(
                    event.target.value,
                  )
                }
                onKeyDown={event => {
                  if (
                    event.key === 'Enter' &&
                    !event.shiftKey
                  ) {
                    event.preventDefault();

                    handleSubmit(event);
                  }
                }}
              />

              <div
                className={
                  styles.composerFooter
                }
              >
                <span>
                  Enter to send · Shift + Enter
                  for a new line
                </span>

                <div>
                  <span>
                    {messageValue.length}/2000
                  </span>

                  <button
                    type="submit"
                    disabled={
                      !messageValue.trim()
                    }
                  >
                    Send message
                    <SendIcon />
                  </button>
                </div>
              </div>
            </form>
          </section>

          <AnimatePresence>
            {isInfoOpen && (
              <motion.aside
                className={styles.infoPanel}
                initial={{
                  opacity: 0,
                  x: prefersReducedMotion
                    ? 0
                    : 18,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  x: prefersReducedMotion
                    ? 0
                    : 18,
                }}
              >
                <header>
                  <div>
                    <span>Project details</span>
                    <h2>{project.title}</h2>
                  </div>

                  <button
                    type="button"
                    aria-label="Close project details"
                    onClick={() =>
                      setIsInfoOpen(false)
                    }
                  >
                    <CloseIcon />
                  </button>
                </header>

                <div
                  className={
                    styles.infoProjectStatus
                  }
                >
                  <span>
                    <span />
                    {statusLabels[
                      project.status
                    ] ?? 'Submitted'}
                  </span>

                  <Link to={projectBasePath}>
                    Open workspace
                    <ArrowIcon />
                  </Link>
                </div>

                <div className={styles.infoSection}>
                  <span>Client</span>

                  <div
                    className={
                      styles.clientIdentity
                    }
                  >
                    <span>
                      {clientName
                        .split(' ')
                        .map(name => name[0])
                        .join('')
                        .slice(0, 2)}
                    </span>

                    <div>
                      <strong>
                        {clientName}
                      </strong>

                      <small>
                        Project owner
                      </small>
                    </div>
                  </div>
                </div>

                <div className={styles.infoSection}>
                  <span>Project summary</span>

                  <p>
                    {project.description}
                  </p>
                </div>

                <div className={styles.infoSection}>
                  <span>Details</span>

                  <div
                    className={
                      styles.detailRows
                    }
                  >
                    <div>
                      <span>Category</span>
                      <strong>
                        {categoryLabels[
                          project.category
                        ] ??
                          'Digital product'}
                      </strong>
                    </div>

                    <div>
                      <span>Status</span>
                      <strong>
                        {statusLabels[
                          project.status
                        ] ?? 'Submitted'}
                      </strong>
                    </div>

                    <div>
                      <span>Messages</span>
                      <strong>
                        {
                          messages.filter(
                            message =>
                              message.type ===
                              'message',
                          ).length
                        }
                      </strong>
                    </div>
                  </div>
                </div>

                <div className={styles.infoSection}>
                  <span>Participants</span>

                  <div
                    className={
                      styles.participants
                    }
                  >
                    <div>
                      <span>
                        {clientName
                          .split(' ')
                          .map(name => name[0])
                          .join('')
                          .slice(0, 2)}
                      </span>

                      <div>
                        <strong>
                          {clientName}
                        </strong>
                        <small>Client</small>
                      </div>
                    </div>

                    <div>
                      <span>BT</span>

                      <div>
                        <strong>
                          ShipPilot Team
                        </strong>
                        <small>
                          Product team
                        </small>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className={
                    styles.infoMoreButton
                  }
                >
                  <MoreIcon />
                  Conversation options
                </button>
              </motion.aside>
            )}
          </AnimatePresence>
        </div>
      </section>
    </main>
  );
};

export default ProjectMessagesPage;