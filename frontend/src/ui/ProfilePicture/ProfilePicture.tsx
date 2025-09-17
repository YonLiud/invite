import React from 'react';
import './ProfilePicture.module.scss';
import styles from './ProfilePicture.module.scss';

type ProfilePictureProps = {
  name: string;
  size?: number; // Size of the square image in pixels
};

const ProfilePicture: React.FC<ProfilePictureProps> = ({ name, size = 100 }) => {
  // Extract initials from the first two words of the name or fallback to first two letters
  const words = name.split(' ');
  const initials = words.length > 1
    ? words.slice(0, 2).map(word => word.charAt(0).toUpperCase()).join('')
    : name.slice(0, 2).toUpperCase();

  return (
    <div
      className={styles["profile-picture"]}
      style={{
        width: size,
        height: size,
        fontSize: size / 2.5,
      }}
    >
      {initials}
    </div>
  );
};

export default ProfilePicture;