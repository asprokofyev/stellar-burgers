import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { fetchFeeds } from '../../services/slices/feed/actions';
import {
  selectFeedLoading,
  selectFeedOrders
} from '../../services/slices/feed/slice';
import { getIngredients } from '../../services/slices/ingredients/actions';
import {
  selectIngredients,
  selectIngredientsLoading
} from '../../services/slices/ingredients/slice';
import { useDispatch, useSelector } from '../../services/store';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectFeedOrders);
  const feedLoading = useSelector(selectFeedLoading);
  const ingredients = useSelector(selectIngredients);
  const ingredientsLoading = useSelector(selectIngredientsLoading);

  // Загружаем ингредиенты и ленту заказов
  useEffect(() => {
    if (ingredients.length === 0 && !ingredientsLoading) {
      dispatch(getIngredients());
    }
    dispatch(fetchFeeds());
  }, [dispatch, ingredientsLoading]);

  const handleGetFeeds = () => {
    dispatch(fetchFeeds());
  };

  // Показываем прелоадер если загружаются ингредиенты ИЛИ лента заказов
  if (ingredientsLoading || feedLoading || !orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
