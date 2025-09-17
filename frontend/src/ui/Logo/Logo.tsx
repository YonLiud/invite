import styles from './Logo.module.scss';

interface LogoProps {
  className?: string;
}

export default function Logo({ className = '' }: LogoProps) {
  return (
    <h1 className={`${styles.logo} ${className}`} aria-label="Invite Social">
      invite
    </h1>
  );
}