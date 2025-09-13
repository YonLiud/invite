import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useLikePost } from '../../hooks/useLikes';
import styles from './LikeButton.module.scss';

interface LikeButtonProps {
  postId: number;
  initialLiked?: boolean;
  initialCount?: number;
  onLikeChange?: (postId: number, isLiked: boolean, newCount: number) => void;
  disabled?: boolean;
  className?: string;
}

export const LikeButton: React.FC<LikeButtonProps> = ({
  postId,
  initialLiked = false,
  initialCount = 0,
  onLikeChange,
  disabled = false,
  className = ''
}) => {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(initialCount);
  const [isAnimating, setIsAnimating] = useState(false);
  const { toggleLike, isLoading, error } = useLikePost();

  useEffect(() => {
    setIsLiked(initialLiked);
    setLikesCount(initialCount);
  }, [initialLiked, initialCount]);

  const handleClick = async () => {
    if (disabled || isLoading) return;

    // Optimistic update
    const newLikedState = !isLiked;
    const newCount = newLikedState ? likesCount + 1 : likesCount - 1;
    
    setIsLiked(newLikedState);
    setLikesCount(newCount);
    
    // Trigger animation
    if (newLikedState) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 600);
    }

    // Call the API
    try {
      const actualLikedState = await toggleLike(postId, !newLikedState);
      
      // Update UI with actual state from API
      if (actualLikedState !== newLikedState) {
        setIsLiked(actualLikedState);
        setLikesCount(actualLikedState ? likesCount + 1 : likesCount - 1);
      }
      
      // Notify parent component
      onLikeChange?.(postId, actualLikedState, actualLikedState ? newCount : newCount);
    } catch (err) {
      // Revert optimistic update on error
      setIsLiked(!newLikedState);
      setLikesCount(likesCount);
      console.error('Failed to toggle like:', err);
    }
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