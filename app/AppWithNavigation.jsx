import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import NotificationInitializer from './components/NotificationInitializer';
import { AuthProvider } from './contexts/AuthContext';
import './i18n'; // Initialize i18n
import RootNavigator from './navigation/RootNavigator';
import store, { persistor } from './Store';

export default function App() {
  return (
    <AuthProvider>
      <ReduxProvider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <NavigationContainer>
            <NotificationInitializer>
              <StatusBar hidden={true} />
              <RootNavigator />
            </NotificationInitializer>
          </NavigationContainer>
        </PersistGate>
      </ReduxProvider>
    </AuthProvider>
  );
}
