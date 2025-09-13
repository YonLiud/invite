import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import styles from './LikeButton.module.scss';

interface LikeButtonProps {
  postId: number;
  initialLiked?: boolean;
  initialCount?: number;
  onLike?: (postId: number, isLiked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export const LikeButton: React.FC<LikeButtonProps> = ({
  postId,
  initialLiked = false,
  initialCount = 0,
  onLike,
  disabled = false,
  className = ''
}) => {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(initialCount);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsLiked(initialLiked);
    setLikesCount(initialCount);
  }, [initialLiked, initialCount]);

  const handleClick = async () => {
    if (disabled) return;

    // Optimistic update
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikesCount(prev => newLikedState ? prev + 1 : prev - 1);
    
    // Trigger animation
    if (newLikedState) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 600);
    }

    // Call the callback
    onLike?.(postId, newLikedState);
  };

  const buttonClasses = [
    styles.likeButton,
    isLiked ? styles.liked : '',
    isAnimating ? styles.animating : '',
    disabled ? styles.disabled : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled}
      aria-label={isLiked ? 'Unlike post' : 'Like post'}
    >
      <div className={styles.iconContainer}>
        <Heart 
          size={18} 
          fill={isLiked ? 'currentColor' : 'none'} 
          className={styles.heartIcon}
        />
        {isAnimating && (
          <>
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={styles.particle}
                style={{
                  '--delay': `${i * 0.1}s`,
                  '--angle': `${i * 60}deg`
                } as React.CSSProperties}
              />
            ))}
          </>
        )}
      </div>
      {likesCount > 0 && (
        <span className={styles.count}>{likesCount}</span>
      )}
    </button>
  );
};

export default LikeButton;