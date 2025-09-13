import { useState } from 'react';
import { useAuth } from '@/auth/AuthProvider';
import { CreatePost, PostFeed } from '@/posts';
import type { Post } from '@/types/Post';
import styles from './Home.module.scss';

const Home = () => {
  const { user } = useAuth();
  const [refreshFeed, setRefreshFeed] = useState(0);

  const handlePostCreated = (newPost: Post) => {
    // Trigger feed refresh by updating the key
    setRefreshFeed(prev => prev + 1);
    console.log('New post created:', newPost);
  };

  const handlePostEdit = (post: Post) => {
    // TODO: Implement edit functionality
    console.log('Edit post:', post);
  };

  const handlePostDelete = (postId: number) => {
    // TODO: Implement delete functionality via API
    console.log('Delete post:', postId);
  };

  return (
    <div className={styles.home}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Your Feed</h1>
          <p className={styles.subtitle}>
            Welcome back, {user?.display_name || user?.username || 'there'}!
          </p>
        </header>

        <div className={styles.content}>
          {/* Create Post Section */}
          <section className={styles.createSection}>
            <CreatePost
              onPostCreated={handlePostCreated}
              currentUserName={user?.display_name || user?.username || 'You'}
              placeholder="What's on your mind today?"
            />
          </section>

          {/* Posts Feed Section */}
          <section className={styles.feedSection}>
            <PostFeed
              key={refreshFeed} // Force refresh when new post is created
              onPostEdit={handlePostEdit}
              onPostDelete={handlePostDelete}
              currentUserId={user?.id}
              limit={20}
            />
          </section>
        </div>
      </div>
    </div>
  );
};

export default Home;