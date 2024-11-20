import {
  constructorReducer,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  initialState
} from '../services/slices/constructorSlice';
import { TConstructorIngredient } from '@utils-types';

describe('constructorSlice reducer', () => {
  const mockBun: Omit<TConstructorIngredient, 'id'> = {
    _id: 'bun_id',
    name: 'Test Bun',
    type: 'bun',
    price: 50,
    proteins: 10,
    fat: 5,
    carbohydrates: 20,
    image: 'bun_image',
    image_large: 'bun_image_large',
    image_mobile: 'bun_image_mobile',
    calories: 200
  };

  const mockIngredient: Omit<TConstructorIngredient, 'id'> = {
    _id: 'ing_id',
    name: 'Test Ingredient',
    type: 'sauce',
    price: 30,
    proteins: 2,
    fat: 1,
    carbohydrates: 4,
    image: 'ing_image',
    image_large: 'ing_image_large',
    image_mobile: 'ing_image_mobile',
    calories: 50
  };

  test('добавление булки заменяет текущую', () => {
    const stateWithBun = constructorReducer(
      initialState,
      addIngredient(mockBun as TConstructorIngredient)
    );
    expect(stateWithBun.bun).toEqual(expect.objectContaining(mockBun));
    expect(stateWithBun.ingredients).toHaveLength(0);
  });

  test('добавление начинки добавляет её в список', () => {
    const stateWithIngredient = constructorReducer(
      initialState,
      addIngredient(mockIngredient as TConstructorIngredient)
    );
    expect(stateWithIngredient.ingredients).toHaveLength(1);
    const addedIngredient = stateWithIngredient.ingredients[0];
    expect(addedIngredient).toEqual(expect.objectContaining(mockIngredient));
    expect(addedIngredient.id).toBeDefined();
  });

  test('удаление ингредиента удаляет его из списка', () => {
    const stateWithIngredients = {
      ...initialState,
      ingredients: [{ ...mockIngredient, id: 'unique_id' }]
    };
    const stateAfterRemoval = constructorReducer(
      stateWithIngredients,
      removeIngredient('unique_id')
    );
    expect(stateAfterRemoval.ingredients).toHaveLength(0);
  });

  test('перемещение ингредиента изменяет его порядок', () => {
    const mockIngredients: TConstructorIngredient[] = [
      { ...mockIngredient, id: 'ing1', name: 'Ingredient 1' },
      { ...mockIngredient, id: 'ing2', name: 'Ingredient 2' },
      { ...mockIngredient, id: 'ing3', name: 'Ingredient 3' }
    ];
    const stateWithIngredients = {
      ...initialState,
      ingredients: mockIngredients
    };
    const stateAfterMove = constructorReducer(
      stateWithIngredients,
      moveIngredient({ fromIndex: 2, toIndex: 0 })
    );
    expect(stateAfterMove.ingredients[0].id).toBe('ing3');
    expect(stateAfterMove.ingredients[1].id).toBe('ing1');
    expect(stateAfterMove.ingredients[2].id).toBe('ing2');
  });

  test('очистка конструктора сбрасывает состояние', () => {
    const stateWithItems = {
      bun: { ...mockBun, id: 'unique_bun_id' },
      ingredients: [{ ...mockIngredient, id: 'unique_ing_id' }]
    };
    const stateAfterClear = constructorReducer(
      stateWithItems,
      clearConstructor()
    );
    expect(stateAfterClear).toEqual(initialState);
  });
});
