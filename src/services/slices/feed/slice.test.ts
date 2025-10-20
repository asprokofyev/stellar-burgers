jest.mock('@api');

import { mockOrder } from '../../../mocks/data';
import { fetchFeeds } from './actions';
import { feedSlice } from './slice';

describe('Тестирование редюсера ленты заказов', () => {
  const initialState = feedSlice.getInitialState();

  test('Должен возвращать корректное начальное состояние при вызове с undefined состоянием и неизвестным экшеном', () => {
    expect(feedSlice.reducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual(
      initialState
    );
  });

  test('Тестирование выполнения запроса (pending)', () => {
    // выполняем экшен
    const action = { type: fetchFeeds.pending.type };
    const state = feedSlice.reducer(initialState, action);
    // проверяем что флаг загрузки данных установлен в true и нет ошибки
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('Тестирование успешного выполнения запроса (fulfilled)', () => {
    const mockFeedsData = {
      orders: [mockOrder],
      total: 100,
      totalToday: 10
    };

    const action = {
      type: fetchFeeds.fulfilled.type,
      payload: mockFeedsData
    };

    const state = feedSlice.reducer(
      { ...initialState, isLoading: true },
      action
    );

    expect(state.isLoading).toBe(false);
    expect(state.orders).toEqual([mockOrder]);
    expect(state.total).toBe(100);
    expect(state.totalToday).toBe(10);
    expect(state.error).toBeNull();
  });

  test('Тестирование выполнения запроса с ошибкой (rejected)', () => {
    const errorMessage = 'Ошибка загрузки ленты заказов';
    const action = {
      type: fetchFeeds.rejected.type,
      error: { message: errorMessage }
    };

    const state = feedSlice.reducer(
      { ...initialState, isLoading: true },
      action
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });
});
