import { FC, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getIngredients } from '../../services/slices/ingredients/actions';
import {
  selectIngredientById,
  selectIngredientsLoading
} from '../../services/slices/ingredients/slice';
import { useDispatch, useSelector } from '../../services/store';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { Preloader } from '../ui/preloader';

export const IngredientDetails: FC = () => {
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const ingredientData = useSelector((state) =>
    selectIngredientById(state, id || '')
  );

  const isLoading = useSelector(selectIngredientsLoading);

  // Загружаем ингредиенты, если их нет
  useEffect(() => {
    if (!ingredientData && !isLoading) {
      dispatch(getIngredients());
    }
  }, [ingredientData, isLoading, dispatch]);

  if (isLoading || !ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
