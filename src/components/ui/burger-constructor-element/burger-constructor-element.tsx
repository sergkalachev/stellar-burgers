import React, { FC, memo } from 'react';
import styles from './burger-constructor-element.module.css';
import { ConstructorElement } from '@zlden/react-developer-burger-ui-components';
import { BurgerConstructorElementUIProps } from './type';
import { MoveButton } from '@zlden/react-developer-burger-ui-components';
import {
  moveIngredient,
  removeIngredient
} from '../../../services/slices/constructorSlice';
import { useDispatch } from '../../../services/store';

export const BurgerConstructorElementUI: FC<BurgerConstructorElementUIProps> =
  memo(({ ingredient, index, totalItems, handleClose, ...props }) => {
    const dispatch = useDispatch();

    const moveUp = () => {
      if (index > 0) {
        dispatch(moveIngredient({ fromIndex: index, toIndex: index - 1 }));
      }
    };

    const moveDown = () => {
      if (index < totalItems - 1) {
        dispatch(moveIngredient({ fromIndex: index, toIndex: index + 1 }));
      }
    };

    const handleRemove = () => {
      dispatch(removeIngredient(ingredient.id));
    };

    return (
      <li className={`${styles.element} mb-4 mr-2`} {...props}>
        <MoveButton
          handleMoveDown={moveDown}
          handleMoveUp={moveUp}
          isUpDisabled={index === 0}
          isDownDisabled={index === totalItems - 1}
        />
        <div className={`${styles.element_fullwidth} ml-2`}>
          <ConstructorElement
            text={ingredient.name}
            price={ingredient.price}
            thumbnail={ingredient.image}
            handleClose={handleRemove}
          />
        </div>
      </li>
    );
  });
