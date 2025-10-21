jest.mock('@api');

import { mockOrder } from '../../../mocks/data';
import { createOrder } from './actions';
import { orderSlice } from './slice';

describe('Тестирование редюсера заказов', () => {
  const initialState = orderSlice.getInitialState();

  test('Должен возвращать корректное начальное состояние при вызове с undefined состоянием и неизвестным экшеном', () => {
    expect(orderSlice.reducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual(
      initialState
    );
  });

  test('Тестирование выполнения запроса (pending)', () => {
    const action = { type: createOrder.pending.type };
    const state = orderSlice.reducer(initialState, action);

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('Тестирование успешного выполнения запроса (fulfilled)', () => {
    const action = {
      type: createOrder.fulfilled.type,
      payload: mockOrder
    };

    const state = orderSlice.reducer(
      { ...initialState, isLoading: true },
      action
    );

    expect(state.isLoading).toBe(false);
    expect(state.orderData).toEqual(mockOrder);
    expect(state.error).toBeNull();
  });

  test('Тестирование выполнения запроса с ошибкой (rejected)', () => {
    const errorMessage = 'Ошибка создания заказа';
    const action = {
      type: createOrder.rejected.type,
      error: { message: errorMessage }
    };

    const state = orderSlice.reducer(
      { ...initialState, isLoading: true },
      action
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMessage);
    expect(state.orderData).toBeNull();
  });
});
