import { ResetPasswordUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resetPassword } from '../../services/slices/user/actions';
import {
  clearError,
  selectIsPasswordForgot,
  selectIsPasswordReset,
  selectUserError
} from '../../services/slices/user/slice';
import { useDispatch, useSelector } from '../../services/store';

export const ResetPassword: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');

  const isPasswordForgot = useSelector(selectIsPasswordForgot);
  const isPasswordReset = useSelector(selectIsPasswordReset);
  const error = useSelector(selectUserError);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(resetPassword({ password, token }));
  };

  // Проверяем, был ли запрос на восстановление пароля
  useEffect(() => {
    if (!isPasswordForgot) {
      navigate('/forgot-password', { replace: true });
    }
  }, [isPasswordForgot, navigate]);

  // Перенаправляем после успешного сброса пароля
  useEffect(() => {
    if (isPasswordReset) {
      navigate('/login', { replace: true });
    }
    // Очищаем ошибки при размонтировании компонента
    return () => {
      dispatch(clearError());
    };
  }, [isPasswordReset, navigate, dispatch]);

  return (
    <ResetPasswordUI
      errorText={error || ''}
      password={password}
      token={token}
      setPassword={setPassword}
      setToken={setToken}
      handleSubmit={handleSubmit}
    />
  );
};
