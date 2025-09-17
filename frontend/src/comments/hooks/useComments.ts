import { useState, useEffect, useCallback } from 'react';
import { CommentService, type CreateCommentRequest } from '../services/CommentService';
import type { Comment } from '@/types/Comment';

/**
 * Hook for creating a new comment
 */
export const useCreateComment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createComment = useCallback(async (data: CreateCommentRequest): Promise<Comment | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const comment = await CommentService.createComment(data);
      return comment;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create comment';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    createComment,
    isLoading,
    error,
    clearError: () => setError(null)
  };
};

/**
 * Hook for fetching comments for a specific post
 */
export const useComments = (postId: number, initialPage: number = 1, limit: number = 20) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: initialPage,
    totalPages: 0,
    totalComments: 0,
    totalCommentsInPage: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const fetchComments = useCallback(async (page: number = initialPage, reset: boolean = false) => {
    if (!postId) return; // Add safety check
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await CommentService.getCommentsByPost(postId, page, limit);
      
      if (reset || page === 1) {
        setComments(response.comments);
      } else {
        setComments(prev => [...prev, ...response.comments]);
      }
      
      setPagination(response.pagination);
      
      if (!isInitialized) {
        setIsInitialized(true);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch comments';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [postId, initialPage, limit, isInitialized]);

  const loadMore = useCallback(() => {
    if (!isLoading && pagination && pagination.currentPage < pagination.totalPages) {
      console.log('Loading more comments, current page:', pagination.currentPage, 'total pages:', pagination.totalPages);
      fetchComments(pagination.currentPage + 1, false);
    } else {
      console.log('Cannot load more:', { isLoading, pagination, hasMore: pagination ? pagination.currentPage < pagination.totalPages : false });
    }
  }, [fetchComments, isLoading, pagination]);

  const refresh = useCallback(() => {
    fetchComments(1, true);
  }, [fetchComments]);

  const addComment = useCallback((newComment: Comment) => {
    setComments(prev => [newComment, ...(prev || [])]);
    setPagination(prev => prev ? ({
      ...prev,
      totalComments: prev.totalComments + 1,
      totalCommentsInPage: prev.totalCommentsInPage + 1
    }) : {
      currentPage: 1,
      totalPages: 1,
      totalComments: 1,
      totalCommentsInPage: 1
    });
  }, []);

  const removeComment = useCallback((commentId: number) => {
    setComments(prev => (prev || []).filter(comment => comment.id !== commentId));
    setPagination(prev => prev ? ({
      ...prev,
      totalComments: prev.totalComments - 1,
      totalCommentsInPage: prev.totalCommentsInPage - 1
    }) : {
      currentPage: 1,
      totalPages: 0,
      totalComments: 0,
      totalCommentsInPage: 0
    });
  }, []);

  const updateComment = useCallback((updatedComment: Comment) => {
    setComments(prev => (prev || []).map(comment => 
      comment.id === updatedComment.id ? updatedComment : comment
    ));
  }, []);

  useEffect(() => {
    if (postId && postId > 0) {
      fetchComments(initialPage, true);
    }
  }, [postId, fetchComments]);

  return {
    comments,
    pagination,
    totalComments: pagination?.totalComments || 0,
    isLoading,
    error,
    isInitialized,
    fetchComments,
    loadMore,
    refresh,
    addComment,
    removeComment,
    updateComment,
    hasMore: pagination ? pagination.currentPage < pagination.totalPages : false,
    clearError: () => setError(null)
  };
};

/**
 * Hook for managing a single comment
 */
export const useComment = (commentId: number | null) => {
  const [comment, setComment] = useState<Comment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComment = useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const fetchedComment = await CommentService.getCommentById(id);
      setComment(fetchedComment);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch comment';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateComment = useCallback(async (content: string): Promise<boolean> => {
    if (!commentId) return false;
    
    setIsLoading(true);
    setError(null);

    try {
      const updatedComment = await CommentService.updateComment(commentId, { content });
      setComment(updatedComment);
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update comment';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [commentId]);

  const deleteComment = useCallback(async (): Promise<boolean> => {
    if (!commentId) return false;
    
    setIsLoading(true);
    setError(null);

    try {
      await CommentService.deleteComment(commentId);
      setComment(null);
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete comment';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [commentId]);

  useEffect(() => {
    if (commentId) {
      fetchComment(commentId);
    }
  }, [commentId, fetchComment]);

  return {
    comment,
    isLoading,
    error,
    updateComment,
    deleteComment,
    refresh: () => commentId && fetchComment(commentId),
    clearError: () => setError(null)
  };
};