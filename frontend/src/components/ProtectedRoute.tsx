import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/auth/AuthProvider';
import Spinner from '@/ui/Spinner/Spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  console.log('[ProtectedRoute] Render - user:', user, 'isLoading:', isLoading);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login', { state: { from: location }, replace: true });
    }
  }, [user, isLoading, navigate, location]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spinner size="lg" />
      </div>
    );
  }
  return user ? <>{children}</> : null;
};

export default ProtectedRoute;