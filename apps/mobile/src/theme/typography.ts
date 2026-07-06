import { TextStyle } from 'react-native';

export const typography: Record<string, TextStyle> = {
  displayLg: {
    fontFamily: 'Geist',
    fontSize: 48,
    lineHeight: 52.8,
    fontWeight: '800',
    letterSpacing: -0.04,
  },
  headlineLg: {
    fontFamily: 'Geist',
    fontSize: 32,
    lineHeight: 38.4,
    fontWeight: '700',
    letterSpacing: -0.02,
  },
  headlineLgMobile: {
    fontFamily: 'Geist',
    fontSize: 24,
    lineHeight: 28.8,
    fontWeight: '700',
  },
  titleMd: {
    fontFamily: 'Geist',
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600',
  },
  bodyLg: {
    fontFamily: 'Inter',
    fontSize: 16,
    lineHeight: 25.6,
    fontWeight: '400',
  },
  bodySm: {
    fontFamily: 'Inter',
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '400',
  },
  chatMsg: {
    fontFamily: 'Inter',
    fontSize: 13,
    lineHeight: 18.2,
    fontWeight: '500',
    letterSpacing: 0.01,
  },
  labelCaps: {
    fontFamily: 'Geist',
    fontSize: 12,
    lineHeight: 12,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
};
