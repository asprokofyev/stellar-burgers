jest.mock('@api');

import { mockUser } from '../../../mocks/data';
import { checkUserAuth, login } from './actions';
import { userSlice } from './slice';

describe('Тестирование редюсера пользователя', () => {
  const initialState = {
    user: null,
    isAuthChecked: false,
    isLoading: false,
    error: null,
    isPasswordForgot: false,
    isPasswordReset: false
  };

  test('Должен возвращать корректное начальное состояние при вызове с undefined состоянием и неизвестным экшеном', () => {
    expect(userSlice.reducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual(
      initialState
    );
  });

  test('Тестирование выполнения запроса (pending)', () => {
    const action = { type: login.pending.type };
    const state = userSlice.reducer(initialState, action);

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('Тестирование успешного выполнения запроса логина (fulfilled)', () => {
    const action = {
      type: login.fulfilled.type,
      payload: mockUser
    };

    const state = userSlice.reducer(
      { ...initialState, isLoading: true },
      action
    );

    expect(state.isLoading).toBe(false);
    expect(state.user).toEqual(mockUser);
    expect(state.error).toBeNull();
  });

  test('Тестирование выполнения запроса логина с ошибкой (rejected)', () => {
    const errorMessage = 'Ошибка входа';
    const action = {
      type: login.rejected.type,
      error: { message: errorMessage }
    };

    const state = userSlice.reducer(
      { ...initialState, isLoading: true },
      action
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMessage);
    expect(state.user).toBeNull();
  });

  test('Тестирование успешного выполнения запроса проверки статуса авторизации(fulfilled)', () => {
    const action = { type: checkUserAuth.fulfilled.type };
    const state = userSlice.reducer(
      { ...initialState, isLoading: true },
      action
    );

    expect(state.isLoading).toBe(false);
  });
});
