import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

interface LoadingIndicatorProps {
    message?: string;
    fullscreen?: boolean;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
    message = 'Loading...',
    fullscreen = false
}) => {
    if (fullscreen) {
        return (
            <View style={styles.fullscreenContainer}>
                <ActivityIndicator size="large" color="#6200ee" />
                <Text style={styles.message}>{message}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ActivityIndicator size="small" color="#6200ee" />
            <Text style={styles.message}>{message}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    fullscreenContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    container: {
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    message: {
        marginTop: 8,
        fontSize: 14,
        color: '#555',
        textAlign: 'center',
    },
});

export default LoadingIndicator;