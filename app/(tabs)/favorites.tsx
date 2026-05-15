import { useFavoritesStore } from '@/store/favorites-store';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

export default function FavoritesScreen() {
  const router = useRouter();
  const favorites = useFavoritesStore((state) => state.favorites);

  return (
    <View className="flex-1 bg-white">
      <Text className="text-2xl font-bold px-4 pt-12 pb-4">Favorites</Text>
      <FlatList
        data={favorites}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="flex-row items-center px-4 py-3 gap-3 border-b border-gray-100"
            onPress={() => router.push({ pathname: '/character/[id]', params: { id: item.id } })}
          >
            <Image source={{ uri: item.image }} className="w-12 h-12 rounded-full" />
            <View>
              <Text className="text-base font-medium">{item.name}</Text>
              <Text className="text-sm text-gray-500">{item.status} · {item.species}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text className="text-center mt-20 text-gray-400">No favorites yet.</Text>
        }
      />
    </View>
  );
}