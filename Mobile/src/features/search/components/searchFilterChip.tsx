import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle, TouchableOpacity } from 'react-native';
import { theme } from '../../../theme/index';

interface SearchFilterChipProps {
    label: string;
    onPress?: () => void;
    onRemove?: () => void;
    style?: ViewStyle;
}

export function SearchFilterChip({ label, onPress, onRemove, style }: SearchFilterChipProps) {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [styles.chip, pressed && styles.chipPressed, style]}
            accessibilityRole="button"
            accessibilityLabel={`Filtro: ${label}`}
        >
            <Text style={styles.label}>{label}</Text>
            {onRemove && (
                <TouchableOpacity
                    onPress={(e) => {
                        e.stopPropagation();
                        if (onRemove) onRemove();
                    }}
                    style={styles.removeButton}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                    <Text style={styles.removeText}>×</Text>
                </TouchableOpacity>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.white,
        borderRadius: 100,
        paddingHorizontal: 14,
        paddingVertical: 8,
        gap: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    chipPressed: {
        opacity: 0.75,
        transform: [{ scale: 0.97 }],
    },
    label: {
        fontSize: 13,
        fontFamily: theme.typography.fontFamily.medium,
        color: theme.colors.textPrimary,
    },
    removeButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 2,
    },
    removeText: {
        fontSize: 16,
        color: theme.colors.textSecondary,
        fontFamily: theme.typography.fontFamily.bold,
        lineHeight: 16,
    },
});