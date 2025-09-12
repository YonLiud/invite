import './App.module.scss';
import LoginForm from '@/auth/components/LoginForm/LoginForm';
import RegisterForm from '@/auth/components/RegisterForm/RegisterForm';

export default function App() {
  return (
    <div className="app">
      <LoginForm />
      <RegisterForm />
    </div>
  );
}