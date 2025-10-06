import { TIngredient } from '@utils-types';
import { forwardRef, useMemo } from 'react';
import {
  selectConstructorBun,
  selectConstructorIngredients
} from '../../services/slices/constructor/slice';
import { useSelector } from '../../services/store';
import { IngredientsCategoryUI } from '../ui/ingredients-category';
import { TIngredientsCategoryProps } from './type';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  const bun = useSelector(selectConstructorBun);
  const constructorIngredients = useSelector(selectConstructorIngredients);

  const ingredientsCounters = useMemo(() => {
    const counters: { [key: string]: number } = {};

    // Считаем количество каждого ингредиента в конструкторе
    constructorIngredients.forEach((ingredient: TIngredient) => {
      if (!counters[ingredient._id]) counters[ingredient._id] = 0;
      counters[ingredient._id]++;
    });

    // Для булки всегда счетчик 2
    if (bun) {
      counters[bun._id] = 2;
    }

    return counters;
  }, [constructorIngredients, bun]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  );
});
