import { fetchCharacter } from '@/services/api';
import { useFavoritesStore } from '@/store/favorites-store';
import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const STATUS_BADGE = {
  light: {
    Alive:   { bg: '#dcfce7', text: '#15803d' },
    Dead:    { bg: '#fee2e2', text: '#b91c1c' },
    unknown: { bg: '#f3f4f6', text: '#6b7280' },
  },
  dark: {
    Alive:   { bg: '#14532d', text: '#86efac' },
    Dead:    { bg: '#7f1d1d', text: '#fca5a5' },
    unknown: { bg: '#374151', text: '#9ca3af' },
  },
};

export default function CharacterDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme() ?? 'light';
  const { data: character, isLoading, isError } = useQuery({
    queryKey: ['character', id],
    queryFn: () => fetchCharacter(Number(id)),
  });

  const favorited = useFavoritesStore(s => character ? s.favorites.some(c => c.id === character.id) : false);
  const addFavorite = useFavoritesStore(s => s.addFavorite);
  const removeFavorite = useFavoritesStore(s => s.removeFavorite);

  if (isLoading) return (
    <View className="flex-1 bg-white dark:bg-gray-900 items-center justify-center">
      <ActivityIndicator size="large" color="#22c55e" />
    </View>
  );
  if (isError || !character) return (
    <View className="flex-1 bg-white dark:bg-gray-900 items-center justify-center">
      <Text className="text-gray-400 text-base">Character not found.</Text>
    </View>
  );

  const badge = STATUS_BADGE[colorScheme][character.status] ?? STATUS_BADGE[colorScheme].unknown;
  const isDark = colorScheme === 'dark';

  return (
    <ScrollView className="flex-1 bg-white dark:bg-gray-900">
      <Stack.Screen options={{ title: character.name }} />
      <View style={{ width: '100%', height: 300 }}>
        <Image
          source={{ uri: character.image }}
          style={{ width: '100%', height: '100%' }}
          contentFit="cover"
        />
      </View>

      <View className="p-5 gap-4">
        <View className="flex-row items-start justify-between gap-3">
          <Text className="text-2xl font-bold text-gray-900 dark:text-white flex-1" numberOfLines={2}>
            {character.name}
          </Text>
          <View style={{ backgroundColor: badge.bg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 }}>
            <Text style={{ color: badge.text, fontSize: 12, fontWeight: '600' }}>
              {character.status}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => favorited ? removeFavorite(character.id) : addFavorite(character)}
          activeOpacity={0.8}
          style={{
            backgroundColor: favorited ? (isDark ? '#2d1a1e' : '#fff1f2') : '#22c55e',
            borderWidth: favorited ? 1 : 0,
            borderColor: isDark ? '#7f1d1d' : '#fecdd3',
            paddingVertical: 12,
            borderRadius: 16,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: favorited ? (isDark ? '#f87171' : '#f43f5e') : '#fff', fontWeight: '600', fontSize: 15 }}>
            {favorited ? '♥  Remove from Favorites' : '♡  Add to Favorites'}
          </Text>
        </TouchableOpacity>

        <View className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 gap-3">
          {([
            ['Species', character.species],
            ['Gender', character.gender],
            ['Origin', character.origin.name],
            ['Last Location', character.location.name],
            ['Episodes', `${character.episode.length} appearances`],
          ] as const).map(([label, value]) => (
            <View key={label} className="flex-row justify-between">
              <Text className="text-gray-400 dark:text-gray-500 text-sm">{label}</Text>
              <Text className="text-gray-900 dark:text-gray-100 text-sm font-medium flex-1 text-right ml-4" numberOfLines={1}>
                {value}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
