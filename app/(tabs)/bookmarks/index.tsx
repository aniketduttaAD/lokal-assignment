import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';
import JobList from '../../../components/JobList';
import SearchBar from '../../../components/SearchBar';

export default function BookmarksScreen() {
    return (
        <View style={styles.container}>
            <SearchBar />
            <JobList isBookmarkScreen={true} />
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