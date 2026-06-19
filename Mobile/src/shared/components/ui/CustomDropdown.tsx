import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, FlatList, Pressable } from 'react-native';
import { SvgProps } from 'react-native-svg';
import { theme } from '../../../theme';
import { CustomText } from './CustomText';

interface DropdownOption {
  label: string;
  value: string;
  icon?: React.FC<SvgProps>;
}

interface Props {
  label: string;
  placeholder: string;
  options: DropdownOption[];
  selectedValue?: string;
  onSelect: (value: string) => void;
}

export const CustomDropdown = ({ label, placeholder, options, selectedValue, onSelect }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(o => o.value === selectedValue);
  const selectedLabel = selectedOption?.label || '';
  const SelectedIcon = selectedOption?.icon;

  return (
    <View style={styles.container}>
      <CustomText variant="h3" style={styles.label}>
        {label}
      </CustomText>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setIsOpen(true)}
        activeOpacity={0.7}
      >
        {SelectedIcon && (
          <SelectedIcon width={20} height={20} style={{ marginRight: 8 }} />
        )}
        <CustomText
          variant="body"
          color={selectedValue ? 'textPrimary' : 'gray500'}
        >
          {selectedLabel || placeholder}
        </CustomText>
      </TouchableOpacity>
      <Modal visible={isOpen} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setIsOpen(false)}>
          <View style={styles.modalContent}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => {
                const OptionIcon = item.icon;
                return (
                  <TouchableOpacity
                    style={styles.option}
                    onPress={() => {
                      onSelect(item.value);
                      setIsOpen(false);
                    }}
                  >
                    {OptionIcon && (
                      <OptionIcon width={20} height={20} style={{ marginRight: 12 }} />
                    )}
                    <CustomText
                      variant="body"
                      style={
                        item.value === selectedValue
                          ? { color: theme.colors.primary, fontFamily: theme.typography.fontFamily.semiBold }
                          : {}
                      }
                    >
                      {item.label}
                    </CustomText>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
    width: '100%'
  },
  label: {
    marginBottom: 8,
    fontFamily: theme.typography.fontFamily.bold
  },
  input: {
    backgroundColor: theme.colors.gray100,
    borderRadius: 100,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: theme.colors.gray200,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    width: '80%',
    maxHeight: 300,
    paddingVertical: 8,
  },
  option: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
