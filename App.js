// App.js
import React, { useEffect } from 'react';
// import AppNavigator from './AppNavigator';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Login from './Screens/Login';
import Signup from './Screens/Signup';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Task from './Screens/Task';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddTask from './Screens/AddTask';

const Stack = createStackNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <Nav />
    </NavigationContainer>
  )
}

const Nav = () => {

  const navigation = useNavigation()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const isToken = await AsyncStorage.getItem("token");

      if (!isToken) {
        return null;
      }

      navigation.navigate("task")

    } catch (err) {
      console.log(err)
    }
  }
  return (
    <Stack.Navigator initialRouteName="login">
      <Stack.Screen
        name="login"
        component={Login}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="signup"
        component={Signup}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="task"
        component={Task}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="addTask"
        component={AddTask}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  )
}