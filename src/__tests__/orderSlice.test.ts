import { expect } from '@jest/globals';
import {
  orderSlice,
  placeOrder,
  clearOrderState
} from '../services/slices/orderSlice';
import { OrderState } from '../services/slices/orderSlice';
import { TOrder } from '@utils-types';

describe('orderSlice', () => {
  const initialState: OrderState = {
    orderRequest: false,
    orderModalData: null,
    error: undefined
  };

  it('При состоянии pending: устанавливается orderRequest = true, ошибка = null', () => {
    const actualState = orderSlice.reducer(
      {
        ...initialState,
        error: 'Test Error'
      },
      placeOrder.pending('placeOrder', ['ingredient1', 'ingredient2'])
    );
    expect(actualState).toEqual({
      orderRequest: true,
      orderModalData: null,
      error: null
    });
  });

  it('При состоянии fulfilled: данные заказа обновляются, запрос завершен, ошибка = null', () => {
    const orderResponse = {
      success: true,
      name: 'Test order',
      order: {
        _id: '0001',
        number: 12345,
        name: 'Test Burger Order',
        status: 'pending',
        createdAt: '2024-11-15',
        updatedAt: '2024-11-15',
        ingredients: ['ingredient1', 'ingredient2']
      }
    };

    const actualState = orderSlice.reducer(
      {
        ...initialState,
        orderRequest: true
      },
      placeOrder.fulfilled(orderResponse, 'placeOrder', [
        'ingredient1',
        'ingredient2'
      ])
    );

    expect(actualState).toEqual({
      orderRequest: false,
      orderModalData: orderResponse.order,
      error: null
    });
  });

  it('При состоянии rejected: ошибка устанавливается, запрос завершен', () => {
    const errorMessage = 'Не удалось создать заказ. Попробуйте снова.';

    const actualState = orderSlice.reducer(
      {
        ...initialState,
        orderRequest: true
      },
      placeOrder.rejected(
        new Error(errorMessage),
        'placeOrder',
        ['ingredient1', 'ingredient2'],
        errorMessage
      )
    );

    expect(actualState).toEqual({
      orderRequest: false,
      orderModalData: null,
      error: errorMessage
    });
  });

  it('clearOrderState сбрасывает состояние', () => {
    const actualState = orderSlice.reducer(
      {
        orderRequest: true,
        orderModalData: {
          _id: '0001',
          number: 12345,
          name: 'Test Order',
          status: 'done',
          createdAt: '2024-11-15T10:00:00Z',
          updatedAt: '2024-11-15T10:10:00Z',
          ingredients: ['ingredient1', 'ingredient2']
        },
        error: 'Some error'
      },
      clearOrderState()
    );

    expect(actualState).toEqual({
      orderRequest: false,
      orderModalData: null,
      error: null
    });
  });
});
