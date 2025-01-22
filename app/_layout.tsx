import { Stack } from 'expo-router/stack';
import React from 'react';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false, title: 'Index' }} />
      <Stack.Screen name="home" options={{ headerShown: false, title: 'Home' }} />
    </Stack>
  );
}
