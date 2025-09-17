import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Input from '@/ui/Input/Input';
import Button from '@/ui/Button/Button';
import Card from '@/ui/Card/Card';
import Spinner from '@/ui/Spinner/Spinner';
import * as authService from '@/auth/services/AuthService';
import type { RegisterRequest } from '@/types/RegisterRequest';
import Logo from '@/ui/Logo/Logo';

export default function RegisterForm() {
  const [formData, setFormData] = useState<RegisterRequest>({
    username: '',
    password: '',
    display_name: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: RegisterRequest) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await authService.register(formData);
      console.log('[RegisterForm] Registration successful:', response);
      navigate('/login');

    } catch (err: any) {
      console.error('[RegisterForm] Registration failed:', err);
      if (err.response) {
        if (err.response.status === 400) {
            setError(err.response.data?.message || 'Please check your input.');
        } else if (err.response.status === 409) {
             setError(err.response.data?.message || 'Username is already taken.');
        } else {
          setError('Registration failed. Please try again later.');
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
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Sign Up</h2>

      {error && (
        <div style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Input
          name="display_name"
          type="text"
          placeholder="Display Name"
          value={formData.display_name}
          onChange={handleChange}
          disabled={loading}
          required
        />
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
              <Spinner size="inline" /> Signing Up...
            </>
          ) : (
            'Sign Up'
          )}
        </Button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem' }}>
        <span>Already have an account? </span>
        {/* Use Link for client-side navigation if routing is set up */}
        <Link to="/login" style={{ color: '#007bff', textDecoration: 'none' }}>Log In</Link>
      </div>
    </Card>
  );
}