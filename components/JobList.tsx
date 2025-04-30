import React, { useEffect, useState, useCallback } from 'react';
import {
    FlatList,
    StyleSheet,
    RefreshControl,
    View,
    Text,
    ActivityIndicator,
} from 'react-native';
import JobCard from './JobCard';
import LoadingIndicator from './LoadingIndicator';
import ErrorState from './ErrorState';
import EmptyState from './EmptyState';
import { fetchJobs } from '../utils/api';
import useJobsStore from '../hooks/useJobsStore';
import { Job } from '../types';

interface JobListProps {
    isBookmarkScreen?: boolean;
}

const ITEM_HEIGHT = 220;

const JobList: React.FC<JobListProps> = ({ isBookmarkScreen = false }) => {
    const {
        jobs,
        bookmarkedJobs,
        loading,
        error,
        hasMore,
        currentPage,
        searchQuery,
        setJobs,
        appendJobs,
        setLoading,
        setError,
        setHasMore,
        setCurrentPage,
        initializeBookmarkedJobs
    } = useJobsStore();

    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);

    useEffect(() => {
        initializeBookmarkedJobs();
    }, []);

    useEffect(() => {
        if (!isBookmarkScreen) {
            loadJobs();
        }
    }, [isBookmarkScreen]);

    const loadJobs = async (page = 1) => {
        if (page === 1) {
            setLoading(true);
        } else {
            setLoadingMore(true);
        }

        try {
            const response = await fetchJobs(page);
            if (page === 1) {
                setJobs(response.results || []);
            } else {
                const existingJobIds = new Set(jobs.map(job => job.id));
                const uniqueNewJobs = (response.results || []).filter(
                    job => !existingJobIds.has(job.id)
                );

                if (uniqueNewJobs.length > 0) {
                    appendJobs(uniqueNewJobs);
                }
            }

            // Check if we've reached the end (API only has 3 pages)
            setHasMore(page < 3 && response.results && response.results.length > 0);
            setCurrentPage(page);
            setError(null);
        } catch (error) {
            console.error('Error loading jobs:', error);
            setError('Failed to load jobs. Please try again.');
        } finally {
            setLoading(false);
            setLoadingMore(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = useCallback(() => {
        setRefreshing(true);
        if (isBookmarkScreen) {
            initializeBookmarkedJobs();
            setRefreshing(false);
        } else {
            loadJobs(1);
        }
    }, [isBookmarkScreen]);

    const handleLoadMore = useCallback(() => {
        if (hasMore && !loading && !loadingMore && !isBookmarkScreen) {
            loadJobs(currentPage + 1);
        }
    }, [hasMore, loading, loadingMore, currentPage, isBookmarkScreen]);

    const renderFooter = useCallback(() => {
        if (loadingMore) {
            return (
                <View style={styles.footerLoading}>
                    <ActivityIndicator color="#6200ee" size="small" />
                    <Text style={styles.footerText}>Loading more jobs...</Text>
                </View>
            );
        }

        if (!hasMore && jobs.length > 0 && !isBookmarkScreen) {
            return (
                <View style={styles.footerContainer}>
                    <Text style={styles.endMessage}>No more jobs to load</Text>
                </View>
            );
        }

        return null;
    }, [loadingMore, hasMore, jobs.length, isBookmarkScreen]);

    const renderItem = useCallback(({ item }: { item: Job }) => (
        <JobCard job={item} isBookmarkScreen={isBookmarkScreen} />
    ), [isBookmarkScreen]);

    const keyExtractor = useCallback((item: Job) =>
        item.id ? item.id.toString() : Math.random().toString()
        , []);

    // Filter jobs based on search query
    const filteredJobs = React.useMemo(() => {
        const jobsToFilter = isBookmarkScreen ? bookmarkedJobs : jobs;

        if (!searchQuery.trim()) {
            return jobsToFilter;
        }

        const query = searchQuery.toLowerCase();
        return jobsToFilter.filter(job =>
            job.title?.toLowerCase().includes(query) ||
            job.company_name?.toLowerCase().includes(query) ||
            job.primary_details?.Place?.toLowerCase().includes(query) ||
            job.job_category?.toLowerCase().includes(query)
        );
    }, [jobs, bookmarkedJobs, searchQuery, isBookmarkScreen]);

    if (loading && !refreshing && jobs.length === 0 && !isBookmarkScreen) {
        return <LoadingIndicator fullscreen message="Loading jobs..." />;
    }

    if (error && jobs.length === 0 && !isBookmarkScreen) {
        return <ErrorState message={error} onRetry={() => loadJobs(1)} />;
    }

    if (filteredJobs.length === 0) {
        if (searchQuery) {
            return (
                <EmptyState
                    title="No Search Results"
                    message="No jobs match your search criteria. Try adjusting your search terms."
                    icon="file-search-outline"
                />
            );
        }

        return (
            <EmptyState
                title={isBookmarkScreen ? "No Bookmarks Yet" : "No Jobs Available"}
                message={isBookmarkScreen ?
                    "You haven't bookmarked any jobs yet. Jobs you bookmark will appear here." :
                    "There are no jobs available at the moment. Please check back later."
                }
                icon={isBookmarkScreen ? "bookmark-off-outline" : "briefcase-outline"}
            />
        );
    }

    return (
        <FlatList
            data={filteredJobs}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    colors={['#6200ee']}
                    tintColor="#6200ee"
                />
            }
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={50}
            windowSize={10}
            initialNumToRender={8}
            getItemLayout={(data, index) => ({
                length: ITEM_HEIGHT,
                offset: ITEM_HEIGHT * index,
                index,
            })}
            showsVerticalScrollIndicator={true}
        />
    );
};

const styles = StyleSheet.create({
    listContainer: {
        paddingVertical: 8,
        paddingBottom: 24,
    },
    footerContainer: {
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    endMessage: {
        fontSize: 14,
        color: '#757575',
        textAlign: 'center',
    },
    footerLoading: {
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#757575',
    },
});

export default JobList;