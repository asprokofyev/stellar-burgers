jest.mock('@api');

import {
  mockBun,
  mockMainIngredient,
  mockSauceIngredient
} from '../../../mocks/data';
import { burgerConstructorSlice } from './slice';

describe('Тестирование редюсера конструктора бургера', () => {
  // инициализируем стейт
  const initialState = burgerConstructorSlice.getInitialState();

  test('Должен возвращать корректное начальное состояние при вызове с undefined состоянием и неизвестным экшеном', () => {
    expect(
      burgerConstructorSlice.reducer(undefined, { type: 'UNKNOWN_ACTION' })
    ).toEqual(initialState);
  });

  describe('Тестируем экшен добавления ингредиента', () => {
    test('Проверяем добавление булки', () => {
      // добавляем булку
      const action = burgerConstructorSlice.actions.addIngredient(mockBun);
      const state = burgerConstructorSlice.reducer(initialState, action);
      // убеждаемся что булка добавилась на свое место, а не наместо начинки
      expect(state.bun).toEqual({ ...mockBun, id: expect.any(String) });
      expect(state.ingredients).toHaveLength(0);
    });

    test('Проверяем добавление начинки', () => {
      // добавляем начинку
      const action =
        burgerConstructorSlice.actions.addIngredient(mockMainIngredient);
      const state = burgerConstructorSlice.reducer(initialState, action);
      // убеждаемчя что начинка не добавлилась на место булки
      expect(state.bun).toBeNull();
      // убеждаемся что начинка добавилась
      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]).toEqual({
        ...mockMainIngredient,
        id: expect.any(String)
      });
    });

    test('Проверяем замену булки при добавлении новой булки', () => {
      // доюавляем первую булку
      const firstBunAction =
        burgerConstructorSlice.actions.addIngredient(mockBun);
      let state = burgerConstructorSlice.reducer(initialState, firstBunAction);

      // добавляем вторую булку
      const secondBun = {
        ...mockBun,
        _id: '643d69a5c3f7b9001cfa093d',
        name: 'Флюоресцентная булка R2-D3'
      };
      const secondBunAction =
        burgerConstructorSlice.actions.addIngredient(secondBun);
      state = burgerConstructorSlice.reducer(state, secondBunAction);
      // убеждаемся что в стейте именно вторая булка
      expect(state.bun).toEqual({ ...secondBun, id: expect.any(String) });
      // убеждаемся что в начинках ничего нет, т.е. булка добавтлась только туда куда ндо
      expect(state.ingredients).toHaveLength(0);
    });
  });

  describe('Тестируем экшен удаления ингредиента', () => {
    test('Проверяем удаление ингредиента', () => {
      // добавляем сначала начинку, а потом соус
      const addAction1 =
        burgerConstructorSlice.actions.addIngredient(mockMainIngredient);
      const addAction2 =
        burgerConstructorSlice.actions.addIngredient(mockSauceIngredient);

      let state = burgerConstructorSlice.reducer(initialState, addAction1);
      state = burgerConstructorSlice.reducer(state, addAction2);
      // убеждаемся что все добавилось
      expect(state.ingredients).toHaveLength(2);

      // удаляем первый ингредиент
      const ingredientIdToRemove = state.ingredients[0].id;
      const removeAction =
        burgerConstructorSlice.actions.removeIngredient(ingredientIdToRemove);
      state = burgerConstructorSlice.reducer(state, removeAction);
      // убеждаемся что остался один ингредиент, и что это именно соус
      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]._id).toBe(mockSauceIngredient._id);
    });
  });

  describe('Тестируем экшен изменения порядка ингредиентов', () => {
    test('Проверяем перемещение ингредиентов', () => {
      // добавляем два ингредиента
      const addAction1 =
        burgerConstructorSlice.actions.addIngredient(mockMainIngredient);
      const addAction2 =
        burgerConstructorSlice.actions.addIngredient(mockSauceIngredient);

      let state = burgerConstructorSlice.reducer(initialState, addAction1);
      state = burgerConstructorSlice.reducer(state, addAction2);

      // запоминаем порядок ингредиентов после добавления
      const initialOrder = state.ingredients.map((ing) => ing._id);

      // перемещаем первый ингредиент на место второго
      const moveAction = burgerConstructorSlice.actions.moveIngredient({
        fromIndex: 0,
        toIndex: 1
      });
      state = burgerConstructorSlice.reducer(state, moveAction);

      // получаем новый порядок ингредиентов и убеждаемся что первый ингредиент стал вторым, а второй первым.
      const newOrder = state.ingredients.map((ing) => ing._id);
      expect(newOrder[0]).toBe(initialOrder[1]);
      expect(newOrder[1]).toBe(initialOrder[0]);
    });
  });

  describe('Тестируем экшен очистки конструктора', () => {
    test('Проверяем очищение всех ингредиентов и булки', () => {
      // добавляем булку и один ингредиент
      const addBunAction =
        burgerConstructorSlice.actions.addIngredient(mockBun);
      const addMainAction =
        burgerConstructorSlice.actions.addIngredient(mockMainIngredient);

      let state = burgerConstructorSlice.reducer(initialState, addBunAction);
      state = burgerConstructorSlice.reducer(state, addMainAction);
      // убеждаемся что они добавились
      expect(state.bun).not.toBeNull();
      expect(state.ingredients).toHaveLength(1);
      // очищаем конструктор бургера
      const clearAction = burgerConstructorSlice.actions.clearConstructor();
      state = burgerConstructorSlice.reducer(state, clearAction);
      // убеждаемся что он очистился
      expect(state.bun).toBeNull();
      expect(state.ingredients).toHaveLength(0);
    });
  });
});
