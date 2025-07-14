import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import AuthStack from './AuthStack';
import DrawerNavigator from './DrawerNavigator';

const Stack = createStackNavigator();

const RootNavigator = () => {
  const isAuthenticated = useSelector(state => state.profile.isAuthenticated);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {!isAuthenticated ? (
        <Stack.Screen name="AuthFlow" component={AuthStack} />
      ) : (
        <Stack.Screen name="Main" component={DrawerNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
