import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { getStorageItem, removeStorageItem, setStorageItem } from '../utils';

// Auth action types
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  SET_USER: 'SET_USER',
  SET_HAS_SEEN_LANDING: 'SET_HAS_SEEN_LANDING',
  TOGGLE_THEME: 'TOGGLE_THEME',
};

// Initial auth state
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  hasSeenLanding: false,
  isDarkMode: false,
};

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };

    case AUTH_ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
      };

    case AUTH_ACTIONS.SET_HAS_SEEN_LANDING:
      return {
        ...state,
        hasSeenLanding: action.payload,
      };

    case AUTH_ACTIONS.TOGGLE_THEME:
      return {
        ...state,
        isDarkMode: !state.isDarkMode,
      };

    default:
      return state;
  }
};

// Create auth context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load persisted auth data on app start
  useEffect(() => {
    const loadAuthData = async () => {
      try {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });

        const [userData, hasSeenLanding, isDarkMode] = await Promise.all([
          getStorageItem('user'),
          getStorageItem('hasSeenLanding', false),
          getStorageItem('isDarkMode', false),
        ]);

        if (userData) {
          dispatch({ type: AUTH_ACTIONS.SET_USER, payload: userData });
        }

        dispatch({ type: AUTH_ACTIONS.SET_HAS_SEEN_LANDING, payload: hasSeenLanding });
        dispatch({ type: AUTH_ACTIONS.TOGGLE_THEME, payload: isDarkMode });

      } catch (error) {
        if (__DEV__) {
          console.error('Failed to load auth data:', error);
        }
      } finally {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    };

    loadAuthData();
  }, []);

  // Auth actions
  const login = async (userData) => {
    try {
      await setStorageItem('user', userData);
      dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: userData });
      return { success: true };
    } catch (error) {
      if (__DEV__) {
        console.error('Login failed:', error);
      }
      return { success: false, error: 'Failed to save user data' };
    }
  };

  const logout = async () => {
    try {
      await removeStorageItem('user');
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      return { success: true };
    } catch (error) {
      if (__DEV__) {
        console.error('Logout failed:', error);
      }
      return { success: false, error: 'Failed to clear user data' };
    }
  };

  const updateProfile = async (userData) => {
    try {
      await setStorageItem('user', userData);
      dispatch({ type: AUTH_ACTIONS.SET_USER, payload: userData });
      return { success: true };
    } catch (error) {
      if (__DEV__) {
        console.error('Profile update failed:', error);
      }
      return { success: false, error: 'Failed to update profile' };
    }
  };

  const setHasSeenLanding = async (value) => {
    try {
      await setStorageItem('hasSeenLanding', value);
      dispatch({ type: AUTH_ACTIONS.SET_HAS_SEEN_LANDING, payload: value });
    } catch (error) {
      if (__DEV__) {
        console.error('Failed to save landing status:', error);
      }
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme = !state.isDarkMode;
      await setStorageItem('isDarkMode', newTheme);
      dispatch({ type: AUTH_ACTIONS.TOGGLE_THEME });
    } catch (error) {
      if (__DEV__) {
        console.error('Failed to toggle theme:', error);
      }
    }
  };

  // Context value
  const contextValue = {
    // State
    ...state,
    
    // Actions
    login,
    logout,
    updateProfile,
    setHasSeenLanding,
    toggleTheme,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// Export action types for testing
export { AUTH_ACTIONS };

