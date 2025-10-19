jest.mock('@api');

import { mockOrder } from '../../../mocks/data';
import { fetchUserOrders } from './actions';
import { userOrdersSlice } from './slice';

describe('Тестирование редюсера истории заказов пользователя', () => {
  const initialState = {
    orders: [],
    isLoading: false,
    error: null
  };

  test('Должен возвращать корректное начальное состояние при вызове с undefined состоянием и неизвестным экшеном', () => {
    expect(
      userOrdersSlice.reducer(undefined, { type: 'UNKNOWN_ACTION' })
    ).toEqual(initialState);
  });

  test('Тестирование выполнения запроса (pending)', () => {
    const action = { type: fetchUserOrders.pending.type };
    const state = userOrdersSlice.reducer(initialState, action);

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('Тестирование успешного выполнения запроса (fulfilled)', () => {
    const mockOrders = [mockOrder];
    const action = {
      type: fetchUserOrders.fulfilled.type,
      payload: mockOrders
    };

    const state = userOrdersSlice.reducer(
      { ...initialState, isLoading: true },
      action
    );

    expect(state.isLoading).toBe(false);
    expect(state.orders).toEqual(mockOrders);
    expect(state.error).toBeNull();
  });

  test('Тестирование выполнения запроса с ошибкой (rejected)', () => {
    const errorMessage = 'Ошибка загрузки заказов пользователя';
    const action = {
      type: fetchUserOrders.rejected.type,
      error: { message: errorMessage }
    };

    const state = userOrdersSlice.reducer(
      { ...initialState, isLoading: true },
      action
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });
});
