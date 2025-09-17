import { useState, useEffect, useCallback } from 'react';
import { PostService, type CreatePostRequest } from '../services/PostService';
import type { Post } from '@/types/Post';

/**
 * Hook for creating a new post
 */
export const useCreatePost = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPost = useCallback(async (data: CreatePostRequest): Promise<Post | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const post = await PostService.createPost(data);
      return post;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create post';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    createPost,
    isLoading,
    error,
    clearError: () => setError(null)
  };
};

/**
 * Hook for fetching posts with pagination
 */
export const usePosts = (initialPage: number = 1, limit: number = 20) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: initialPage,
    totalPages: 0,
    totalPosts: 0,
    totalPostsInPage: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const fetchPosts = useCallback(async (page: number = initialPage, reset: boolean = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await PostService.getPosts(page, limit);
      
      if (reset || page === 1) {
        setPosts(response.posts);
      } else {
        setPosts(prev => [...prev, ...response.posts]);
      }
      
      setPagination(response.pagination);
      
      if (!isInitialized) {
        setIsInitialized(true);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch posts';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [initialPage, limit, isInitialized]);

  const loadMore = useCallback(() => {
    if (!isLoading && pagination.currentPage < pagination.totalPages) {
      fetchPosts(pagination.currentPage + 1, false);
    }
  }, [fetchPosts, isLoading, pagination.currentPage, pagination.totalPages]);

  const refresh = useCallback(() => {
    fetchPosts(1, true);
  }, [fetchPosts]);

  const addPost = useCallback((newPost: Post) => {
    setPosts(prev => [newPost, ...prev]);
    setPagination(prev => ({
      ...prev,
      totalPosts: prev.totalPosts + 1,
      totalPostsInPage: prev.totalPostsInPage + 1
    }));
  }, []);

  const removePost = useCallback((postId: number) => {
    setPosts(prev => prev.filter(post => post.id !== postId));
    setPagination(prev => ({
      ...prev,
      totalPosts: prev.totalPosts - 1,
      totalPostsInPage: prev.totalPostsInPage - 1
    }));
  }, []);

  const updatePost = useCallback((updatedPost: Post) => {
    setPosts(prev => prev.map(post => 
      post.id === updatedPost.id ? updatedPost : post
    ));
  }, []);

  useEffect(() => {
    fetchPosts(initialPage, true);
  }, [initialPage, limit]);

  return {
    posts,
    pagination,
    isLoading,
    error,
    isInitialized,
    fetchPosts,
    loadMore,
    refresh,
    addPost,
    removePost,
    updatePost,
    hasMore: pagination.currentPage < pagination.totalPages,
    clearError: () => setError(null)
  };
};

/**
 * Hook for managing a single post
 */
export const usePost = (postId: number | null) => {
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPost = useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const fetchedPost = await PostService.getPostById(id);
      setPost(fetchedPost);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch post';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updatePost = useCallback(async (data: CreatePostRequest): Promise<boolean> => {
    if (!postId) return false;
    
    setIsLoading(true);
    setError(null);

    try {
      const updatedPost = await PostService.updatePost(postId, data);
      setPost(updatedPost);
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update post';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  const deletePost = useCallback(async (): Promise<boolean> => {
    if (!postId) return false;
    
    setIsLoading(true);
    setError(null);

    try {
      await PostService.deletePost(postId);
      setPost(null);
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete post';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    if (postId) {
      fetchPost(postId);
    }
  }, [postId, fetchPost]);

  return {
    post,
    isLoading,
    error,
    updatePost,
    deletePost,
    refresh: () => postId && fetchPost(postId),
    clearError: () => setError(null)
  };
};