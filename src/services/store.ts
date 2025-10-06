import { combineSlices, configureStore } from '@reduxjs/toolkit';
import {
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { burgerConstructorSlice } from './slices/constructor/slice';
import { ingredientsSlice } from './slices/ingredients/slice';
import { orderByNumberSlice } from './slices/order-info/slice';
import { orderSlice } from './slices/order/slice';
import { userOrdersSlice } from './slices/profile-orders/slice';
import { userSlice } from './slices/user/slice';

const rootReducer = combineSlices(
  userSlice,
  ingredientsSlice,
  burgerConstructorSlice,
  orderSlice,
  userOrdersSlice,
  orderByNumberSlice
);

export const store = configureStore({
  reducer: rootReducer
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch = dispatchHook.withTypes<AppDispatch>();
export const useSelector = selectorHook.withTypes<RootState>();
