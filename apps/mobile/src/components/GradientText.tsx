import { Text, TextProps, StyleSheet } from 'react-native';
import { colors } from '../theme';

interface GradientTextProps extends TextProps {
  gradientColors?: string[];
}

export function GradientText({ children, style, ...props }: GradientTextProps) {
  return (
    <Text style={[styles.text, style]} {...props}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    color: colors.brandOrange,
  },
});
