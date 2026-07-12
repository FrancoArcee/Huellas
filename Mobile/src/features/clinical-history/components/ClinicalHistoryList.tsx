// ───────────────────────────────────────────────
//  Clinical History List — Horizontal list of medical cards
// ───────────────────────────────────────────────

import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
} from 'react-native';
import { ClinicalHistoryCard } from './ClinicalHistoryCard';
import type { ClinicalHistoryItem } from '@huellas/shared';
import { colors } from '../../../theme/index';

interface ClinicalHistoryListProps {
  items: ClinicalHistoryItem[];
  onEditItem?: (item: ClinicalHistoryItem) => void;
  onDeleteItem?: (item: ClinicalHistoryItem) => void;
  readOnly?: boolean;
}

export function ClinicalHistoryList({
  items,
  onEditItem,
  onDeleteItem,
  readOnly = false,
}: ClinicalHistoryListProps) {
  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Aún no agregaste un historial clínico</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ClinicalHistoryCard
          item={item}
          onEdit={onEditItem ? () => onEditItem(item) : undefined}
          onDelete={onDeleteItem ? () => onDeleteItem(item) : undefined}
          readOnly={readOnly}
        />
      )}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
    />
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'dashed',
    borderWidth: 1.5,
    borderColor: colors.gray300,
    height: 110,
    marginVertical: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.gray500,
    textAlign: 'center',
    fontWeight: '500',
  },
  listContent: {
    paddingVertical: 8,
    gap: 12,
  },
});
