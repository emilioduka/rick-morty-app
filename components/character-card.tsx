import { Image } from 'expo-image';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Pressable, Text, TouchableOpacity, View } from 'react-native';
import { Character } from '@/types';
import { useFavoritesStore } from '@/store/favorites-store';

const STATUS_DOT: Record<Character['status'], string> = {
  Alive: 'bg-green-500',
  Dead: 'bg-red-500',
  unknown: 'bg-gray-400',
};

interface Props {
  character: Character;
  onPress: () => void;
  index?: number;
}

export function CharacterCard({ character, onPress, index = 0 }: Props) {
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();
  const favorited = isFavorite(character.id);

  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      entering={FadeInDown.delay(Math.min(index, 6) * 50).duration(350).springify()}
      style={{ marginHorizontal: 16, marginBottom: 12 }}
    >
      <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={() => { scale.value = withSpring(0.96, { damping: 15, stiffness: 300 }); }}
        onPressOut={() => { scale.value = withSpring(1, { damping: 15, stiffness: 300 }); }}
        className="flex-row items-center bg-white dark:bg-gray-800 p-3 rounded-2xl border border-gray-100 dark:border-gray-700"
        style={{ elevation: 2, shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } }}
      >
        <View style={{ width: 64, height: 64, borderRadius: 12, overflow: 'hidden' }}>
          <Image
            source={{ uri: character.image }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
          />
        </View>
        <View className="flex-1 ml-3">
          <Text className="text-base font-semibold text-gray-900 dark:text-white" numberOfLines={1}>
            {character.name}
          </Text>
          <View className="flex-row items-center gap-2 mt-1">
            <View className={`w-2 h-2 rounded-full ${STATUS_DOT[character.status]}`} />
            <Text className="text-sm text-gray-500 dark:text-gray-400">{character.status} · {character.species}</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => favorited ? removeFavorite(character.id) : addFavorite(character)}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          className="ml-3 p-1"
        >
          <Text style={{ fontSize: 22, color: favorited ? '#f43f5e' : '#d1d5db' }}>
            {favorited ? '♥' : '♡'}
          </Text>
        </TouchableOpacity>
      </Pressable>
      </Animated.View>
    </Animated.View>
  );
}
