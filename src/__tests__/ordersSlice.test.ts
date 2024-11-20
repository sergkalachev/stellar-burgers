import { configureStore } from '@reduxjs/toolkit';
import { ordersSlice, fetchUserOrders } from '../services/slices/ordersSlice';
import * as burgerApi from '../utils/burger-api'; // Импортируем мокируемое API
import { RootState } from '../services/store'; // Импортируем тип корневого состояния, если он у вас есть

jest.mock('../utils/burger-api');

describe('ordersSlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        orders: ordersSlice.reducer
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks(); // Очищаем моки после каждого теста
  });

  const mockOrders = [
    {
      _id: 'order1',
      number: 12345,
      name: 'Test Order 1',
      status: 'done',
      ingredients: ['ingredient1', 'ingredient2'],
      createdAt: '2024-11-15T10:00:00Z',
      updatedAt: '2024-11-15T10:05:00Z'
    },
    {
      _id: 'order2',
      number: 67890,
      name: 'Test Order 2',
      status: 'pending',
      ingredients: ['ingredient3', 'ingredient4'],
      createdAt: '2024-11-16T12:00:00Z',
      updatedAt: '2024-11-16T12:05:00Z'
    }
  ];

  it('Должен установить loading = true при pending состоянии', () => {
    store.dispatch(fetchUserOrders.pending('', undefined));
    const state = store.getState() as RootState;

    expect(state.orders).toEqual({
      orders: [],
      loading: true,
      error: null
    });
  });

  it('Должен обновить список заказов при fulfilled состоянии', async () => {
    (burgerApi.getOrdersApi as jest.Mock).mockResolvedValue(mockOrders);

    await store.dispatch<any>(fetchUserOrders());
    const state = store.getState() as RootState;

    expect(state.orders).toEqual({
      orders: mockOrders,
      loading: false,
      error: null
    });
  });

  it('Должен установить ошибку при rejected состоянии', async () => {
    const mockError = 'Не удалось загрузить заказы пользователя.';
    (burgerApi.getOrdersApi as jest.Mock).mockRejectedValue(
      new Error(mockError)
    );

    await store.dispatch<any>(fetchUserOrders());
    const state = store.getState() as RootState;

    expect(state.orders).toEqual({
      orders: [],
      loading: false,
      error: mockError
    });
  });
});
