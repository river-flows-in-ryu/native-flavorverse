import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Slot } from "expo-router";

import { Provider as PaperProvider } from "react-native-paper";

import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { Platform } from "react-native";

import { useColorScheme } from "@/hooks/useColorScheme";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: "#fff", // 강제로 흰색
    },
  };

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : MyTheme}>
      <PaperProvider>
        <SafeAreaProvider>
          <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <Slot />
          </SafeAreaView>
          <StatusBar style={Platform.OS === "ios" ? "dark" : "auto"} />
        </SafeAreaProvider>
      </PaperProvider>
    </ThemeProvider>
  );
}
