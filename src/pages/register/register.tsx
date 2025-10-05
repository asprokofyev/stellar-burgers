import { RegisterUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../services/slices/user/actions';
import {
  clearError,
  selectUser,
  selectUserError
} from '../../services/slices/user/slice';
import { useDispatch, useSelector } from '../../services/store';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(selectUser);
  const error = useSelector(selectUserError);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(register({ email, password, name: userName }));
  };

  useEffect(() => {
    // Перенаправляем пользователя после успешной регистрации
    if (user) {
      navigate('/');
    }

    // Очищаем ошибки при размонтировании компонента
    return () => {
      dispatch(clearError());
    };
  }, [user, navigate, dispatch]);

  return (
    <RegisterUI
      errorText=''
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
