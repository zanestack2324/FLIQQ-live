import { View, Image, StyleSheet } from 'react-native';
import { colors } from '../theme';

interface CreatorAvatarProps {
  uri?: string;
  size?: number;
  isLive?: boolean;
  ringColor?: string;
}

export function CreatorAvatar({
  uri,
  size = 56,
  isLive = false,
  ringColor = colors.primary,
}: CreatorAvatarProps) {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View
        style={[
          styles.ring,
          {
            width: size + 4,
            height: size + 4,
            borderRadius: (size + 4) / 2,
            borderColor: isLive ? ringColor : 'transparent',
          },
        ]}
      >
        <View style={[styles.imageContainer, { width: size, height: size, borderRadius: size / 2 }]}>
          <Image
            source={uri ? { uri } : require('../../assets/icon.png')}
            style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  imageContainer: {
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.surface,
  },
  image: {
    objectFit: 'cover',
  },
});
