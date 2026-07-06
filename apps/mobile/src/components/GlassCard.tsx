import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, borderRadius } from '../theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  blurIntensity?: 'light' | 'heavy';
}

export function GlassCard({ children, style, blurIntensity = 'light' }: GlassCardProps) {
  return (
    <View
      style={[
        styles.base,
        blurIntensity === 'heavy' ? styles.heavy : styles.light,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  light: {
    backgroundColor: colors.glassBackground,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  heavy: {
    backgroundColor: colors.glassOverlay,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
});
