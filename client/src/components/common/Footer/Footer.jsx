import { Link } from 'react-router-dom';

import styles from './Footer.module.css';

const ArrowIcon = () => {
  return (
    <svg
      width="15"
      height="15"
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

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.container}`}>
        <div className={styles.top}>
          <div className={styles.brandColumn}>
            <Link to="/" className={styles.logo}>
              <span>B</span>
              Buildly
            </Link>

            <p>
              Human-led software development, accelerated by
              responsible AI.
            </p>

            <Link
              to="/client/projects/new"
              className={styles.footerCta}
            >
              Start a project
              <ArrowIcon />
            </Link>
          </div>

          <div className={styles.linksGrid}>
            <div>
              <strong>Product</strong>

              <a href="#how-it-works">How it works</a>
              <a href="#services">Services</a>
              <a href="#why-buildly">Why Buildly</a>
              <Link to="/client/projects/new">
                Start a project
              </Link>
            </div>

            <div>
              <strong>Account</strong>

              <Link to="/login">Log in</Link>
              <Link to="/register">Create account</Link>
              <Link to="/client/dashboard">
                Client dashboard
              </Link>
            </div>

            <div>
              <strong>Company</strong>

              <a href="#about">About</a>
              <a href="#contact">Contact</a>
              <a href="#careers">Careers</a>
            </div>

            <div>
              <strong>Legal</strong>

              <a href="#privacy">Privacy</a>
              <a href="#terms">Terms</a>
              <a href="#cookies">Cookies</a>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <span>
            © {new Date().getFullYear()} Buildly. All rights
            reserved.
          </span>

          <span>
            Built by humans. Accelerated by AI.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;