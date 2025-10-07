import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { fetchFeeds } from '../../services/slices/feed/actions';
import {
  selectFeedLoading,
  selectFeedOrders
} from '../../services/slices/feed/slice';
import { selectIngredientsLoading } from '../../services/slices/ingredients/slice';
import { useDispatch, useSelector } from '../../services/store';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectFeedOrders);
  const feedLoading = useSelector(selectFeedLoading);
  const ingredientsLoading = useSelector(selectIngredientsLoading);

  // Загружаем ленту заказов
  useEffect(() => {
    dispatch(fetchFeeds());
  }, []);

  const handleGetFeeds = () => {
    dispatch(fetchFeeds());
  };

  // Показываем прелоадер если загружаются ингредиенты ИЛИ лента заказов
  if (ingredientsLoading || feedLoading || !orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
