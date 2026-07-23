import { Link, NavLink } from 'react-router-dom';

import styles from './PublicLayout.module.css';

const PublicLayout = ({ children }) => {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={`container ${styles.headerInner}`}>
          <Link to="/" className={styles.logo}>
            Buildly
          </Link>

          <nav className={styles.navigation}>
            <NavLink to="/#how-it-works">How it works</NavLink>
            <NavLink to="/#services">Services</NavLink>
            <NavLink to="/#benefits">Why Buildly</NavLink>
          </nav>

          <div className={styles.actions}>
            <Link to="/login" className={styles.login}>
              Log in
            </Link>

            <Link
              to="/client/projects/new"
              className={styles.primaryAction}
            >
              Start your project
            </Link>
          </div>
        </div>
      </header>

      {children}

      <footer className={styles.footer}>
        <div className={`container ${styles.footerInner}`}>
          <div>
            <Link to="/" className={styles.logo}>
              Buildly
            </Link>

            <p>Your Startup Starts Here.</p>
          </div>

          <p>© 2026 Buildly. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;