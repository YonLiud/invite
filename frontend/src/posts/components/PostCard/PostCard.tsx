import React, { useState } from 'react';
import { MoreHorizontal, MessageCircle, Share, Edit, Trash2 } from 'lucide-react';
import type { Post } from '@/types/Post';
import Card from '@/ui/Card/Card';
import ProfilePicture from '@/ui/ProfilePicture/ProfilePicture';
import MenuWrapper, { type MenuOption } from '@/ui/MenuWrapper';
import { CommentModal, useCommentCount } from '@/comments';
import { LikeButton } from '@/likes/components/LikeButton/LikeButton';
import { useLikes } from '@/likes';
import styles from './PostCard.module.scss';

export interface PostCardProps {
  post: Post;
  onEdit?: (post: Post) => void;
  onDelete?: (postId: number) => void;
  onLike?: (postId: number) => void;
  onComment?: (postId: number) => void;
  onShare?: (post: Post) => void;
  isOwnPost?: boolean;
  className?: string;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  onEdit,
  onDelete,
  onLike,
  onComment,
  onShare,
  isOwnPost = false,
  className = ''
}) => {
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  
  // Fetch likes data for this post (auto-fetches on postId change)
  const { count: likesCount, isLiked, updateLikeState } = useLikes(post.id);
  
  // Fetch comment count for this post
  const { count: commentsCount, incrementCount: incrementCommentCount } = useCommentCount(post.id);

  const handleLikeChange = (postId: number, newIsLiked: boolean, _newCount: number) => {
    updateLikeState(newIsLiked);
    // Update any external state if needed
    onLike?.(postId);
  };

  const handleComment = () => {
    setIsCommentModalOpen(true);
    onComment?.(post.id);
  };

  const handleCloseCommentModal = () => {
    setIsCommentModalOpen(false);
  };

  const handleCommentAdded = () => {
    incrementCommentCount();
  };

  const handleShare = () => {
    onShare?.(post);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) {
      return 'Unknown date';
    }
    
    // Try to parse the date - handle different formats
    let date = new Date(dateString);
    
    // If first attempt fails, try parsing ISO format manually
    if (isNaN(date.getTime())) {
      // Try parsing ISO date format manually
      const isoMatch = dateString.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{3}))?Z?$/);
      if (isoMatch) {
        date = new Date(dateString.endsWith('Z') ? dateString : dateString + 'Z');
      }
    }
    
    // Check if the date is valid after all parsing attempts
    if (isNaN(date.getTime())) {
      console.warn('Invalid date format:', dateString);
      return 'Unknown date';
    }
    
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const menuOptions: MenuOption[] = [
    ...(isOwnPost ? [
      {
        id: 'edit',
        label: 'Edit Post',
        icon: <Edit size={16} />,
        onClick: () => onEdit?.(post)
      },
      {
        id: 'delete',
        label: 'Delete Post',
        icon: <Trash2 size={16} />,
        danger: true,
        onClick: () => onDelete?.(post.id)
      }
    ] : []),
    {
      id: 'share',
      label: 'Share Post',
      icon: <Share size={16} />,
      onClick: handleShare
    }
  ];

  const cardClasses = [styles.postCard, className].filter(Boolean).join(' ');

  return (
    <Card className={cardClasses}>
      <div className={styles.header}>
        <div className={styles.authorInfo}>
          <ProfilePicture 
            name={post.author.display_name || post.author.username}
            size={40}
          />
          <div className={styles.authorDetails}>
            <h4 className={styles.displayName}>
              {post.author.display_name || post.author.username}
            </h4>
            <span className={styles.username}>@{post.author.username}</span>
            <span className={styles.separator}>•</span>
            <time className={styles.timestamp} dateTime={post.createdAt}>
              {formatDate(post.createdAt)}
            </time>
          </div>
        </div>
        
        {menuOptions.length > 0 && (
          <MenuWrapper 
            options={menuOptions} 
            position="bottom-left"
            className={styles.menuWrapper}
          >
            <button className={styles.menuButton} aria-label="Post options">
              <MoreHorizontal size={20} />
            </button>
          </MenuWrapper>
        )}
      </div>

      <div className={styles.content}>
        <p className={styles.postText}>{post.content}</p>
      </div>

      <div className={styles.actions}>
        <LikeButton
          postId={post.id}
          initialLiked={isLiked}
          initialCount={likesCount}
          onLikeChange={handleLikeChange}
        />

        <button 
          className={styles.actionButton}
          onClick={handleComment}
          aria-label="Comment on post"
        >
          <MessageCircle size={18} />
          {commentsCount > 0 && <span className={styles.count}>{commentsCount}</span>}
        </button>

        <button 
          className={styles.actionButton}
          onClick={handleShare}
          aria-label="Share post"
        >
          <Share size={18} />
        </button>
      </div>

      <CommentModal
        postId={post.id}
        isOpen={isCommentModalOpen}
        onClose={handleCloseCommentModal}
        onCommentAdded={handleCommentAdded}
      />
    </Card>
  );
};

export default PostCard;