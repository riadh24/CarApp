// Minimal Jest setup for React Native
jest.mock('react-native', () => ({
  StyleSheet: { create: (styles) => styles },
  Platform: { OS: 'ios' },
  Alert: { alert: jest.fn() },
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
}));

global.__DEV__ = true;
