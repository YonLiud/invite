import { useState, useEffect } from 'react';
import { CommentService } from '../services/CommentService';

/**
 * Lightweight hook for fetching just the comment count for a post
 */
export const useCommentCount = (postId: number) => {
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!postId) return;

    const fetchCommentCount = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch first page with limit 1 to get total count efficiently
        const response = await CommentService.getCommentsByPost(postId, 1, 1);
        setCount(response.pagination.totalComments);
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch comment count';
        setError(errorMessage);
        setCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCommentCount();
  }, [postId]);

  // Function to update count when comments are added/removed
  const updateCount = (newCount: number) => {
    setCount(newCount);
  };

  const incrementCount = () => {
    setCount(prev => prev + 1);
  };

  const decrementCount = () => {
    setCount(prev => Math.max(0, prev - 1));
  };

  return {
    count,
    isLoading,
    error,
    updateCount,
    incrementCount,
    decrementCount
  };
};