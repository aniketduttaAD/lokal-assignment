import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface EmptyStateProps {
    title?: string;
    message?: string;
    icon?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
    title = 'No Data Found',
    message = 'There are no items to display at the moment.',
    icon = 'file-search-outline'
}) => {
    return (
        <View style={styles.container}>
            <MaterialCommunityIcons name={icon as any} size={64} color="#9e9e9e" />
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
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
    title: {
        marginTop: 16,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    message: {
        marginTop: 8,
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        maxWidth: '80%',
    },
});

export default EmptyState;