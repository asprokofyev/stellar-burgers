import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { Preloader } from '../../components/ui';
import { getIngredients } from '../../services/slices/ingredients/actions';
import {
  selectIngredients,
  selectIngredientsLoading
} from '../../services/slices/ingredients/slice';
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
  const ingredients = useSelector(selectIngredients);
  const ingredientsLoading = useSelector(selectIngredientsLoading);

  // Загружаем ингредиенты и историю заказов
  useEffect(() => {
    if (ingredients.length === 0 && !ingredientsLoading) {
      dispatch(getIngredients());
    }
    dispatch(fetchUserOrders());
  }, [dispatch, ingredients.length, ingredientsLoading]);

  if (ingredientsLoading || userOrdersLoading || !orders.length) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
