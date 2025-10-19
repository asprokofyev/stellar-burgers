jest.mock('@api');

import {
  mockBun,
  mockMainIngredient,
  mockSauceIngredient
} from '../../../mocks/data';
import { getIngredients } from './actions';
import { ingredientsSlice } from './slice';

describe('Тестирование редюсера ингредиентов', () => {
  const initialState = {
    ingredients: [],
    isLoading: false,
    error: null
  };

  test('Должен возвращать корректное начальное состояние при вызове с undefined состоянием и неизвестным экшеном', () => {
    expect(
      ingredientsSlice.reducer(undefined, { type: 'UNKNOWN_ACTION' })
    ).toEqual(initialState);
  });

  test('Тестирование выполнения запроса (pending)', () => {
    const action = { type: getIngredients.pending.type };
    const state = ingredientsSlice.reducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      isLoading: true,
      error: null
    });
  });

  test('Тестирование успешного выполнения запроса (fulfilled)', () => {
    const mockIngredients = [mockBun, mockMainIngredient, mockSauceIngredient];
    const action = {
      type: getIngredients.fulfilled.type,
      payload: mockIngredients
    };

    const state = ingredientsSlice.reducer(
      { ...initialState, isLoading: true },
      action
    );

    expect(state).toEqual({
      ingredients: mockIngredients,
      isLoading: false,
      error: null
    });
  });

  test('Тестирование выполнения запроса с ошибкой (rejected)', () => {
    const errorMessage = 'Ошибка загрузки ингредиентов';
    const action = {
      type: getIngredients.rejected.type,
      error: { message: errorMessage }
    };

    const state = ingredientsSlice.reducer(
      { ...initialState, isLoading: true },
      action
    );

    expect(state).toEqual({
      ingredients: [],
      isLoading: false,
      error: errorMessage
    });
  });
});
