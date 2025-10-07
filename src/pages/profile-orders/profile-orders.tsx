import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { Preloader } from '../../components/ui';
import { selectIngredientsLoading } from '../../services/slices/ingredients/slice';
import { fetchUserOrders } from '../../services/slices/profile-orders/actions';
import {
  selectUserOrders,
  selectUserOrdersLoading
} from '../../services/slices/profile-orders/slice';
import { useDispatch, useSelector } from '../../services/store';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectUserOrders);
  const userOrdersLoading = useSelector(selectUserOrdersLoading);
  const ingredientsLoading = useSelector(selectIngredientsLoading);

  // Загружаем ингредиенты и историю заказов
  useEffect(() => {
    dispatch(fetchUserOrders());
  }, []);

  if (ingredientsLoading || userOrdersLoading || !orders.length) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
