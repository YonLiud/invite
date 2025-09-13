import React, { useCallback } from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';
import PostCard from '../PostCard';
import Button from '@/ui/Button/Button';
import Spinner from '@/ui/Spinner/Spinner';
import { usePosts } from '../../hooks/usePosts';
import type { Post } from '@/types/Post';
import styles from './PostFeed.module.scss';

export interface PostFeedProps {
  onPostEdit?: (post: Post) => void;
  onPostDelete?: (postId: number) => void;
  currentUserId?: number;
  className?: string;
  limit?: number;
}

const PostFeed: React.FC<PostFeedProps> = ({
  onPostEdit,
  onPostDelete,
  currentUserId,
  className = '',
  limit = 20
}) => {
  const {
    posts,
    pagination,
    isLoading,
    error,
    isInitialized,
    loadMore,
    refresh,
    removePost,
    hasMore,
    clearError
  } = usePosts(1, limit);

  const handlePostDelete = useCallback((postId: number) => {
    removePost(postId);
    onPostDelete?.(postId);
  }, [removePost, onPostDelete]);

  const handleLike = useCallback((postId: number) => {
    // TODO: Implement like functionality
    console.log('Like post:', postId);
  }, []);

  const handleComment = useCallback((postId: number) => {
    // TODO: Implement comment functionality
    console.log('Comment on post:', postId);
  }, []);

  const handleShare = useCallback((post: Post) => {
    // Simple share functionality
    if (navigator.share) {
      navigator.share({
        title: `Post by ${post.author.display_name || post.author.username}`,
        text: post.content,
        url: window.location.href
      }).catch(console.error);
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(
        `${post.content}\n\n- ${post.author.display_name || post.author.username}`
      ).then(() => {
        console.log('Post copied to clipboard');
      }).catch(console.error);
    }
  }, []);

  const feedClasses = [styles.postFeed, className].filter(Boolean).join(' ');

  if (!isInitialized && isLoading) {
    return (
      <div className={styles.centerContent}>
        <Spinner size="lg" />
        <p className={styles.loadingText}>Loading posts...</p>
      </div>
    );
  }

  if (error && posts.length === 0) {
    return (
      <div className={styles.centerContent}>
        <div className={styles.errorContent}>
          <AlertCircle size={48} className={styles.errorIcon} />
          <h3 className={styles.errorTitle}>Failed to load posts</h3>
          <p className={styles.errorMessage}>{error}</p>
          <Button 
            onClick={() => {
              clearError();
              refresh();
            }}
            variant="outline"
            className={styles.retryButton}
          >
            <RefreshCw size={16} />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className={styles.centerContent}>
        <div className={styles.emptyState}>
          <h3 className={styles.emptyTitle}>No posts yet</h3>
          <p className={styles.emptyMessage}>
            Be the first to share something with the community!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={feedClasses}>
      {error && (
        <div className={styles.errorBanner}>
          <AlertCircle size={16} />
          <span>{error}</span>
          <button 
            onClick={clearError}
            className={styles.dismissButton}
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}

      <div className={styles.postsContainer}>
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onEdit={onPostEdit}
            onDelete={handlePostDelete}
            onLike={handleLike}
            onComment={handleComment}
            onShare={handleShare}
            isOwnPost={post.author.id === currentUserId}
            className={styles.postCard}
          />
        ))}
      </div>

      {hasMore && (
        <div className={styles.loadMoreSection}>
          <Button
            onClick={loadMore}
            disabled={isLoading}
            variant="outline"
            className={styles.loadMoreButton}
          >
            {isLoading ? (
              <>
                <Spinner size="sm" />
                Loading...
              </>
            ) : (
              'Load More Posts'
            )}
          </Button>
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <div className={styles.endMessage}>
          <p>You've reached the end of the feed</p>
          <Button
            onClick={refresh}
            variant="outline"
            size="sm"
            className={styles.refreshButton}
          >
            <RefreshCw size={14} />
            Refresh
          </Button>
        </div>
      )}

      {pagination.totalPosts > 0 && (
        <div className={styles.stats}>
          Showing {posts.length} of {pagination.totalPosts} posts
        </div>
      )}
    </div>
  );
};

export default PostFeed;