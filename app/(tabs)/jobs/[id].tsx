import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Linking, Image, Share, Platform } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import {
    Text,
    Card,
    Button,
    IconButton,
    Divider,
    ActivityIndicator,
    Portal,
    Dialog,
    Snackbar
} from 'react-native-paper';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import useJobsStore from '../../../hooks/useJobsStore';
import { Job } from '../../../types';
import * as Haptics from 'expo-haptics';
import { Animated } from 'react-native';
import CustomChip from '@/components/Chip';

export default function JobDetailScreen() {
    const params = useLocalSearchParams();
    const jobId = params?.id ? String(params.id) : null;

    const { jobs, bookmarkedJobs, toggleBookmark } = useJobsStore();
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const [showDialog, setShowDialog] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const scrollY = React.useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (!jobId) {
            setLoading(false);
            return;
        }
        const foundJob = jobs.find(j => j.id && j.id.toString() === jobId) ||
            bookmarkedJobs.find(j => j.id && j.id.toString() === jobId);

        if (foundJob) {
            setJob(foundJob);
        }

        setLoading(false);
    }, [jobId, jobs, bookmarkedJobs]);

    const handleBookmark = useCallback(async () => {
        if (!job) return;

        try {
            if (Platform.OS === 'ios') {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            } else {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
        } catch (e) {
            console.log('Haptics error:', e);
        }

        toggleBookmark(job);

        setJob(prevJob => {
            if (prevJob) {
                return { ...prevJob, is_bookmarked: !prevJob.is_bookmarked };
            }
            return prevJob;
        });

        setSnackbarMessage(job.is_bookmarked ? 'Job removed from bookmarks' : 'Job added to bookmarks');
        setSnackbarVisible(true);
    }, [job, toggleBookmark]);

    const handleCall = () => {
        if (job?.whatsapp_no) {
            Linking.openURL(`tel:${job.whatsapp_no}`).catch(err =>
                console.error('Error opening phone dial:', err)
            );
        }
    };

    const handleWhatsapp = () => {
        if (job?.contact_preference?.whatsapp_link) {
            Linking.openURL(job.contact_preference.whatsapp_link).catch(err =>
                console.error('Error opening WhatsApp:', err)
            );
        }
    };

    const handleShare = async () => {
        if (!job) return;

        try {
            await Share.share({
                message: `Check out this job: ${job.title || 'Job Opening'} at ${job.company_name || 'Company'}. ${job.primary_details?.Salary ? `Salary: ${job.primary_details.Salary}` : ''}`,
                title: `Job Opening: ${job.title || 'Job Position'}`
            });
        } catch (error) {
            console.error('Error sharing job:', error);
            setSnackbarMessage('Failed to share job');
            setSnackbarVisible(true);
        }
    };

    const handleGoBack = () => {
        router.back();
    };

    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6200ee" />
            </View>
        );
    }

    if (!job || !jobId) {
        return (
            <View style={styles.errorContainer}>
                <MaterialIcons name="error-outline" size={64} color="#f44336" />
                <Text style={styles.errorText}>Job not found</Text>
                <Button mode="contained" onPress={handleGoBack} style={{ marginTop: 16 }}>
                    Go Back
                </Button>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Animated.View style={[
                styles.animatedHeader,
                { opacity: headerOpacity }
            ]}>
                <Text style={styles.headerTitle} numberOfLines={1}>{job.title || 'Job Details'}</Text>
            </Animated.View>

            <ScrollView
                style={styles.scrollView}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={16}
                contentContainerStyle={{ paddingBottom: 80 }}
                bounces={true}
            >
                <View style={styles.imageContainer}>
                    {job.creatives && job.creatives.length > 0 && job.creatives[0]?.file ? (
                        <Image
                            source={{ uri: job.creatives[0].file }}
                            style={styles.image}
                            resizeMode="cover"
                        />
                    ) : (
                        <View style={styles.placeholderImage}>
                            <MaterialIcons name="business" size={80} color="#bdbdbd" />
                        </View>
                    )}
                </View>

                <Card style={styles.card}>
                    <Card.Content>
                        <View style={styles.titleRow}>
                            <View style={styles.titleContainer}>
                                <Text style={styles.title}>{job.title || 'Job Position'}</Text>
                                <Text style={styles.company}>{job.company_name || 'Company'}</Text>
                            </View>
                            <View style={styles.actionButtons}>
                                <IconButton
                                    icon={job.is_bookmarked ? "bookmark" : "bookmark-outline"}
                                    iconColor={job.is_bookmarked ? "#6200ee" : "#757575"}
                                    size={24}
                                    onPress={handleBookmark}
                                    style={styles.actionButton}
                                />
                                <IconButton
                                    icon="share-variant"
                                    iconColor="#757575"
                                    size={24}
                                    onPress={handleShare}
                                    style={styles.actionButton}
                                />
                            </View>
                        </View>

                        <View style={styles.chipContainer}>
                            {job.job_tags?.map((tag, index) => (
                                <CustomChip
                                    key={index}
                                    label={tag.value}
                                    bgColor={tag.bg_color}
                                    textColor={tag.text_color}
                                />
                            ))}
                            {job.job_category ? (
                                <CustomChip label={job.job_category} bgColor="#F0F4FF" textColor="#333" />
                            ) : null}
                        </View>

                        <Divider style={styles.divider} />

                        <View style={styles.detailsContainer}>
                            <View style={styles.detailRow}>
                                <MaterialIcons name="location-on" size={20} color="#757575" />
                                <Text style={styles.detailText}>
                                    {job.primary_details?.Place || 'Location not specified'}
                                </Text>
                            </View>

                            <View style={styles.detailRow}>
                                <MaterialCommunityIcons name="currency-inr" size={20} color="#757575" />
                                <Text style={styles.detailText}>
                                    {job.primary_details?.Salary || 'Salary not specified'}
                                </Text>
                            </View>

                            <View style={styles.detailRow}>
                                <MaterialIcons name="work" size={20} color="#757575" />
                                <Text style={styles.detailText}>
                                    {job.job_hours || 'Job type not specified'}
                                </Text>
                            </View>

                            <View style={styles.detailRow}>
                                <MaterialIcons name="school" size={20} color="#757575" />
                                <Text style={styles.detailText}>
                                    {job.primary_details?.Qualification || 'Qualification not specified'}
                                </Text>
                            </View>

                            <View style={styles.detailRow}>
                                <MaterialIcons name="timer" size={20} color="#757575" />
                                <Text style={styles.detailText}>
                                    {job.primary_details?.Experience || 'Experience not specified'}
                                </Text>
                            </View>

                            <View style={styles.detailRow}>
                                <MaterialIcons name="category" size={20} color="#757575" />
                                <Text style={styles.detailText}>
                                    {job.job_category || 'Category not specified'}
                                </Text>
                            </View>

                            <View style={styles.detailRow}>
                                <MaterialIcons name="assignment" size={20} color="#757575" />
                                <Text style={styles.detailText}>
                                    {job.job_role || 'Role not specified'}
                                </Text>
                            </View>
                        </View>

                        <Divider style={styles.divider} />

                        <Text style={styles.sectionTitle}>Job Description</Text>
                        <Text style={styles.description}>{job.other_details || 'No description available'}</Text>

                        <Divider style={styles.divider} />

                        <Text style={styles.sectionTitle}>Additional Details</Text>
                        {job.contentV3 && job.contentV3.V3 && job.contentV3.V3.length > 0 ? (
                            job.contentV3.V3.map((item, index) => (
                                <View key={index} style={styles.additionalDetail}>
                                    <Text style={styles.additionalDetailKey}>{item.field_name || 'Detail'}:</Text>
                                    <Text style={styles.additionalDetailValue}>{item.field_value || 'Not specified'}</Text>
                                </View>
                            ))
                        ) : (
                            <Text style={styles.noDetails}>No additional details available</Text>
                        )}
                    </Card.Content>
                </Card>
            </ScrollView>

            <View style={styles.footer}>
                <Button
                    mode="contained"
                    icon="phone"
                    onPress={() => setShowDialog(true)}
                    style={styles.callButton}
                    contentStyle={styles.buttonContent}
                >
                    Contact Employer
                </Button>
            </View>

            <Portal>
                <Dialog visible={showDialog} onDismiss={() => setShowDialog(false)}>
                    <Dialog.Title>Contact Options</Dialog.Title>
                    <Dialog.Content>
                        <Text variant="bodyMedium">How would you like to contact the employer?</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setShowDialog(false)}>Cancel</Button>
                        <Button onPress={() => {
                            setShowDialog(false);
                            handleWhatsapp();
                        }} disabled={!job.contact_preference?.whatsapp_link}>WhatsApp</Button>
                        <Button onPress={() => {
                            setShowDialog(false);
                            handleCall();
                        }} disabled={!job.whatsapp_no}>Call</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>

            <Snackbar
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
                duration={3000}
                action={{
                    label: 'OK',
                    onPress: () => setSnackbarVisible(false),
                }}
            >
                {snackbarMessage}
            </Snackbar>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        marginTop: 16,
        fontSize: 18,
        color: '#333',
    },
    animatedHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 60,
        backgroundColor: '#fff',
        zIndex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    scrollView: {
        flex: 1,
    },
    imageContainer: {
        height: 200,
        width: '100%',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    placeholderImage: {
        width: '100%',
        height: '100%',
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        margin: 16,
        borderRadius: 12,
        marginTop: -30,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    titleContainer: {
        flex: 1,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    company: {
        fontSize: 16,
        color: '#666',
    },
    actionButtons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionButton: {
        margin: 0,
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 8,
        marginBottom: 16,
    },
    chip: {
        marginRight: 8,
        marginBottom: 8,
    },
    divider: {
        marginVertical: 16,
    },
    detailsContainer: {
        marginBottom: 16,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    detailText: {
        fontSize: 15,
        color: '#333',
        marginLeft: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    description: {
        fontSize: 15,
        color: '#333',
        lineHeight: 22,
    },
    additionalDetail: {
        marginBottom: 10,
    },
    additionalDetailKey: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#333',
    },
    additionalDetailValue: {
        fontSize: 15,
        color: '#555',
    },
    noDetails: {
        fontSize: 15,
        color: '#666',
        fontStyle: 'italic',
    },
    footer: {
        backgroundColor: '#fff',
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 5,
    },
    callButton: {
        borderRadius: 8,
    },
    buttonContent: {
        paddingVertical: 8,
    },
});