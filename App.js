import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';

import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import DataEntryScreen from './src/screens/DataEntryScreen';
import DataListScreen from './src/screens/DataListScreen';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { DatabaseProvider } from './src/context/DatabaseContext';

const Stack = createStackNavigator();

function AppNavigator() {
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#2196F3',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {!isAuthenticated ? (
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen 
              name="Dashboard" 
              component={DashboardScreen}
              options={{ title: 'Bluetooth Data Manager' }}
            />
            <Stack.Screen 
              name="DataEntry" 
              component={DataEntryScreen}
              options={{ title: 'Add Data Entry' }}
            />
            <Stack.Screen 
              name="DataList" 
              component={DataListScreen}
              options={{ title: 'Data Records' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <PaperProvider>
      <AuthProvider>
        <DatabaseProvider>
          <AppNavigator />
          <StatusBar style="auto" />
        </DatabaseProvider>
      </AuthProvider>
    </PaperProvider>
  );
} 