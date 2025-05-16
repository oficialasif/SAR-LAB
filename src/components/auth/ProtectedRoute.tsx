import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  // Debug: Log auth state
  console.log('Protected Route State:', {
    isLoading: loading,
    hasUser: !!currentUser,
    pathname: location.pathname
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!currentUser) {
    console.log('No user found, redirecting to login');
    // Save the current path for redirect after login
    const returnPath = location.pathname;
    return (
      <Navigate 
        to="/admin/login" 
        state={{ returnTo: returnPath }}
        replace 
      />
    );
  }

  console.log('User authenticated, rendering protected content');
  return <>{children}</>;
} 