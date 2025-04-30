import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#6200ee',
                tabBarInactiveTintColor: '#757575',
                tabBarStyle: {
                    elevation: 5,
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    shadowOffset: { width: 0, height: -2 },
                    borderTopWidth: 0.5,
                    borderTopColor: '#e0e0e0',
                    height: 60,
                    paddingBottom: 8,
                },
                headerStyle: {
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 1,
                    borderBottomColor: '#e0e0e0',
                },
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
        >
            <Tabs.Screen
                name="jobs"
                options={{
                    title: 'Jobs',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="work-outline" size={size} color={color} />
                    ),
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="bookmarks/index"
                options={{
                    title: 'Bookmarks',
                    tabBarLabel: 'Bookmarks',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="bookmark-outline" size={size} color={color} />
                    ),
                    headerShown: false,
                }}
            />
        </Tabs>
    );
}
