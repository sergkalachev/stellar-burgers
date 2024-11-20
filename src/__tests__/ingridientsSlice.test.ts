import { expect } from '@jest/globals';
import {
  fetchIngredients,
  ingredientsSlice,
  initialState
} from '../services/slices/ingridientsSlice';
import { TIngredient } from '@utils-types';

describe('ingredientsSlice', () => {
  it('при состоянии pending isLoad = true', () => {
    const actualState = ingredientsSlice.reducer(
      {
        ...initialState,
        error: 'Test Error'
      },
      fetchIngredients.pending('')
    );
    expect(actualState).toEqual({
      items: [],
      isLoad: true,
      error: null
    });
  });

  it('при состоянии fulfilled возвращаются данные ингредиентов', () => {
    const mockIngredients: TIngredient[] = [
      {
        _id: 'ing_0001',
        name: 'Ingredient_1',
        type: 'main',
        proteins: 10,
        fat: 5,
        carbohydrates: 20,
        calories: 200,
        price: 50,
        image: 'image_1',
        image_large: 'image_large_1',
        image_mobile: 'image_mobile_1'
      },
      {
        _id: 'ing_0002',
        name: 'Ingredient_2',
        type: 'sauce',
        proteins: 5,
        fat: 3,
        carbohydrates: 10,
        calories: 100,
        price: 20,
        image: 'image_2',
        image_large: 'image_large_2',
        image_mobile: 'image_mobile_2'
      }
    ];

    const expectedState = {
      items: mockIngredients,
      isLoad: false,
      error: null
    };

    const actualState = ingredientsSlice.reducer(
      {
        ...initialState,
        isLoad: true
      },
      fetchIngredients.fulfilled(mockIngredients, '')
    );
    expect(actualState).toEqual(expectedState);
  });

  it('при отклоненном состоянии должен заполниться error и isLoad = false', () => {
    const error = 'Some error occurred';
    const expectedState = {
      items: [],
      isLoad: false,
      error: 'Some error occurred'
    };

    const actualState = ingredientsSlice.reducer(
      {
        ...initialState,
        isLoad: true
      },
      fetchIngredients.rejected(new Error(error), '', undefined, error)
    );
    expect(actualState).toEqual(expectedState);
  });
});
