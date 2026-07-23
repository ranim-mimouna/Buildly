import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

import Button from '../../components/common/Button/Button';

import styles from './PublicLayout.module.css';

const navigationLinks = [
  {
    label: 'How it works',
    href: '/#how-it-works',
  },
  {
    label: 'Services',
    href: '/#services',
  },
  {
    label: 'Why Buildly',
    href: '/#why-buildly',
  },
];

const MenuIcon = () => {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 7H20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <path
        d="M4 12H20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <path
        d="M4 17H20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

const CloseIcon = () => {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 6L18 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <path
        d="M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

const PublicLayout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 16);
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle('menuOpen', isMenuOpen);

    return () => {
      document.body.classList.remove('menuOpen');
    };
  }, [isMenuOpen]);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className={styles.page}>
      <header
        className={`${styles.header} ${
          isScrolled ? styles.headerScrolled : ''
        }`}
      >
        <div className={`container ${styles.headerInner}`}>
          <Link
            to="/"
            className={styles.logo}
            aria-label="Buildly home"
            onClick={closeMenu}
          >
            <span className={styles.logoMark}>
              <span />
              <span />
              <span />
            </span>

            <span className={styles.logoText}>
              Buildly
            </span>
          </Link>

          <nav
            className={styles.desktopNavigation}
            aria-label="Main navigation"
          >
            {navigationLinks.map(link => (
              <a
                key={link.label}
                href={link.href}
                className={styles.navigationLink}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className={styles.desktopActions}>
            <NavLink
              to="/login"
              className={styles.loginLink}
            >
              Log in
            </NavLink>

            <Button
              to="/client/projects/new"
              variant="primary"
              size="small"
            >
              Start a project
            </Button>
          </div>

          <button
            type="button"
            className={styles.menuButton}
            aria-label={
              isMenuOpen
                ? 'Close navigation menu'
                : 'Open navigation menu'
            }
            aria-expanded={isMenuOpen}
            onClick={() => {
              setIsMenuOpen(currentValue => !currentValue);
            }}
          >
            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

        <div
          className={`${styles.mobileMenu} ${
            isMenuOpen ? styles.mobileMenuOpen : ''
          }`}
        >
          <nav
            className={`container ${styles.mobileNavigation}`}
            aria-label="Mobile navigation"
          >
            {navigationLinks.map((link, index) => (
              <a
                key={link.label}
                href={link.href}
                className={styles.mobileNavigationLink}
                onClick={closeMenu}
                style={{
                  '--item-index': index,
                }}
              >
                <span>{link.label}</span>
                <span>↗</span>
              </a>
            ))}

            <div className={styles.mobileActions}>
              <Button
                to="/login"
                variant="secondary"
                size="large"
                onClick={closeMenu}
              >
                Log in
              </Button>

              <Button
                to="/client/projects/new"
                variant="primary"
                size="large"
                onClick={closeMenu}
              >
                Start a project
              </Button>
            </div>

            <div className={styles.mobileMessage}>
              <span>Have an idea?</span>
              <p>
                Buildly gives you the team to make it real.
              </p>
            </div>
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        {children}
      </main>

      <footer className={styles.footer}>
        <div className={`container ${styles.footerInner}`}>
          <div className={styles.footerBrand}>
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

              <span className={styles.logoText}>
                Buildly
              </span>
            </Link>

            <p>
              Your Startup Starts Here.
            </p>
          </div>

          <div className={styles.footerLinks}>
            <a href="/#how-it-works">How it works</a>
            <a href="/#services">Services</a>
            <a href="/#why-buildly">Why Buildly</a>
            <Link to="/login">Log in</Link>
          </div>

          <p className={styles.copyright}>
            © 2026 Buildly. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;