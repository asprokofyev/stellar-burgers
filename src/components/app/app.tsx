import {
  AppHeader,
  IngredientDetails,
  Modal,
  OrderInfo,
  ProtectedRoute
} from '@components';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import { Preloader } from '@ui';
import { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import '../../index.css';
import { getIngredients } from '../../services/slices/ingredients/actions';
import { selectIngredientsLoading } from '../../services/slices/ingredients/slice';
import { checkUserAuth } from '../../services/slices/user/actions';
import {
  selectIsAuthChecked,
  selectUserLoading
} from '../../services/slices/user/slice';
import { AppDispatch, useDispatch, useSelector } from '../../services/store';
import styles from './app.module.css';

const App = () => {
  const dispatch: AppDispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const background = location.state && location.state.background;
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const userLoading = useSelector(selectUserLoading);
  const ingredientsLoading = useSelector(selectIngredientsLoading);

  const handleModalClose = () => {
    // Возвращаемся к предыдущему пути
    navigate(-1);
  };

  useEffect(() => {
    // Проверяем авторизацию пользователя при загрузке приложения
    dispatch(checkUserAuth());
    // Загружаем ингредиенты при загрузке приложения
    dispatch(getIngredients());
  }, []);

  // Показываем прелоадер пока проверяем авторизацию
  if (!isAuthChecked || userLoading || ingredientsLoading) {
    return (
      <div className={styles.app}>
        <AppHeader />
        <div className={styles.loading}>
          <Preloader />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        {/* Основные публичные маршруты */}
        {/* Главная страница конструктора заказа*/}
        <Route path='/' element={<ConstructorPage />} />

        {/* Лента заказов */}
        <Route path='/feed' element={<Feed />} />

        {/* Защищенные маршруты - только для неавторизованных */}
        {/* Страница входа */}
        <Route path='/login' element={<ProtectedRoute onlyUnauth />}>
          <Route path='/login' element={<Login />} />
        </Route>

        {/* Страница регистрации */}
        <Route path='/register' element={<ProtectedRoute onlyUnauth />}>
          <Route path='/register' element={<Register />} />
        </Route>

        {/* Страница восстановления пароля - первый шаг */}
        <Route path='/forgot-password' element={<ProtectedRoute onlyUnauth />}>
          <Route path='/forgot-password' element={<ForgotPassword />} />
        </Route>

        {/* Страница восстановления пароля - второй шаг */}
        <Route path='/reset-password' element={<ProtectedRoute onlyUnauth />}>
          <Route path='/reset-password' element={<ResetPassword />} />
        </Route>

        {/* Защищенные маршруты - только для авторизованных */}
        {/* Страница профиля */}
        <Route path='/profile' element={<ProtectedRoute />}>
          <Route path='/profile' element={<Profile />} />
        </Route>

        {/* Страница истории заказов в профиле */}
        <Route path='/profile/orders' element={<ProtectedRoute />}>
          <Route path='/profile/orders' element={<ProfileOrders />} />
        </Route>

        {/* Страница информации об ингридитенте при прямом переходе по url. Без модального окна */}
        <Route path='/ingredients/:id' element={<IngredientDetails />} />

        {/* Страница информации о заказе при прямом переходе по url. Без модального окна */}
        <Route path='/feed/:number' element={<OrderInfo />} />

        {/* Страница информации о заказе внутри истории заказов в профиле при прямом переходе по url. Без модального окна */}
        <Route path='/profile/orders/:number' element={<ProtectedRoute />}>
          <Route path='/profile/orders/:number' element={<OrderInfo />} />
        </Route>

        {/* 404 страница */}
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {/* Рендерим модальные окна поверх основного контента */}
      {background && (
        <Routes>
          {/* Окно с информацией об ингридиенте */}
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={handleModalClose}>
                <IngredientDetails />
              </Modal>
            }
          />
          {/* Окно с информациоей о заказе */}
          <Route
            path='/feed/:number'
            element={
              <Modal title='Детали заказа' onClose={handleModalClose}>
                <OrderInfo />
              </Modal>
            }
          />
          {/* Окно с информацией о заказе в профиле */}
          <Route path='/profile/orders/:number' element={<ProtectedRoute />}>
            <Route
              path='/profile/orders/:number'
              element={
                <Modal title='Детали заказа' onClose={handleModalClose}>
                  <OrderInfo />
                </Modal>
              }
            />
          </Route>
        </Routes>
      )}
    </div>
  );
};

export default App;
