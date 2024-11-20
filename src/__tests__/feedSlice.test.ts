import { expect } from '@jest/globals';
import { fetchFeeds, feedSlice } from '../services/slices/feedSlice';
import { TFeedState } from '@utils-types';

describe('feedSlice', () => {
  const initialState: TFeedState = {
    orders: [],
    total: 0,
    totalToday: 0,
    error: null,
    isLoading: false
  };

  it('При состоянии pending isLoading = true а ошибки = null', () => {
    const actualState = feedSlice.reducer(
      {
        ...initialState,
        error: 'Test Error'
      },
      fetchFeeds.pending('')
    );
    expect(actualState).toEqual({
      orders: [],
      total: 0,
      totalToday: 0,
      error: null,
      isLoading: true
    });
  });

  it('При состоянии fulfilled возвращаются данные по итогам', () => {
    const orders = [
      {
        _id: '0001',
        status: 'pending',
        name: 'Order_0001',
        createdAt: '2024-11-15',
        updatedAt: '2024-11-15',
        number: 1,
        ingredients: ['ingredient1', 'ingredient2']
      }
    ];
    const total = 1;
    const totalToday = 1;

    const feedsResponse = {
      success: true,
      orders,
      total,
      totalToday
    };

    const expectedState = {
      orders,
      total,
      totalToday,
      isLoading: false,
      error: null
    };

    const actualState = feedSlice.reducer(
      {
        ...initialState,
        isLoading: true
      },
      fetchFeeds.fulfilled(feedsResponse, '')
    );
    expect(actualState).toEqual(expectedState);
  });

  it('При отклоненном состоянии должен заполниться error и isLoading = false', () => {
    const error = 'Some returned error';
    const expectedState: TFeedState = {
      orders: [],
      total: 0,
      totalToday: 0,
      error: 'Some returned error',
      isLoading: false
    };

    const actualState = feedSlice.reducer(
      {
        ...initialState,
        isLoading: true
      },
      fetchFeeds.rejected(new Error(error), '', undefined, error)
    );
    expect(actualState).toEqual(expectedState);
  });
});
