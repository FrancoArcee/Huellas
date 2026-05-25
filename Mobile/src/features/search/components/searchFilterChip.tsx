import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors } from '../../../theme/index';

interface SearchFilterChipProps {
    label: string;
    onPress?: () => void;
    style?: ViewStyle;
}

export function SearchFilterChip({ label, onPress, style }: SearchFilterChipProps) {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [styles.chip, pressed && styles.chipPressed, style]}
            accessibilityRole="button"
            accessibilityLabel={`Filtro: ${label}`}
        >
            <Text style={styles.label}>{label}</Text>
            <Text>x</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.gray200,
        borderRadius: 100,
        paddingHorizontal: 14,
        paddingVertical: 8,
        gap: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.07,
        shadowRadius: 3,
        elevation: 2,
    },
    chipPressed: {
        opacity: 0.75,
        transform: [{ scale: 0.97 }],
    },
    label: {
        fontSize: 13,
        fontWeight: '500',
        color: '#222222',
    },
    icon: {
        marginTop: 1,
    },
});