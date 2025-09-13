import React from 'react';
import { useAuth } from '@/auth/AuthProvider';
import styles from './Profile.module.scss';
import { FaCog } from 'react-icons/fa';

const Profile: React.FC = () => {
  const { user } = useAuth();

  const isCurrentUser = (profileUsername: string) => {
    return user?.username === profileUsername;
  };

  const profileUsername = "exampleUsername"; // Replace with dynamic username from route params or API

  return (
    <div className={styles.profilesPage}>
      <div className={styles.profileHeader}>
        <h1>{profileUsername}'s Profile</h1>
        {isCurrentUser(profileUsername) && (
          <button className={styles.settingsButton}>
            <FaCog size={20} />
          </button>
        )}
      </div>
      <div className={styles.profileContent}>
        <p>Welcome to the profile page. Here you can view user details, posts, likes, and comments.</p>
        {/* Add components for user details, posts, likes, and comments here */}
      </div>
    </div>
  );
};

export default Profile;