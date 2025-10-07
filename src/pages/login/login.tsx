import { LoginUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { login } from '../../services/slices/user/actions';
import {
  clearError,
  selectUser,
  selectUserError
} from '../../services/slices/user/slice';
import { useDispatch, useSelector } from '../../services/store';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const user = useSelector(selectUser);
  const error = useSelector(selectUserError);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  // Перенаправляем после успешной авторизации
  useEffect(() => {
    if (user) {
      // Если есть запрашиваемая страница, переходим туда, иначе на главную
      const from = location.state?.from || '/';
      navigate(from, { replace: true });
    }
    return () => {
      dispatch(clearError());
    };
  }, [user, navigate, location, dispatch]);

  return (
    <LoginUI
      errorText={error || ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
