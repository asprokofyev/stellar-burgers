import { ForgotPasswordUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { forgotPassword } from '../../services/slices/user/actions';
import {
  clearError,
  selectIsPasswordForgot,
  selectUserError
} from '../../services/slices/user/slice';
import { useDispatch, useSelector } from '../../services/store';

export const ForgotPassword: FC = () => {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isPasswordForgot = useSelector(selectIsPasswordForgot);
  const error = useSelector(selectUserError);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(forgotPassword(email));
  };

  // Перенаправляем после успешного запроса восстановления
  useEffect(() => {
    if (isPasswordForgot) {
      navigate('/reset-password', { replace: true });
    }
    return () => {
      dispatch(clearError());
    };
  }, [isPasswordForgot, navigate, dispatch]);

  return (
    <ForgotPasswordUI
      errorText={error || ''}
      email={email}
      setEmail={setEmail}
      handleSubmit={handleSubmit}
    />
  );
};
