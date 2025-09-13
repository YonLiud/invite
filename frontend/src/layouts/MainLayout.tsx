import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth/AuthProvider';
import Logo from '@/ui/Logo/Logo';
import ProfilePicture from '@/ui/ProfilePicture/ProfilePicture';
import MenuWrapper, { type MenuOption } from "../ui/MenuWrapper";
import { UserPen, LogOut } from "lucide-react";

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
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '95vh' }}>
      {/* Header */}
      <header style={{
        padding: '1rem',
        borderBottom: '1px solid #e0e0e0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Logo />
        </Link>
        <div>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <MenuWrapper options={options} trigger='click'>
                <ProfilePicture name={user.display_name || user.username} size={40} />
              </MenuWrapper>
            </div>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </header>

      <main style={{ flex: 1, padding: '1rem' }}>
        <Outlet />
      </main>

      <footer style={{
        padding: '1rem',
        borderTop: '1px solid #e0e0e0',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: '#666',
        userSelect: 'none'
      }}>
        <p>© {new Date().getFullYear()} Invite</p>
      </footer>
    </div>
  );
};

export default MainLayout;