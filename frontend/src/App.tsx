import { Routes, Route } from 'react-router-dom';
import LoginForm from '@/auth/components/LoginForm/LoginForm';
import RegisterForm from '@/auth/components/RegisterForm/RegisterForm';
import MainLayout from '@/layouts/MainLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { lazy, Suspense } from 'react';
import Spinner from '@/ui/Spinner/Spinner';

const Home = lazy(() => import('@/pages/Home')); 

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />

      <Route element={<MainLayout />}>
        <Route index element={
          <ProtectedRoute>
            <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}><Spinner size="lg" /></div>}>
              <Home />
            </Suspense>
          </ProtectedRoute>
        } />
      </Route>
    </Routes>
  );
}

export default App;