import { useState, useCallback, useEffect } from 'react';
import { LikeService } from '../services/LikeService';
import type { Like } from '@/types/Like';

/**
 * Hook for liking/unliking posts
 */
export const useLikePost = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleLike = useCallback(async (postId: number, isCurrentlyLiked: boolean): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (isCurrentlyLiked) {
        await LikeService.unlikePost(postId);
        return false;
      } else {
        await LikeService.likePost(postId);
        return true;
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update like';
      setError(errorMessage);
      // Return the current state on error to revert optimistic update
      return isCurrentlyLiked;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const likePost = useCallback(async (postId: number): Promise<Like | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const like = await LikeService.likePost(postId);
      return like;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to like post';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const unlikePost = useCallback(async (postId: number): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await LikeService.unlikePost(postId);
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to unlike post';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    toggleLike,
    likePost,
    unlikePost,
    isLoading,
    error,
    clearError: () => setError(null)
  };
};

/**
 * Hook for fetching likes data
 */
export const useLikes = (postId: number) => {
  const [likes, setLikes] = useState<Like[]>([]);
  const [count, setCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLikes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [likesData, userLiked] = await Promise.all([
        LikeService.getLikesByPost(postId),
        LikeService.hasUserLikedPost(postId)
      ]);
      
      setLikes(likesData.likes);
      setCount(likesData.count);
      setIsLiked(userLiked);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch likes';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  const updateLikeState = useCallback((newIsLiked: boolean, like?: Like) => {
    setIsLiked(newIsLiked);
    setCount(prev => newIsLiked ? prev + 1 : prev - 1);
    
    if (newIsLiked && like) {
      setLikes(prev => [like, ...prev]);
    } else if (!newIsLiked) {
      setLikes(prev => prev.filter(l => l.author.id !== like?.author.id));
    }
  }, []);

  // Auto-fetch likes when postId changes
  useEffect(() => {
    if (postId) {
      fetchLikes();
    }
  }, [postId, fetchLikes]);

  return {
    likes,
    count,
    isLiked,
    isLoading,
    error,
    fetchLikes,
    updateLikeState,
    clearError: () => setError(null)
  };
};