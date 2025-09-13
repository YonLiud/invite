import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, MessageCircle } from 'lucide-react';
import { useComments } from '../../hooks/useComments';
import CommentItem from '../CommentItem/CommentItem';
import { CommentForm } from '../CommentForm/CommentForm';
import type { Comment } from '@/types/Comment';
import styles from './CommentModal.module.scss';

interface CommentModalProps {
  postId: number;
  isOpen: boolean;
  onClose: () => void;
}

export const CommentModal: React.FC<CommentModalProps> = ({
  postId,
  isOpen,
  onClose
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { 
    comments, 
    isLoading, 
    error, 
    hasMore, 
    totalComments,
    loadMore, 
    refresh,
    addComment
  } = useComments(postId);

  // Handle escape key and click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Focus management
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const firstFocusable = modalRef.current.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement;
      
      if (firstFocusable) {
        firstFocusable.focus();
      }
    }
  }, [isOpen]);

  const handleCommentAdded = (newComment: Comment) => {
    addComment(newComment);
  };

  const handleLoadMore = () => {
    if (hasMore && !isLoading) {
      loadMore();
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className={styles.backdrop}>
      <div 
        ref={modalRef}
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="comment-modal-title"
      >
        <div className={styles.header}>
          <div className={styles.title}>
            <MessageCircle size={20} />
            <h2 id="comment-modal-title">
              Comments {totalComments > 0 && `(${totalComments})`}
            </h2>
          </div>
          <button
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Close comments"
          >
            <X size={20} />
          </button>
        </div>

        <div className={styles.content}>
          {isLoading ? (
            <div className={styles.loading}>
              <div className={styles.spinner} />
              <p>Loading comments...</p>
            </div>
          ) : error ? (
            <div className={styles.error}>
              <p>Failed to load comments</p>
              <button 
                onClick={() => refresh()}
                className={styles.retryButton}
              >
                Try again
              </button>
            </div>
          ) : (
            <div className={styles.commentsList}>
              {!comments || comments.length === 0 ? (
                <div className={styles.emptyState}>
                  <MessageCircle size={32} />
                  <p>No comments yet</p>
                  <span>Be the first to comment on this post</span>
                </div>
              ) : (
                <>
                  {comments
                    .filter(comment => comment && comment.author) // Filter out comments without author data
                    .map((comment) => (
                    <CommentItem 
                      key={comment.id} 
                      comment={comment}
                    />
                  ))}
                  
                  {hasMore && (
                    <div className={styles.loadMoreContainer}>
                      <button
                        onClick={handleLoadMore}
                        disabled={isLoading}
                        className={styles.loadMoreButton}
                      >
                        {isLoading ? 'Loading...' : 'Load more comments'}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        <CommentForm 
          postId={postId}
          onCommentAdded={handleCommentAdded}
          autoFocus={true}
        />
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};