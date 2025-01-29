import { Stack } from 'expo-router/stack';
import React from 'react';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false, title: 'Index' }} />
      <Stack.Screen name="dashboard" options={{ headerShown: false, title: 'Home' }} />
      <Stack.Screen name="scan" options={{ headerShown: false, title: 'cameraScreen' }} />
      <Stack.Screen name="gallery" options={{ headerShown: false, title: 'Gallery' }} />

    </Stack>
  );
}
