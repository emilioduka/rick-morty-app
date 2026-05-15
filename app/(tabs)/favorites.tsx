import { useRouter } from 'expo-router';
import { FlatList, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CharacterCard } from '@/components/character-card';
import { useFavoritesStore } from '@/store/favorites-store';

export default function FavoritesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const favorites = useFavoritesStore((state) => state.favorites);

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-950">
      <View
        className="bg-white dark:bg-gray-900 pb-4 px-4 border-b border-gray-100 dark:border-gray-800"
        style={{ paddingTop: insets.top + 12, elevation: 3, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } }}
      >
        <Text className="text-2xl font-bold text-gray-900 dark:text-white">Favorites</Text>
      </View>
      <FlatList
        data={favorites}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item, index }) => (
          <CharacterCard
            character={item}
            index={index}
            onPress={() => router.push({ pathname: '/character/[id]', params: { id: item.id } })}
          />
        )}
        contentContainerStyle={{ paddingTop: 12, paddingBottom: 24 }}
        ListEmptyComponent={
          <View className="items-center justify-center mt-32">
            <Text className="text-5xl mb-3">🤍</Text>
            <Text className="text-gray-400 dark:text-gray-500 text-base">No favorites yet.</Text>
            <Text className="text-gray-300 dark:text-gray-600 text-sm mt-1">Add characters from their detail page.</Text>
          </View>
        }
      />
    </View>
  );
}
