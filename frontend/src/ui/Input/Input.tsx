import styles from './Input.module.scss';

export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: InputSize;
  error?: boolean;
  fullWidth?: boolean;
}

export default function Input({
  size = 'md',
  error = false,
  className = '',
  ...props
}: InputProps) {
  const classNames = [
    styles.input,
    styles[`input--${size}`],
    error && styles['input--error'],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <input className={classNames} {...props} />;
}