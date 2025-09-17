import styles from './Spinner.module.scss';

export type SpinnerSize = 'sm' | 'md' | 'lg' | 'inline';

interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
  overlay?: boolean; // ← NEW: show darkened overlay
}

export default function Spinner({
  size = 'md',
  className = '',
  overlay = false,
}: SpinnerProps) {
  const spinner = (
    <div
      className={`${styles.spinner} ${styles[`spinner--${size}`]} ${className}`}
      aria-label="Loading"
    />
  );

  if (overlay) {
    return <div className={styles.overlay}>{spinner}</div>;
  }

  return spinner;
}