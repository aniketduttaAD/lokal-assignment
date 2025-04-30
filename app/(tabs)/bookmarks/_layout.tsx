import React from 'react';
import { Stack } from 'expo-router';

export default function BookmarksLayout() {
    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#fff',
                },
                headerTintColor: '#333',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                headerShadowVisible: false,
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    title: 'Bookmarks',
                }}
            />
        </Stack>
    );
}