import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './LoginForm.module.scss';
import Input from '@/ui/Input/Input';
import Button from '@/ui/Button/Button';
import Card from '@/ui/Card/Card';
import Spinner from '@/ui/Spinner/Spinner';
import { useAuth } from '@/auth/hooks/useAuth';
import type { LoginRequest } from '@/types/';

export default function LoginForm() {
  const [formData, setFormData] = useState<LoginRequest>({
    username: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // Global auth hook

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(formData); // Calls authService.login()
      navigate('/'); // Redirect to home/feed on success
    } catch (err: any) {
      console.error('[LoginForm] Login failed:', err);
      setError(err?.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={styles.loginForm}>
      <h2 className={styles.title}>Log In</h2>

      {error && <div className={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <Input
          name="username"
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
          disabled={loading}
          fullWidth
        />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          disabled={loading}
          fullWidth
        />

        <div className={styles.actions}>
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            fullWidth
          >
            {loading ? <Spinner size="inline" /> : 'Log In'}
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/register')}
            disabled={loading}
            fullWidth
          >
            Create Account
          </Button>
        </div>
      </form>

      <div className={styles.link}>
        <Link to="/forgot-password">Forgot password?</Link> {/* Optional later */}
      </div>
    </Card>
  );
}