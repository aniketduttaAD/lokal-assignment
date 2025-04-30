import React from "react";
import { Text, View, StyleSheet } from "react-native";

interface ChipProps {
    label: string;
    bgColor?: string;
    textColor?: string;
}

const CustomChip: React.FC<ChipProps> = ({ label, bgColor = "#EEE", textColor = "#333" }) => {
    return (
        <View style={[styles.chip, { backgroundColor: bgColor }]}>
            <Text style={[styles.chipText, { color: textColor }]}>{label}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    chip: {
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 6,
        marginRight: 8,
        marginBottom: 8,
        alignSelf: "flex-start",
    },
    chipText: {
        fontSize: 12,
        fontWeight: "500",
    },
});

export default CustomChip;
