import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StepIndicatorProps {
  currentStep: number;
}

export const StepIndicator = ({ currentStep }: StepIndicatorProps) => {
  const steps = [1, 2, 3];

  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        const isActive = step <= currentStep;
        return (
          <React.Fragment key={step}>
            <View style={[styles.circle, isActive ? styles.circleActive : styles.circleInactive]}>
              <Text style={styles.text}>{step}</Text>
            </View>
            {index < steps.length - 1 && (
              <View style={[styles.line, isActive && step < currentStep ? styles.lineActive : styles.lineInactive]} />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleActive: {
    backgroundColor: '#f39c12',
  },
  circleInactive: {
    backgroundColor: '#95a5a6',
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  line: {
    width: 50,
    height: 3,
  },
  lineActive: {
    backgroundColor: '#f39c12',
  },
  lineInactive: {
    backgroundColor: '#95a5a6',
  },
});