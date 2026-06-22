import React, { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { CalendarDays } from 'lucide-react-native';

const monthNames = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];
const weekDays = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 51 }, (_, index) => currentYear - index);

interface BirthDatePickerProps {
  value: string;
  onChange: (value: string) => void;
}

function parseDate(value: string): Date {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!match) return new Date();

  const day = Number(match[1]);
  const month = Number(match[2]) - 1;
  const year = Number(match[3]);
  const date = new Date(year, month, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month ||
    date.getDate() !== day
  ) {
    return new Date();
  }

  return date;
}

function formatDate(date: Date): string {
  return [
    String(date.getDate()).padStart(2, '0'),
    String(date.getMonth() + 1).padStart(2, '0'),
    date.getFullYear(),
  ].join('/');
}

function getMonthDays(year: number, month: number): Array<number | null> {
  const firstDay = new Date(year, month, 1).getDay();
  const mondayBasedOffset = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return [
    ...Array.from({ length: mondayBasedOffset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];
}

export function BirthDatePicker({ value, onChange }: BirthDatePickerProps) {
  const initialDate = useMemo(() => parseDate(value), [value]);
  const [visible, setVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [displayMonth, setDisplayMonth] = useState(initialDate.getMonth());
  const [displayYear, setDisplayYear] = useState(initialDate.getFullYear());

  useEffect(() => {
    if (visible) {
      const date = parseDate(value);
      setSelectedDate(date);
      setDisplayMonth(date.getMonth());
      setDisplayYear(date.getFullYear());
    }
  }, [value, visible]);

  const days = getMonthDays(displayYear, displayMonth);

  const selectDay = (day: number) => {
    const date = new Date(displayYear, displayMonth, day);
    setSelectedDate(date);
    onChange(formatDate(date));
    setVisible(false);
  };

  return (
    <>
      <TouchableOpacity style={styles.input} onPress={() => setVisible(true)} activeOpacity={0.8}>
        <Text style={[styles.inputText, !value && styles.placeholder]}>
          {value || 'Seleccionar fecha'}
        </Text>
        <CalendarDays size={20} color="#555" />
      </TouchableOpacity>

      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.title}>Fecha de nacimiento</Text>

            <Text style={styles.selectorLabel}>Mes</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.monthList}
            >
              {monthNames.map((month, index) => (
                <TouchableOpacity
                  key={month}
                  style={[styles.chip, displayMonth === index && styles.chipSelected]}
                  onPress={() => setDisplayMonth(index)}
                >
                  <Text style={[styles.chipText, displayMonth === index && styles.chipTextSelected]}>
                    {month}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.selectorLabel}>Año</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.yearList}
            >
              {yearOptions.map((year) => (
                <TouchableOpacity
                  key={year}
                  style={[styles.yearChip, displayYear === year && styles.chipSelected]}
                  onPress={() => setDisplayYear(year)}
                >
                  <Text style={[styles.chipText, displayYear === year && styles.chipTextSelected]}>
                    {year}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.calendarHeader}>
              {weekDays.map((day, index) => (
                <Text key={`${day}-${index}`} style={styles.weekDay}>{day}</Text>
              ))}
            </View>
            <View style={styles.calendarGrid}>
              {days.map((day, index) => {
                const isSelected =
                  day !== null &&
                  selectedDate.getDate() === day &&
                  selectedDate.getMonth() === displayMonth &&
                  selectedDate.getFullYear() === displayYear;

                return (
                  <View key={`${day ?? 'empty'}-${index}`} style={styles.daySlot}>
                    {day !== null && (
                      <TouchableOpacity
                        style={[styles.dayButton, isSelected && styles.daySelected]}
                        onPress={() => selectDay(day)}
                      >
                        <Text style={[styles.dayText, isSelected && styles.dayTextSelected]}>
                          {day}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}
            </View>

            <TouchableOpacity style={styles.cancelButton} onPress={() => setVisible(false)}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#e6e6e6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  inputText: {
    fontSize: 14,
    color: '#000',
  },
  placeholder: {
    color: '#999',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  modal: {
    width: '100%',
    maxHeight: '88%',
    borderRadius: 20,
    backgroundColor: '#fff',
    padding: 18,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    color: '#000',
    marginBottom: 14,
  },
  selectorLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
    marginTop: 6,
  },
  monthList: {
    gap: 8,
    paddingBottom: 4,
  },
  yearList: {
    gap: 8,
    paddingBottom: 10,
  },
  chip: {
    minWidth: 78,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 12,
    backgroundColor: '#f6f6f6',
  },
  yearChip: {
    minWidth: 62,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 12,
    backgroundColor: '#f6f6f6',
  },
  chipSelected: {
    borderColor: '#f39c12',
    backgroundColor: '#f39c12',
  },
  chipText: {
    fontSize: 13,
    color: '#000',
  },
  chipTextSelected: {
    color: '#fff',
    fontWeight: '700',
  },
  calendarHeader: {
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 4,
  },
  weekDay: {
    width: `${100 / 7}%`,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
    color: '#555',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  daySlot: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  daySelected: {
    backgroundColor: '#f39c12',
  },
  dayText: {
    color: '#000',
    fontSize: 14,
  },
  dayTextSelected: {
    color: '#fff',
    fontWeight: '700',
  },
  cancelButton: {
    alignSelf: 'center',
    marginTop: 12,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  cancelText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '700',
  },
});