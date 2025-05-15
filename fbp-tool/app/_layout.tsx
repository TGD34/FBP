import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform } from "react-native";

import { ErrorBoundary } from "./error-boundary";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider } from "@/context/theme-context";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { TeamLogoProvider } from "@/context/team-logo-context";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

// Create a client
const queryClient = new QueryClient();

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TeamLogoProvider>
            <StatusBar style="light" />
            <RootLayoutNav />
          </TeamLogoProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

function RootLayoutNav() {
  return (
    <Stack
      screenOptions={{
        headerBackTitle: "Back",
        headerStyle: {
          backgroundColor: "#1A1A2E",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        contentStyle: {
          backgroundColor: "#0F0F1A",
        },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="match/[id]" 
        options={{ 
          title: "Match Details",
          presentation: Platform.OS === "ios" ? "card" : "transparentModal",
        }} 
      />
      <Stack.Screen 
        name="settings/api-key" 
        options={{ 
          title: "API Key Settings",
          presentation: "modal",
        }} 
      />
      <Stack.Screen 
        name="settings/team-logos" 
        options={{ 
          title: "Team Logo Management",
          presentation: "card",
        }} 
      />
    </Stack>
  );
}