import React, { useState } from 'react';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import type { Comment } from '@/types/Comment';
import ProfilePicture from '@/ui/ProfilePicture/ProfilePicture';
import MenuWrapper, { type MenuOption } from '@/ui/MenuWrapper';
import styles from './CommentItem.module.scss';

export interface CommentItemProps {
  comment: Comment;
  onEdit?: (comment: Comment) => void;
  onDelete?: (commentId: number) => void;
  isOwnComment?: boolean;
  className?: string;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onEdit,
  onDelete,
  isOwnComment = false,
  className = ''
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (isDeleting) return;
    
    setIsDeleting(true);
    try {
      onDelete?.(comment.id);
    } finally {
      setIsDeleting(false);
    }
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

  const menuOptions: MenuOption[] = isOwnComment ? [
    {
      id: 'edit',
      label: 'Edit Comment',
      icon: <Edit size={16} />,
      onClick: () => onEdit?.(comment)
    },
    {
      id: 'delete',
      label: 'Delete Comment',
      icon: <Trash2 size={16} />,
      danger: true,
      onClick: handleDelete,
      disabled: isDeleting
    }
  ] : [];

  const itemClasses = [
    styles.commentItem,
    isDeleting && styles.deleting,
    className
  ].filter(Boolean).join(' ');

  // Safety check for author data
  if (!comment.author) {
    return (
      <div className={itemClasses}>
        <div className={styles.content}>
          <div className={styles.header}>
            <span className={styles.displayName}>Unknown User</span>
            <span className={styles.timestamp}>
              {formatDate(comment.created_at)}
            </span>
          </div>
          <p className={styles.text}>{comment.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={itemClasses}>
      <div className={styles.avatar}>
        <ProfilePicture 
          name={comment.author.display_name || comment.author.username}
          size={32}
        />
      </div>
      
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.authorInfo}>
            <span className={styles.displayName}>
              {comment.author.display_name || comment.author.username}
            </span>
            <span className={styles.username}>@{comment.author.username}</span>
            <span className={styles.separator}>•</span>
            <time className={styles.timestamp} dateTime={comment.created_at}>
              {formatDate(comment.created_at)}
            </time>
            {comment.updated_at !== comment.created_at && (
              <span className={styles.edited}>(edited)</span>
            )}
          </div>
          
          {menuOptions.length > 0 && (
            <MenuWrapper 
              options={menuOptions} 
              position="bottom-left"
              className={styles.menuWrapper}
            >
              <button 
                className={styles.menuButton} 
                aria-label="Comment options"
                disabled={isDeleting}
              >
                <MoreHorizontal size={16} />
              </button>
            </MenuWrapper>
          )}
        </div>
        
        <div className={styles.text}>
          <p className={styles.commentText}>{comment.content}</p>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;