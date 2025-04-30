import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

interface ErrorStateProps {
    message?: string;
    onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({
    message = 'Something went wrong. Please try again.',
    onRetry
}) => {
    return (
        <View style={styles.container}>
            <MaterialIcons name="error-outline" size={64} color="#f44336" />
            <Text style={styles.message}>{message}</Text>
            {onRetry && (
                <Button
                    mode="contained"
                    onPress={onRetry}
                    style={styles.button}
                >
                    Try Again
                </Button>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
    },
    message: {
        marginTop: 16,
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginBottom: 24,
    },
    button: {
        paddingHorizontal: 16,
    },
});

export default ErrorState;