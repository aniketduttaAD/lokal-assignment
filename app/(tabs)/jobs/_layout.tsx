import { Stack } from 'expo-router';

export default function JobsStack() {
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
            <Stack.Screen name="index" options={{ title: 'Jobs' }} />
            <Stack.Screen name="[id]" options={{ title: 'Job Details' }} />
        </Stack>
    );
}
