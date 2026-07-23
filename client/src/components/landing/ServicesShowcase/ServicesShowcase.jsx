import { useRef } from 'react';

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react';

import styles from './ServicesShowcase.module.css';

const services = [
  {
    id: 'web-apps',
    number: '01',
    label: 'Web applications',
    title: 'Powerful products built for the browser.',
    description:
      'From customer platforms to complex operational systems, we create responsive web applications that are fast, scalable and easy to use.',
    features: [
      'Responsive user experience',
      'Secure authentication',
      'Dashboards and analytics',
      'Third-party integrations',
    ],
    visual: 'dashboard',
  },
  {
    id: 'mobile-apps',
    number: '02',
    label: 'Mobile applications',
    title: 'Mobile experiences people enjoy using.',
    description:
      'Launch polished mobile products for iOS and Android with thoughtful interactions, clear navigation and reliable performance.',
    features: [
      'iOS and Android',
      'Push notifications',
      'User profiles',
      'Mobile-first workflows',
    ],
    visual: 'mobile',
  },
  {
    id: 'saas-platforms',
    number: '03',
    label: 'SaaS platforms',
    title: 'Turn your service into a scalable platform.',
    description:
      'We build subscription-based products with onboarding, billing, permissions and the tools needed to serve multiple customers.',
    features: [
      'Subscription management',
      'Role-based access',
      'Customer workspaces',
      'Usage analytics',
    ],
    visual: 'saas',
  },
  {
    id: 'internal-tools',
    number: '04',
    label: 'Internal tools',
    title: 'Replace repetitive work with better systems.',
    description:
      'Give your team a custom workspace that connects information, automates processes and makes daily operations easier.',
    features: [
      'Workflow automation',
      'Team dashboards',
      'Data management',
      'Approval processes',
    ],
    visual: 'workflow',
  },
  {
    id: 'marketplaces',
    number: '05',
    label: 'Marketplaces',
    title: 'Connect people, services and opportunities.',
    description:
      'We create multi-sided platforms with listings, search, payments, communication and management tools for every user type.',
    features: [
      'Listings and discovery',
      'Bookings or orders',
      'Payments and payouts',
      'Reviews and messaging',
    ],
    visual: 'marketplace',
  },
  {
    id: 'ai-features',
    number: '06',
    label: 'AI-powered features',
    title: 'Use AI where it creates real value.',
    description:
      'Add intelligent assistance, automation and analysis to your product without replacing the human experience that makes it valuable.',
    features: [
      'Smart recommendations',
      'Content assistance',
      'Document analysis',
      'Workflow automation',
    ],
    visual: 'ai',
  },
];

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
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 12.5L9.2 16.5L19 7"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const SparkIcon = () => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5L12 3Z"
        fill="currentColor"
      />

      <path
        d="M19 15L19.7 17.3L22 18L19.7 18.7L19 21L18.3 18.7L16 18L18.3 17.3L19 15Z"
        fill="currentColor"
      />
    </svg>
  );
};

