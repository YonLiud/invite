import styles from './Textarea.module.scss';

export type TextareaSize = 'sm' | 'md' | 'lg';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  size?: TextareaSize;
  error?: boolean;
  fullWidth?: boolean;
}

export default function Textarea({
  size = 'md',
  error = false,
  className = '',
  ...props
}: TextareaProps) {
  const classNames = [
    styles.textarea,
    styles[`textarea--${size}`],
    error && styles['textarea--error'],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <textarea className={classNames} {...props} />;
}