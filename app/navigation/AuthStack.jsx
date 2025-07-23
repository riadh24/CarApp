import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import AuthScreen from '../screens/AuthScreen';
import LandingScreen from '../screens/LandingScreen';

const Stack = createStackNavigator();

const AuthStack = () => {
  const { hasSeenLanding } = useAuth();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {!hasSeenLanding ? (
        <Stack.Screen name="Landing" component={LandingScreen} />
      ) : (
        <Stack.Screen name="Login" component={AuthScreen} />
      )}
    </Stack.Navigator>
  );
};

export default AuthStack;
