import { ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  onlyUnauth?: boolean;
  children: ReactElement;
}

export const ProtectedRoute = ({
  onlyUnauth = false,
  children
}: ProtectedRouteProps) => {
  const isAuthenticated = localStorage.getItem('accessToken'); // Базовая проверка авторизации
  const location = useLocation();

  if (onlyUnauth && isAuthenticated) {
    // Если пользователь авторизован, но пытается попасть на страницы для неавторизованных
    const from = location.state?.from || '/';
    return <Navigate to={from} replace />;
  }

  if (!onlyUnauth && !isAuthenticated) {
    // Если пользователь не авторизован, но пытается попасть на защищенные страницы
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};
