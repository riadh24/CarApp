import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import LandingScreen from '../screens/LandingScreen';
import AuthScreen from '../screens/AuthScreen';

const Stack = createStackNavigator();

const AuthStack = () => {
  const hasSeenLanding = useSelector(state => state.profile.hasSeenLanding);
  
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
