import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '@/auth/AuthProvider';
import Logo from '@/ui/Logo/Logo';
import Button from '@/ui/Button/Button'

const MainLayout = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("[MainLayout] Logout failed:", err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
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
              <span style={{ fontSize: '0.9rem' }}>Hello, {user.display_name || user.username}</span>
              <Button onClick={handleLogout} variant="outline" size="sm">Logout</Button>
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