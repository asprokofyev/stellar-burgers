import { AppHeaderUI } from '@ui';
import { FC } from 'react';

import { selectUser } from '../../services/slices/user/slice';
import { useSelector } from '../../services/store';

export const AppHeader: FC = () => {
  const user = useSelector(selectUser);

  return <AppHeaderUI userName={user?.name || ''} />;
};
