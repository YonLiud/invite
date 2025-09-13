import React, { useState } from 'react';
import { MoreHorizontal, Heart, MessageCircle, Share, Edit, Trash2 } from 'lucide-react';
import type { Post } from '@/types/Post';
import Card from '@/ui/Card/Card';
import ProfilePicture from '@/ui/ProfilePicture/ProfilePicture';
import MenuWrapper, { type MenuOption } from '@/ui/MenuWrapper';
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
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [commentsCount] = useState(0);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    onLike?.(post.id);
  };

  const handleComment = () => {
    onComment?.(post.id);
  };

  const handleShare = () => {
    onShare?.(post);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
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
            <time className={styles.timestamp} dateTime={post.created_at}>
              {formatDate(post.created_at)}
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
        <button 
          className={`${styles.actionButton} ${isLiked ? styles.liked : ''}`}
          onClick={handleLike}
          aria-label={isLiked ? 'Unlike post' : 'Like post'}
        >
          <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
          {likesCount > 0 && <span className={styles.count}>{likesCount}</span>}
        </button>

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
    </Card>
  );
};

export default PostCard;