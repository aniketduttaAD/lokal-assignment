import React from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Text, Card, IconButton, Chip } from "react-native-paper";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Job } from "../types";
import useJobsStore from "../hooks/useJobsStore";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import CustomChip from "./Chip";

interface JobCardProps {
    job: Job;
    isBookmarkScreen?: boolean;
}

const JobCard: React.FC<JobCardProps> = ({ job, isBookmarkScreen = false }) => {
    const { toggleBookmark } = useJobsStore();

    if (!job) return null;

    const handlePress = () => {
        router.push(`/jobs/${job.id}`);
    };

    const handleBookmark = () => {
        if (Platform.OS === "ios") {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        } else {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        toggleBookmark(job);
    };

    return (
        <Card style={styles.card} mode='elevated' elevation={2}>
            <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
                <Card.Content style={styles.cardContent}>
                    <View style={styles.header}>
                        {job.creatives && job.creatives.length > 0 ? (
                            <Image
                                source={{ uri: job.creatives[0].thumb_url }}
                                style={styles.companyLogo}
                                resizeMode='cover'
                            />
                        ) : (
                            <View style={styles.placeholderLogo}>
                                <Text style={styles.placeholderText}>
                                    {job.company_name
                                        ? job.company_name.charAt(0).toUpperCase()
                                        : "J"}
                                </Text>
                            </View>
                        )}

                        <View style={styles.titleContainer}>
                            <Text style={styles.title} numberOfLines={2}>
                                {job.title || "Untitled Job"}
                            </Text>
                            <Text style={styles.company}>
                                {job.company_name || "Unknown Company"}
                            </Text>
                        </View>

                        <IconButton
                            icon={job.is_bookmarked ? "bookmark" : "bookmark-outline"}
                            iconColor={job.is_bookmarked ? "#6200ee" : "#757575"}
                            size={24}
                            onPress={handleBookmark}
                            style={styles.bookmarkButton}
                        />
                    </View>

                    <View style={styles.detailsContainer}>
                        <View style={styles.detailItem}>
                            <MaterialIcons name='location-on' size={16} color='#757575' />
                            <Text style={styles.detailText} numberOfLines={1}>
                                {job.primary_details?.Place || "Location not specified"}
                            </Text>
                        </View>

                        <View style={styles.detailItem}>
                            <MaterialIcons name='work' size={16} color='#757575' />
                            <Text style={styles.detailText} numberOfLines={1}>
                                {job.job_hours || "Type not specified"}
                            </Text>
                        </View>

                        <View style={styles.detailItem}>
                            <MaterialCommunityIcons
                                name='currency-inr'
                                size={16}
                                color='#757575'
                            />
                            <Text style={styles.detailText} numberOfLines={1}>
                                {job.primary_details?.Salary || "Salary not specified"}
                            </Text>
                        </View>

                        <View style={styles.detailItem}>
                            <MaterialIcons name='phone' size={16} color='#757575' />
                            <Text style={styles.detailText} numberOfLines={1}>
                                {job.whatsapp_no || "Phone not available"}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.tagsContainer}>
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
                </Card.Content>
            </TouchableOpacity>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        marginBottom: 12,
        marginHorizontal: 16,
        borderRadius: 12,
        overflow: "hidden",
    },
    cardContent: {
        padding: 12,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    companyLogo: {
        width: 50,
        height: 50,
        borderRadius: 8,
        backgroundColor: "#f0f0f0",
    },
    placeholderLogo: {
        width: 50,
        height: 50,
        borderRadius: 8,
        backgroundColor: "#e0e0e0",
        justifyContent: "center",
        alignItems: "center",
    },
    placeholderText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#9e9e9e",
    },
    titleContainer: {
        flex: 1,
        marginLeft: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 4,
    },
    company: {
        fontSize: 14,
        color: "#666",
    },
    bookmarkButton: {
        margin: 0,
    },
    detailsContainer: {
        marginBottom: 12,
    },
    detailItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6,
    },
    detailText: {
        fontSize: 14,
        color: "#555",
        marginLeft: 8,
    },
    tagsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 4,
    },
    tag: {
        marginRight: 8,
        marginBottom: 8,
    },
    categoryTag: {
        backgroundColor: "#F0F4FF",
        marginRight: 8,
        marginBottom: 8,
        height: 24,
    },
});

export default JobCard;
