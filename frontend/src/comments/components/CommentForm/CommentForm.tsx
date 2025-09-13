import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import Button from '../../../ui/Button/Button';
import ProfilePicture from '../../../ui/ProfilePicture/ProfilePicture';
import { useAuth } from '../../../auth/AuthProvider';
import { useCreateComment } from '../../hooks/useComments';
import type { Comment } from '@/types/Comment';
import styles from './CommentForm.module.scss';

interface CommentFormProps {
  postId: number;
  onCommentAdded?: (comment: Comment) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export const CommentForm: React.FC<CommentFormProps> = ({
  postId,
  onCommentAdded,
  placeholder = "Write a comment...",
  autoFocus = false
}) => {
  const [text, setText] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { user } = useAuth();
  const { createComment, isLoading: isPending } = useCreateComment();

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    adjustTextareaHeight();
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  };

  const handleFocus = () => {
    setIsExpanded(true);
  };

  const handleBlur = (e: React.FocusEvent<HTMLFormElement>) => {
    // Check if the blur is moving to another element within the form
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      if (!text.trim()) {
        setIsExpanded(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedText = text.trim();
    if (!trimmedText || isPending) {
      return;
    }

    try {
      const newComment = await createComment({
        postId,
        content: trimmedText,
      });
      
      if (newComment) {
        setText('');
        setIsExpanded(false);
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
        }
        onCommentAdded?.(newComment);
      }
    } catch (error) {
      // Error is handled by the hook
      console.error('Failed to create comment:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit(e as any);
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      if (!text.trim()) {
        setIsExpanded(false);
        textareaRef.current?.blur();
      }
    }
  };

  if (!user) {
    return null;
  }

  const canSubmit = text.trim().length > 0 && !isPending;

  return (
    <form 
      className={`${styles.commentForm} ${isExpanded ? styles.expanded : ''}`}
      onSubmit={handleSubmit}
      onBlur={handleBlur}
    >
      <div className={styles.avatar}>
        <ProfilePicture 
          name={user.display_name} 
          size={32}
        />
      </div>
      
      <div className={styles.inputContainer}>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={styles.textarea}
          rows={1}
          disabled={isPending}
          maxLength={500}
        />
        
        {isExpanded && (
          <div className={styles.footer}>
            <div className={styles.info}>
              <span className={styles.charCount}>
                {text.length}/500
              </span>
              <span className={styles.hint}>
                {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'} + Enter to post
              </span>
            </div>
            
            <Button
              type="submit"
              size="sm"
              disabled={!canSubmit}
              className={styles.submitButton}
            >
              <Send size={14} />
              {isPending ? 'Posting...' : 'Post'}
            </Button>
          </div>
        )}
      </div>
    </form>
  );
};