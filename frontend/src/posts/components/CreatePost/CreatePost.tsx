import React, { useState, useRef, useEffect } from 'react';
import { Send, Image, Smile } from 'lucide-react';
import Card from '@/ui/Card/Card';
import Button from '@/ui/Button/Button';
import ProfilePicture from '@/ui/ProfilePicture/ProfilePicture';
import { useCreatePost } from '../../hooks/usePosts';
import type { Post } from '@/types/Post';
import styles from './CreatePost.module.scss';

export interface CreatePostProps {
  onPostCreated?: (post: Post) => void;
  placeholder?: string;
  maxLength?: number;
  className?: string;
  currentUserName?: string;
}

const CreatePost: React.FC<CreatePostProps> = ({
  onPostCreated,
  placeholder = "What's on your mind?",
  maxLength = 1000,
  className = '',
  currentUserName = 'You'
}) => {
  const [content, setContent] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  
  const { createPost, isLoading, error, clearError } = useCreatePost();

  const characterCount = content.length;
  const isOverLimit = characterCount > maxLength;
  const isNearLimit = characterCount > maxLength * 0.8;
  const canSubmit = content.trim().length > 0 && !isOverLimit && !isLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canSubmit) return;

    const trimmedContent = content.trim();
    const newPost = await createPost({ content: trimmedContent });
    
    if (newPost) {
      setContent('');
      setIsFocused(false);
      onPostCreated?.(newPost);
      
      // Optional: Show success feedback
      console.log('Post created successfully!');
    }
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    clearError();
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = (e: React.FocusEvent) => {
    // Only blur if clicking outside the entire form
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      if (!content.trim()) {
        setIsFocused(false);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      if (canSubmit) {
        handleSubmit(e as any);
      }
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    const textArea = textAreaRef.current;
    if (textArea) {
      textArea.style.height = 'auto';
      textArea.style.height = `${textArea.scrollHeight}px`;
    }
  }, [content]);

  const cardClasses = [
    styles.createPost,
    isFocused && styles.focused,
    className
  ].filter(Boolean).join(' ');

  return (
    <Card className={cardClasses}>
      <form onSubmit={handleSubmit} onBlur={handleBlur}>
        <div className={styles.header}>
          <ProfilePicture name={currentUserName} size={isFocused ? 48 : 40} />
          <div className={styles.inputContainer}>
            <textarea
              ref={textAreaRef}
              value={content}
              onChange={handleTextAreaChange}
              onFocus={handleFocus}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className={`${styles.textArea} ${error || isOverLimit ? styles.textAreaError : ''}`}
              disabled={isLoading}
              rows={isFocused ? 3 : 1}
            />
            
            {error && (
              <div className={styles.error}>
                {error}
              </div>
            )}
          </div>
        </div>

        {isFocused && (
          <div className={styles.expandedContent}>
            <div className={styles.toolbar}>
              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.toolbarButton}
                  disabled={isLoading}
                  title="Add image"
                >
                  <Image size={18} />
                </button>
                <button
                  type="button"
                  className={styles.toolbarButton}
                  disabled={isLoading}
                  title="Add emoji"
                >
                  <Smile size={18} />
                </button>
              </div>

              <div className={styles.submitSection}>
                <div className={styles.characterCount}>
                  <span className={isNearLimit ? styles.warning : isOverLimit ? styles.error : ''}>
                    {characterCount}
                  </span>
                  <span className={styles.maxLength}>/{maxLength}</span>
                </div>
                
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={!canSubmit}
                  className={styles.submitButton}
                >
                  {isLoading ? (
                    <>Posting...</>
                  ) : (
                    <>
                      <Send size={16} />
                      Post
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            <div className={styles.hint}>
              <kbd>Ctrl</kbd> + <kbd>Enter</kbd> to post
            </div>
          </div>
        )}
      </form>
    </Card>
  );
};

export default CreatePost;