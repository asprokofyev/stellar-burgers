import { ingredientsSlice } from './../ingredients/slice';
jest.mock('@api');

import { mockOrder } from '../../../mocks/data';
import { fetchOrderByNumber } from './actions';
import { orderByNumberSlice } from './slice';

describe('Тестирование редюсера заказа по номеру', () => {
  const initialState = orderByNumberSlice.getInitialState();

  test('Должен возвращать корректное начальное состояние при вызове с undefined состоянием и неизвестным экшеном', () => {
    expect(
      orderByNumberSlice.reducer(undefined, { type: 'UNKNOWN_ACTION' })
    ).toEqual(initialState);
  });

  test('Тестирование выполнения запроса (pending)', () => {
    const action = { type: fetchOrderByNumber.pending.type };
    const state = orderByNumberSlice.reducer(initialState, action);

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('Тестирование успешного выполнения запроса (fulfilled)', () => {
    const action = {
      type: fetchOrderByNumber.fulfilled.type,
      payload: mockOrder
    };

    const state = orderByNumberSlice.reducer(
      { ...initialState, isLoading: true },
      action
    );

    expect(state.isLoading).toBe(false);
    expect(state.order).toEqual(mockOrder);
    expect(state.error).toBeNull();
  });

  test('Тестирование выполнения запроса с ошибкой (rejected)', () => {
    const errorMessage = 'Ошибка загрузки заказа';
    const action = {
      type: fetchOrderByNumber.rejected.type,
      error: { message: errorMessage }
    };

    const state = orderByNumberSlice.reducer(
      { ...initialState, isLoading: true },
      action
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });
});
