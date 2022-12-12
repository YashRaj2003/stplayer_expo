

import React, { Component } from 'react';
import { Button, View, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import AppLoading from 'expo-app-loading';
import {
  useFonts,
  Roboto_100Thin,
  Roboto_100Thin_Italic,
  Roboto_300Light,
  Roboto_300Light_Italic,
  Roboto_400Regular,
  Roboto_400Regular_Italic,
  Roboto_500Medium,
  Roboto_500Medium_Italic,
  Roboto_700Bold,
  Roboto_700Bold_Italic,
  Roboto_900Black,
  Roboto_900Black_Italic,
} from '@expo-google-fonts/roboto';
import Login from './screens/Login';
import Signup from './screens/Signup';
import Home from './screens/Home';
import Music from './screens/Music';
import Profile from "./screens/Profile";
import Settings from "./screens/Settings";
import Videoplayer from "./screens/Videoplayer";
import { MaterialIcons, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Trending from './screens/Trending';




const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default () => {
  let [fontsLoaded] = useFonts({
    Roboto_100Thin,
    Roboto_100Thin_Italic,
    Roboto_300Light,
    Roboto_300Light_Italic,
    Roboto_400Regular,
    Roboto_400Regular_Italic,
    Roboto_500Medium,
    Roboto_500Medium_Italic,
    Roboto_700Bold,
    Roboto_700Bold_Italic,
    Roboto_900Black,
    Roboto_900Black_Italic,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }
  else return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
          <Stack.Screen name="Home" component={HomeTabs} options={{ headerShown: false }} />
          <Stack.Screen name="Videoplayer" component={Videoplayer} options={{ headerShown: false }} />
          <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
        </Stack.Navigator>


      </NavigationContainer>
    </SafeAreaProvider>
  );
}


function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 13,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let rn = route.name;
          if (rn === "Home") {
            iconName = focused ? 'home' : 'home-outline';
            return <MaterialCommunityIcons name={iconName} size={24} color={color} />
          } else if (rn === "Trending") {
            iconName = focused ? 'musical-notes' : 'musical-notes-outline';
            return <MaterialIcons name="explore" size={24} color={color} />
          }
          else if (rn === "Music") {
            iconName = focused ? 'musical-notes' : 'musical-notes-outline';
            return <Ionicons name={iconName} size={24} color={color} />
          } else if (rn == "Settings") {
            iconName = focused ? 'settings' : 'settings-outline';
            return <Ionicons name={iconName} size={24} color={color} />
          }
        }
      })}
      tabBarOptions={{
        activeTintColor: '#23C8D2',
        inactiveTintColor: 'grey',
        tabBarOptions: {
          labelStyle: {
            fontSize: 10,
            margin: 0,
            padding: 0,
          },
        }
      }}

    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Trending" component={Trending} />
      <Tab.Screen name="Music" component={Music} />
      <Tab.Screen name="Settings" component={Settings} />

    </Tab.Navigator >
  );
}