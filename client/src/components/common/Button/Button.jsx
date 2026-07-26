import { Link } from 'react-router-dom';

import styles from './Button.module.css';

const Button = ({
  children,
  to,
  href,
  variant = 'primary',
  size = 'medium',
  className = '',
  type = 'button',
  ...props
}) => {
  const buttonClassName = [
    styles.button,
    styles[variant],
    styles[size],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (to) {
    return (
      <Link
        to={to}
        className={buttonClassName}
        {...props}
      >
        <span>{children}</span>
      </Link>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        className={buttonClassName}
        {...props}
      >
        <span>{children}</span>
      </a>
    );
  }

  return (
    <button
      type={type}
      className={buttonClassName}
      {...props}
    >
      <span>{children}</span>
    </button>
  );
};

export default Button;