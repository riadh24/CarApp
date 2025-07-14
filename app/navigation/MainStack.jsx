import { createStackNavigator } from '@react-navigation/stack';
import CarDetail from '../screens/CarDetailNew';
import HomeScreen from '../screens/HomeScreen';
import NotificationSettingsScreen from '../screens/NotificationSettingsScreen';

const Stack = createStackNavigator();

const MainStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="CarDetail" component={CarDetail} />
      <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
    </Stack.Navigator>
  );
};

export default MainStack;
