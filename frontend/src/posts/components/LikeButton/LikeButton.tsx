import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import styles from './LikeButton.module.scss';

export interface LikeButtonProps {
  isLiked?: boolean;
  likesCount?: number;
  onLike?: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  className?: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({
  isLiked = false,
  likesCount = 0,
  onLike,
  disabled = false,
  size = 'md',
  showCount = true,
  className = ''
}) => {
  const [localIsLiked, setLocalIsLiked] = useState(isLiked);
  const [localCount, setLocalCount] = useState(likesCount);
  const [isAnimating, setIsAnimating] = useState(false);

  // Sync with external state
  useEffect(() => {
    setLocalIsLiked(isLiked);
  }, [isLiked]);

  useEffect(() => {
    setLocalCount(likesCount);
  }, [likesCount]);

  const handleClick = () => {
    if (disabled) return;

    // Optimistic update
    const newLikedState = !localIsLiked;
    setLocalIsLiked(newLikedState);
    setLocalCount(prev => newLikedState ? prev + 1 : Math.max(0, prev - 1));
    
    // Trigger animation
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);

    // Call parent handler
    onLike?.();
  };

  const iconSize = {
    sm: 16,
    md: 18,
    lg: 20
  }[size];

  const buttonClasses = [
    styles.likeButton,
    styles[size],
    localIsLiked && styles.liked,
    isAnimating && styles.animating,
    disabled && styles.disabled,
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled}
      aria-label={localIsLiked ? 'Unlike' : 'Like'}
      aria-pressed={localIsLiked}
    >
      <div className={styles.iconContainer}>
        <Heart 
          size={iconSize} 
          fill={localIsLiked ? 'currentColor' : 'none'}
          className={styles.heartIcon}
        />
        {isAnimating && (
          <>
            <div className={styles.ripple} />
            <div className={styles.burst}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className={styles.particle} style={{ '--angle': `${i * 60}deg` } as React.CSSProperties} />
              ))}
            </div>
          </>
        )}
      </div>
      
      {showCount && localCount > 0 && (
        <span className={styles.count}>
          {localCount}
        </span>
      )}
    </button>
  );
};

export default LikeButton;