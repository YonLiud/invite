import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth/AuthProvider';
import Logo from '@/ui/Logo/Logo';
import ProfilePicture from '@/ui/ProfilePicture/ProfilePicture';
import MenuWrapper, { type MenuOption } from "../ui/MenuWrapper";
import { UserPen, LogOut } from "lucide-react";
import styles from './MainLayout.module.scss';

const MainLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("[MainLayout] Logout failed:", err);
    }
  };

  const handleProfile = () => {
    if (user && user.username) {
      navigate(`/profile/${user.username}`);
    } else {
      console.error("[MainLayout] User information is missing or incomplete.");
    }
  };

  const options: MenuOption[] = [
    {
      id: "profile",
      label: "Profile",
      icon: <UserPen />,
      onClick: () => handleProfile(),
    },
    // {
    //   id: "settings",
    //   label: "Settings",
    //   icon: <UserCog />,
    //   onClick: () => handleSettings(),
    //   disabled: false,
    //   danger: false,
    // },
    {
      id: "logout",
      label: "Log Out",
      icon: <LogOut />,
      onClick: () => handleLogout(),
    }
    // ,
    // {
    //   id: "logoutall",
    //   label: "Log Out All Sessions",
    //   icon: <LogOut />,
    //   onClick: () => {}, //TODO implement
    //   danger: true,
    // }
  ];

  return (
    <div className={styles.mainLayout}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Logo />
          </Link>
        </div>
        <div className={styles.headerRight}>
          {user ? (
            <div className={styles.userSection}>
              <MenuWrapper options={options} position="bottom-left">
                <ProfilePicture name={user.display_name || user.username} size={40} />
              </MenuWrapper>
            </div>
          ) : (
            <Link to="/login" className={styles.loginLink}>Login</Link>
          )}
        </div>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <p className={styles.footerText}>© {new Date().getFullYear()} Invite</p>
      </footer>
    </div>
  );
};

export default MainLayout;