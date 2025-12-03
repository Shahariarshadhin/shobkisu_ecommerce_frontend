'use client';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { fetchMe } from '../redux/authSlice';


export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        router.push('/login');
        return;
      }

      if (!user) {
        try {
          await dispatch(fetchMe()).unwrap();
        } catch (error) {
          router.push('/login');
        }
      }
    };

    checkAuth();
  }, [dispatch, user, router]);

  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        router.push('/unauthorized');
      }
    }
  }, [isAuthenticated, user, loading, allowedRoles, router]);

  if (loading || !isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#C8AF9C] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}