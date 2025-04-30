import React from 'react';
import { View, StyleSheet, Keyboard } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { Animated } from 'react-native';
import useJobsStore from '../hooks/useJobsStore';

const SearchBar = () => {
    const { searchQuery, setSearchQuery } = useJobsStore();
    const [showSearch, setShowSearch] = React.useState(false);
    const animatedValue = React.useRef(new Animated.Value(0)).current;

    const toggleSearch = () => {
        if (showSearch) {
            Animated.timing(animatedValue, {
                toValue: 0,
                duration: 200,
                useNativeDriver: false,
            }).start(() => {
                setShowSearch(false);
                setSearchQuery('');
            });
            Keyboard.dismiss();
        } else {
            setShowSearch(true);
            Animated.timing(animatedValue, {
                toValue: 1,
                duration: 200,
                useNativeDriver: false,
            }).start();
        }
    };

    const height = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 60]
    });

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    return (
        <View style={styles.container}>
            {showSearch ? (
                <Animated.View style={[styles.searchContainer, { height }]}>
                    <Searchbar
                        placeholder="Search jobs..."
                        onChangeText={handleSearch}
                        value={searchQuery}
                        style={styles.searchBar}
                        icon="arrow-left"
                        onIconPress={toggleSearch}
                        autoFocus
                    />
                </Animated.View>
            ) : (
                <View style={styles.searchButtonContainer}>
                    <Searchbar
                        placeholder="Search jobs..."
                        onChangeText={handleSearch}
                        value={searchQuery}
                        style={styles.searchBar}
                        icon="magnify"
                        onFocus={toggleSearch}
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    searchContainer: {
        overflow: 'hidden',
    },
    searchButtonContainer: {
        height: 56,
        justifyContent: 'center',
    },
    searchBar: {
        elevation: 0,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
    },
});

export default SearchBar;