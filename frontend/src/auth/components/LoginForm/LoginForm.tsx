import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '@/ui/Input/Input';
import Button from '@/ui/Button/Button';
import Card from '@/ui/Card/Card';
import Spinner from '@/ui/Spinner/Spinner';
import Logo from '@/ui/Logo/Logo';
import * as authService from '@/auth/services/AuthService';
import type { LoginRequest } from '@/types/LoginRequest'; 

export default function LoginForm() {
  const [formData, setFormData] = useState<LoginRequest>({
    username: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: LoginRequest) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await authService.login(formData);
      console.log('[LoginForm] Login successful:', response);

      navigate('/'); 

    } catch (err: any) {
      console.error('[LoginForm] Login failed:', err);
      if (err.response) {
        if (err.response.status === 401) {
          setError('Invalid username or password.');
        } else if (err.response.status === 400) {
          setError('Please check your input.');
        } else {
          setError('Login failed. Please try again later.');
        }
      } else if (err.request) {
        setError('Network error. Please check your connection.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <Logo />
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Log In</h2>

      {error && (
        <div style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Input
          name="username"
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          disabled={loading}
          required
        />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          disabled={loading}
          required
        />

        <Button
          type="submit"
          variant="primary"
          disabled={loading}
          style={{ marginTop: '0.5rem' }}
        >
          {loading ? (
            <>
              <Spinner size="inline" /> Logging in...
            </>
          ) : (
            'Log In'
          )}
        </Button>
      </form>
    </Card>
  );
}