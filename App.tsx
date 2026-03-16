import React, { useMemo, useState } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useFonts } from 'expo-font';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider, useApp } from './lib/AppContext';
import { colors } from './lib/theme';
import SplashScreen from './screens/SplashScreen';
import AuthScreen from './screens/AuthScreen';
import HomeScreen from './screens/HomeScreen';
import CoursesScreen from './screens/CoursesScreen';
import CourseDetailScreen from './screens/CourseDetailScreen';
import LecturePlayerScreen from './screens/LecturePlayerScreen';
import MaterialsScreen from './screens/MaterialsScreen';
import NotesViewerScreen from './screens/NotesViewerScreen';
import TestsScreen from './screens/TestsScreen';
import TestRunnerScreen from './screens/TestRunnerScreen';
import ResultsScreen from './screens/ResultsScreen';
import DoubtsScreen from './screens/DoubtsScreen';
import DoubtDetailScreen from './screens/DoubtDetailScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import AdminPanelScreen from './screens/AdminPanelScreen';
import { StatusBar } from 'expo-status-bar';
import {
  Montserrat_700Bold,
  Montserrat_600SemiBold,
} from '@expo-google-fonts/montserrat';
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
} from '@expo-google-fonts/poppins';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const { role } = useApp();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 0,
          height: 64,
        },
        tabBarIcon: ({ color, size }) => {
          const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
            Home: 'home',
            Courses: 'library',
            Materials: 'folder',
            Tests: 'clipboard',
            Doubts: 'help-circle',
            Admin: 'settings',
          };
          return <Ionicons name={iconMap[route.name]} color={color} size={size} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Courses" component={CoursesScreen} />
      <Tab.Screen name="Materials" component={MaterialsScreen} />
      <Tab.Screen name="Tests" component={TestsScreen} />
      <Tab.Screen name="Doubts" component={DoubtsScreen} />
      {role === 'admin' ? <Tab.Screen name="Admin" component={AdminPanelScreen} /> : null}
    </Tab.Navigator>
  );
};

const RootNavigator = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);

  const navTheme = useMemo(
    () => ({
      ...DefaultTheme,
      colors: {
        ...DefaultTheme.colors,
        background: colors.background,
      },
    }),
    []
  );

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  if (!isAuthed) {
    return <AuthScreen onDone={() => setIsAuthed(true)} />;
  }

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.card },
          headerTitleStyle: { fontFamily: 'Montserrat_700Bold' },
          headerTintColor: colors.primary,
        }}
      >
        <Stack.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="CourseDetail" component={CourseDetailScreen} options={{ title: 'Course' }} />
        <Stack.Screen name="LecturePlayer" component={LecturePlayerScreen} options={{ title: 'Lecture' }} />
        <Stack.Screen name="NotesViewer" component={NotesViewerScreen} options={{ title: 'Notes' }} />
        <Stack.Screen name="TestRunner" component={TestRunnerScreen} options={{ title: 'Test' }} />
        <Stack.Screen name="Results" component={ResultsScreen} options={{ title: 'Results' }} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Notifications' }} />
        <Stack.Screen name="DoubtDetail" component={DoubtDetailScreen} options={{ title: 'Doubt' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  const [fontsLoaded] = useFonts({
    ...Ionicons.font,
    Montserrat_700Bold,
    Montserrat_600SemiBold,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <AppProvider>
        <RootNavigator />
        <StatusBar style="dark" />
      </AppProvider>
    </SafeAreaProvider>
  );
}
