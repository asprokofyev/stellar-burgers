import { Preloader } from '@ui';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import {
  selectIsAuthChecked,
  selectUser
} from '../../services/slices/user/slice';

interface ProtectedRouteProps {
  onlyUnauth?: boolean;
}

export const ProtectedRoute = ({ onlyUnauth = false }: ProtectedRouteProps) => {
  const user = useSelector(selectUser);
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const location = useLocation();

  // Если авторизация еще не проверена, показываем прелоадер
  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyUnauth && user) {
    // Если пользователь авторизован, но пытается попасть на страницы для неавторизованных
    const from = location.state?.from || '/';
    return <Navigate to={from} replace />;
  }

  if (!onlyUnauth && !user) {
    // Если пользователь не авторизован, но пытается попасть на защищенные страницы
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return <Outlet />;
};
