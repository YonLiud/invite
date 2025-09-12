import styles from './Card.module.scss';

export type CardVariant = 'default' | 'accent' | 'compact' | 'minimal';

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  className?: string;
}

export default function Card({
  children,
  variant = 'default',
  className = '',
}: CardProps) {
  const classNames = [
    styles.card,
    variant !== 'default' && styles[`card--${variant}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={classNames}>{children}</div>;
}