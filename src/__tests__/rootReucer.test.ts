import store, { RootState } from '../services/store';
import { ingredientsSlice } from '../services/slices/ingridientsSlice';
import { feedSlice } from '../services/slices/feedSlice';
import { constructorSlice } from '../services/slices/constructorSlice';
import { orderSlice } from '../services/slices/orderSlice';
import { userSlice } from '../services/slices/userSlice';
import { ordersSlice } from '../services/slices/ordersSlice';

describe('rootReducer', () => {
  test('Инициализация rootReducer возвращает корректный начальный стейт', () => {
    const initAction = { type: 'INIT_STATE' };
    const initialState = store.getState();

    expect(initialState).toEqual({
      [ingredientsSlice.name]: ingredientsSlice.getInitialState(),
      [feedSlice.name]: feedSlice.getInitialState(),
      [constructorSlice.name]: constructorSlice.getInitialState(),
      [orderSlice.name]: orderSlice.getInitialState(),
      [userSlice.name]: userSlice.getInitialState(),
      [ordersSlice.name]: ordersSlice.getInitialState()
    });
  });

  test('Неизвестное действие не изменяет стейт', () => {
    const unknownAction = { type: 'UNKNOWN_ACTION' };
    // Получаем текущее состояние
    const currentState: RootState = store.getState();
    // Диспатчим неизвестное действие
    store.dispatch(unknownAction);
    // Получаем новое состояние
    const newState = store.getState();
    expect(newState).toEqual(currentState);
  });
});
