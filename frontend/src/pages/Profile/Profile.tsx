import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/auth/AuthProvider';
import styles from './Profile.module.scss';
import { FaCog } from 'react-icons/fa';
import api from '@/services/api';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { username } = useParams<{ username: string }>();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await api.get(`/profiles/${username}`);
        console.log('Fetched profile data:', response.data);
        setProfileData(response.data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [username]);

  const isCurrentUser = () => {
    return user?.username === username;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profileData) {
    return <div>Profile not found.</div>;
  }

  const defaultProfileData = {
    posts: [],
    likes: [],
    comments: [],
    ...profileData,
  };

  const { posts, likes, comments } = defaultProfileData;

  return (
    <div className={styles.profilesPage}>
      <div className={styles.profileHeader}>
        <h1>{profileData.name || username}'s Profile</h1>
        {isCurrentUser() && (
          <button className={styles.settingsButton}>
            <FaCog size={20} />
          </button>
        )}
      </div>
      <div className={styles.profileContent}>
        <p>{profileData.bio || 'No bio available.'}</p>
        <h2>Posts</h2>
        <ul>
          {posts.map((post: any) => (
            <li key={post.id}>{post.title}</li>
          ))}
        </ul>
        <h2>Likes</h2>
        <ul>
          {likes.map((like: any) => (
            <li key={like.id}>{like.content}</li>
          ))}
        </ul>
        <h2>Comments</h2>
        <ul>
          {comments.map((comment: any) => (
            <li key={comment.id}>{comment.text}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Profile;