const DashboardVisual = () => {
  return (
    <div className={styles.dashboardVisual}>
      <div className={styles.previewSidebar}>
        <span className={styles.previewLogo}>B</span>

        <div className={styles.previewNavigation}>
          <span className={styles.activeNavigationItem} />
          <span />
          <span />
          <span />
        </div>
      </div>

      <div className={styles.dashboardContent}>
        <div className={styles.previewHeader}>
          <div>
            <span>Business overview</span>
            <strong>Good morning, Sarah</strong>
          </div>

          <span className={styles.previewAvatar}>SM</span>
        </div>

        <div className={styles.dashboardStats}>
          <div>
            <span>Revenue</span>
            <strong>$24,850</strong>
            <small>+12.8%</small>
          </div>

          <div>
            <span>Active users</span>
            <strong>1,284</strong>
            <small>+8.4%</small>
          </div>

          <div>
            <span>Conversion</span>
            <strong>7.6%</strong>
            <small>+2.1%</small>
          </div>
        </div>

        <div className={styles.chartPanel}>
          <div className={styles.chartHeader}>
            <div>
              <span>Performance</span>
              <strong>Monthly growth</strong>
            </div>

            <span>Last 6 months</span>
          </div>

          <div className={styles.chartBars}>
            {[42, 55, 48, 68, 74, 88, 79, 94].map((height, index) => (
              <motion.span
                key={`${height}-${index}`}
                initial={{ height: 0 }}
                whileInView={{ height: `${height}%` }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.55,
                  delay: index * 0.05,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const MobileVisual = () => {
  return (
    <div className={styles.mobileVisual}>
      <div className={styles.phoneFrame}>
        <div className={styles.phoneSpeaker} />

        <div className={styles.phoneScreen}>
          <div className={styles.mobileHeader}>
            <div>
              <span>Welcome back</span>
              <strong>Maya</strong>
            </div>

            <span>MN</span>
          </div>

          <div className={styles.mobileBalance}>
            <span>Available balance</span>
            <strong>$8,240.50</strong>

            <div>
              <span>Send</span>
              <span>Request</span>
              <span>History</span>
            </div>
          </div>

          <div className={styles.mobileActivity}>
            <div className={styles.mobileSectionTitle}>
              <strong>Recent activity</strong>
              <span>View all</span>
            </div>

            {['Adobe', 'Spotify', 'Transfer received'].map(
              (item, index) => (
                <div key={item} className={styles.mobileActivityItem}>
                  <span>{item.charAt(0)}</span>

                  <div>
                    <strong>{item}</strong>
                    <small>
                      {index === 2 ? 'Today' : 'Yesterday'}
                    </small>
                  </div>

                  <strong>
                    {index === 2 ? '+$420' : '-$19'}
                  </strong>
                </div>
              ),
            )}
          </div>
        </div>
      </div>

      <div className={styles.mobileFloatingCard}>
        <span>
          <CheckIcon />
        </span>

        <div>
          <strong>Payment received</strong>
          <small>Your balance was updated.</small>
        </div>
      </div>
    </div>
  );
};

const SaasVisual = () => {
  return (
    <div className={styles.saasVisual}>
      <div className={styles.saasHeader}>
        <div>
          <span>Workspace settings</span>
          <strong>Team & billing</strong>
        </div>

        <button type="button" tabIndex="-1">
          Invite member
        </button>
      </div>

      <div className={styles.saasGrid}>
        <div className={styles.saasPlan}>
          <span>Current plan</span>
          <strong>Growth</strong>
          <p>For growing teams that need more control.</p>

          <div className={styles.saasPrice}>
            <strong>$49</strong>
            <span>/ month</span>
          </div>

          <div className={styles.saasUsage}>
            <div>
              <span>Team members</span>
              <strong>8 / 12</strong>
            </div>

            <div>
              <span>Storage used</span>
              <strong>62%</strong>
            </div>
          </div>
        </div>

        <div className={styles.saasMembers}>
          <div className={styles.saasMembersHeader}>
            <strong>Team members</strong>
            <span>8 active</span>
          </div>

          {[
            ['AM', 'Anna Meyer', 'Owner'],
            ['JS', 'Jonas Schmidt', 'Admin'],
            ['LK', 'Laura Kim', 'Member'],
          ].map(member => (
            <div key={member[1]} className={styles.saasMember}>
              <span>{member[0]}</span>

              <div>
                <strong>{member[1]}</strong>
                <small>{member[2]}</small>
              </div>

              <span className={styles.memberStatus}>Active</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const WorkflowVisual = () => {
  return (
    <div className={styles.workflowVisual}>
      <div className={styles.workflowHeader}>
        <div>
          <span>Automation builder</span>
          <strong>New customer onboarding</strong>
        </div>

        <span className={styles.activeWorkflow}>
          <span />
          Active
        </span>
      </div>

      <div className={styles.workflowCanvas}>
        <div className={styles.workflowNode}>
          <span className={styles.triggerIcon}>01</span>

          <div>
            <small>Trigger</small>
            <strong>New customer created</strong>
          </div>
        </div>

        <span className={styles.workflowConnection} />

        <div className={styles.workflowNode}>
          <span className={styles.actionIcon}>02</span>

          <div>
            <small>Action</small>
            <strong>Send welcome email</strong>
          </div>
        </div>

        <span className={styles.workflowConnection} />

        <div className={styles.workflowNode}>
          <span className={styles.delayIcon}>03</span>

          <div>
            <small>Wait</small>
            <strong>Delay for 2 days</strong>
          </div>
        </div>

        <span className={styles.workflowConnection} />

        <div className={styles.workflowNode}>
          <span className={styles.completeIcon}>
            <CheckIcon />
          </span>

          <div>
            <small>Complete</small>
            <strong>Create follow-up task</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

const MarketplaceVisual = () => {
  const listings = [
    {
      title: 'Modern studio workspace',
      location: 'Berlin, Germany',
      price: '$38/day',
    },
    {
      title: 'Creative meeting room',
      location: 'Hamburg, Germany',
      price: '$52/day',
    },
    {
      title: 'Bright private office',
      location: 'Munich, Germany',
      price: '$65/day',
    },
  ];

  return (
    <div className={styles.marketplaceVisual}>
      <div className={styles.marketplaceHeader}>
        <div>
          <span>Discover spaces</span>
          <strong>Find your next workspace</strong>
        </div>

        <div className={styles.marketplaceSearch}>
          <span>Berlin</span>
          <span>2 guests</span>
          <button type="button" tabIndex="-1">
            Search
          </button>
        </div>
      </div>

      <div className={styles.listingGrid}>
        {listings.map((listing, index) => (
          <div key={listing.title} className={styles.listingCard}>
            <div
              className={`${styles.listingImage} ${
                styles[`listingImage${index + 1}`]
              }`}
            >
              <span>♡</span>
            </div>

            <div className={styles.listingCopy}>
              <span>{listing.location}</span>
              <strong>{listing.title}</strong>

              <div>
                <span>★ 4.{9 - index}</span>
                <strong>{listing.price}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AiVisual = () => {
  return (
    <div className={styles.aiVisual}>
      <div className={styles.aiSidebar}>
        <span className={styles.aiLogo}>
          <SparkIcon />
        </span>

        <div>
          <span />
          <span />
          <span />
        </div>
      </div>

      <div className={styles.aiContent}>
        <div className={styles.aiHeader}>
          <div>
            <span>Buildly intelligence</span>
            <strong>Project assistant</strong>
          </div>

          <span className={styles.aiOnline}>
            <span />
            Online
          </span>
        </div>

        <div className={styles.aiConversation}>
          <div className={styles.userMessage}>
            Create a launch plan for our new booking platform.
          </div>

          <motion.div
            className={styles.aiMessage}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <span>
              <SparkIcon />
            </span>

            <div>
              <p>
                I created a four-phase launch plan based on your
                current project scope.
              </p>

              <div className={styles.aiPlan}>
                {[
                  ['01', 'Prepare beta release', 'Week 1'],
                  ['02', 'Invite pilot customers', 'Week 2'],
                  ['03', 'Collect feedback', 'Week 3'],
                  ['04', 'Public launch', 'Week 4'],
                ].map(item => (
                  <div key={item[0]}>
                    <span>{item[0]}</span>

                    <strong>{item[1]}</strong>

                    <small>{item[2]}</small>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <div className={styles.aiInput}>
          <span>Ask Buildly anything about your project...</span>

          <button type="button" tabIndex="-1">
            <ArrowIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

const ServiceVisual = ({ type }) => {
  if (type === 'dashboard') {
    return <DashboardVisual />;
  }

  if (type === 'mobile') {
    return <MobileVisual />;
  }

  if (type === 'saas') {
    return <SaasVisual />;
  }

  if (type === 'workflow') {
    return <WorkflowVisual />;
  }

  if (type === 'marketplace') {
    return <MarketplaceVisual />;
  }

  return <AiVisual />;
};

const ServiceCard = ({ service, index }) => {
  return (
    <article className={styles.serviceCard}>
      <div className={styles.cardCopy}>
        <div className={styles.cardTop}>
          <span className={styles.cardNumber}>
            {service.number}
          </span>

          <span className={styles.cardLabel}>
            {service.label}
          </span>
        </div>

        <div>
          <h3>{service.title}</h3>

          <p>{service.description}</p>
        </div>

        <div className={styles.featureList}>
          {service.features.map(feature => (
            <div key={feature}>
              <span>
                <CheckIcon />
              </span>

              <strong>{feature}</strong>
            </div>
          ))}
        </div>

        <div className={styles.cardFooter}>
          <span>
            Custom-built for your product
          </span>

          <span className={styles.cardArrow}>
            <ArrowIcon />
          </span>
        </div>
      </div>

      <motion.div
        className={styles.cardVisual}
        initial={{
          opacity: 0,
          scale: 0.96,
          y: 20,
        }}
        whileInView={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        viewport={{
          once: true,
          amount: 0.35,
        }}
        transition={{
          duration: 0.65,
          delay: index * 0.03,
        }}
      >
        <ServiceVisual type={service.visual} />
      </motion.div>
    </article>
  );
};

const ServicesShowcase = () => {
  const sectionRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const horizontalPosition = useTransform(
    scrollYProgress,
    [0, 1],
    ['0%', '-83.5%'],
  );

  return (
    <section
      id="services"
      ref={sectionRef}
      className={styles.section}
    >
      <div className={styles.desktopExperience}>
        <div className={styles.stickyContainer}>
          <div className={styles.background} aria-hidden="true">
            <div className={styles.backgroundGrid} />
            <div className={styles.backgroundGlow} />
          </div>

          <div className={`container ${styles.headerContainer}`}>
            <motion.header
              className={styles.sectionHeader}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{
                once: true,
                amount: 0.5,
              }}
              transition={{
                duration: 0.6,
              }}
            >
              <div>
                <span className={styles.eyebrow}>
                  What we build
                </span>

                <h2>
                  Your idea can become{' '}
                  <span>something real.</span>
                </h2>
              </div>

              <p>
                Buildly brings together product strategy,
                design, engineering and AI-assisted delivery
                to create digital products shaped around your
                business.
              </p>
            </motion.header>
          </div>

          <div className={styles.horizontalViewport}>
            <motion.div
              className={styles.horizontalTrack}
              style={{
                x: prefersReducedMotion
                  ? '0%'
                  : horizontalPosition,
              }}
            >
              {services.map((service, index) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  index={index}
                />
              ))}
            </motion.div>
          </div>

          <div className={`container ${styles.progressContainer}`}>
            <div className={styles.scrollHint}>
              <span>Scroll to explore</span>

              <ArrowIcon />
            </div>

            <div className={styles.progressTrack}>
              <motion.span
                style={{
                  scaleX: scrollYProgress,
                }}
              />
            </div>

            <span className={styles.progressCount}>
              06 services
            </span>
          </div>
        </div>
      </div>

      <div className={styles.mobileExperience}>
        <div className={`container ${styles.mobileContainer}`}>
          <header className={styles.mobileHeader}>
            <span className={styles.eyebrow}>
              What we build
            </span>

            <h2>
              Your idea can become{' '}
              <span>something real.</span>
            </h2>

            <p>
              Buildly brings together product strategy,
              design, engineering and AI-assisted delivery to
              create digital products shaped around your
              business.
            </p>
          </header>

          <div className={styles.mobileCards}>
            {services.map((service, index) => (
              <ServiceCard
                key={service.id}
                service={service}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesShowcase;