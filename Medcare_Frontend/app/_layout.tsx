import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>

      <Stack.Screen name="splash" />
      <Stack.Screen name="(tabs)" />

      <Stack.Screen name="drug-drug" />
      <Stack.Screen name="drug-disease" />
      <Stack.Screen name="food-drug" />
      <Stack.Screen name="age-safety" />
      <Stack.Screen name="result" />

    </Stack>
  );
}