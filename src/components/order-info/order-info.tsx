import { TIngredient } from '@utils-types';
import { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { getIngredients } from '../../services/slices/ingredients/actions';
import {
  selectIngredients,
  selectIngredientsLoading
} from '../../services/slices/ingredients/slice';
import { fetchOrderByNumber } from '../../services/slices/order-info/actions';
import {
  selectOrderByNumber,
  selectOrderByNumberLoading
} from '../../services/slices/order-info/slice';
import { useDispatch, useSelector } from '../../services/store';
import { OrderInfoUI } from '../ui/order-info';
import { Preloader } from '../ui/preloader';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();

  const ingredients = useSelector(selectIngredients);
  const ingredientsLoading = useSelector(selectIngredientsLoading);
  const orderData = useSelector(selectOrderByNumber);
  const orderLoading = useSelector(selectOrderByNumberLoading);

  const orderNumber = number ? parseInt(number) : 0;

  // Загружаем ингредиенты, если они не загружены
  useEffect(() => {
    if (ingredients.length === 0 && !ingredientsLoading) {
      dispatch(getIngredients());
    }
  }, [ingredientsLoading, dispatch]);

  // Загружаем заказ по номеру, если его нет или номер изменился
  useEffect(() => {
    if (orderNumber && (!orderData || orderData.number !== orderNumber)) {
      dispatch(fetchOrderByNumber(orderNumber));
    }
  }, [orderNumber, orderData, dispatch]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length || orderData.number !== orderNumber) {
      return null;
    }

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients, orderNumber]);

  if (ingredientsLoading || orderLoading || !orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
