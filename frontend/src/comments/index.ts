export { CommentModal } from './components/CommentModal/CommentModal';
export { CommentForm } from './components/CommentForm/CommentForm';
export { default as CommentItem } from './components/CommentItem/CommentItem';
export { useComments, useCreateComment, useComment } from './hooks/useComments';
export { CommentService } from './services/CommentService';
export type { CreateCommentRequest, CommentsResponse } from './services/CommentService';