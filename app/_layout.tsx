import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { CartProvider } from '../context/CartContext';
import { LocationProvider } from '../context/LocationContext';
import { ThemeProvider as CustomThemeProvider, useTheme } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';
import '../i18n';

export const unstable_settings = {
  initialRouteName: 'signup',
};

function RootLayoutContent() {
  const { isDark } = useTheme();

  return (
    <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <LocationProvider>
        <CartProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="cart" options={{ presentation: 'modal', headerShown: false }} />
            <Stack.Screen name="location-picker" options={{ presentation: 'modal', headerShown: false }} />
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="signup" options={{ headerShown: false }} />
            <Stack.Screen name="restaurant-dashboard" options={{ headerShown: false }} />
          </Stack>
          <StatusBar style={isDark ? 'light' : 'dark'} />
        </CartProvider>
      </LocationProvider>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <CustomThemeProvider>
      <AuthProvider>
        <RootLayoutContent />
      </AuthProvider>
    </CustomThemeProvider>
  );
}
