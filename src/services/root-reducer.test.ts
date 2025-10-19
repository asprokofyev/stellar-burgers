import { rootReducer, store } from './store';

describe('Тестирование корневого редюсера', () => {
  test('Должен инициализироваться с корректным начальным состоянием', () => {
    const state = store.getState();

    expect(state).toHaveProperty('burgerConstructor');
    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('order');
    expect(state).toHaveProperty('user');
    expect(state).toHaveProperty('feed');
    expect(state).toHaveProperty('userOrders');
    expect(state).toHaveProperty('orderByNumber');
  });

  test('Должен возвращать корректное начальное состояние при вызове с undefined состоянием и неизвестным экшеном', () => {
    const initialState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    // Проверяем структуру начального состояния
    expect(initialState).toEqual({
      burgerConstructor: {
        bun: null,
        ingredients: []
      },
      ingredients: {
        ingredients: [],
        isLoading: false,
        error: null
      },
      order: {
        orderData: null,
        isLoading: false,
        error: null
      },
      user: {
        user: null,
        isAuthChecked: false,
        isLoading: false,
        error: null,
        isPasswordForgot: false,
        isPasswordReset: false
      },
      feed: {
        orders: [],
        total: 0,
        totalToday: 0,
        isLoading: false,
        error: null,
        selectedOrder: null
      },
      userOrders: {
        orders: [],
        isLoading: false,
        error: null
      },
      orderByNumber: {
        order: null,
        isLoading: false,
        error: null
      }
    });
  });
});
