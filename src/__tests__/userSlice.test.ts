import { expect } from '@jest/globals';
import {
  userSlice,
  registerUser,
  IUserState,
  initialState
} from '../services/slices/userSlice';

describe('userSlice', () => {
  const mockRegisterData = {
    email: 'test@example.com',
    name: 'Test User',
    password: 'password123'
  };

  it('При состоянии pending isLoading = true, isAuthenticated = false, error = null', () => {
    const actualState = userSlice.reducer(
      {
        ...initialState,
        error: 'Previous error'
      },
      registerUser.pending('uniqueRequestId', mockRegisterData)
    );
    expect(actualState).toEqual({
      user: { name: '', email: '' },
      isLoading: true,
      isAuthenticated: false,
      error: null
    });
  });

  it('При состоянии fulfilled обновляется пользователь и аутентификация', () => {
    const userResponse = {
      success: true,
      user: {
        name: 'Test User',
        email: 'testuser@example.com'
      },
      refreshToken: 'mockRefreshToken',
      accessToken: 'mockAccessToken'
    };

    const actualState = userSlice.reducer(
      {
        ...initialState,
        isLoading: true
      },
      registerUser.fulfilled(userResponse, 'uniqueRequestId', mockRegisterData)
    );
    expect(actualState).toEqual({
      user: userResponse.user,
      isLoading: false,
      isAuthenticated: true,
      error: null
    });
  });

  it('При состоянии rejected устанавливается ошибка, аутентификация отключается', () => {
    const errorMessage = 'Failed to register user';

    const actualState = userSlice.reducer(
      {
        ...initialState,
        isLoading: true
      },
      registerUser.rejected(
        new Error(errorMessage),
        'uniqueRequestId',
        mockRegisterData,
        {}
      )
    );
    expect(actualState).toEqual({
      user: { name: '', email: '' },
      isLoading: false,
      isAuthenticated: false,
      error: errorMessage
    });
  });
});
