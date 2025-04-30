import React from 'react';
import { View, StyleSheet } from 'react-native';
import SearchBar from '../../../components/SearchBar';
import JobList from '../../../components/JobList';

export default function JobsScreen() {
    return (
        <View style={styles.container}>
            <SearchBar />
            <JobList />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: '#fff',
        elevation: 0,
    },
    headerTitle: {
        fontWeight: 'bold',
        fontSize: 22,
    },
});