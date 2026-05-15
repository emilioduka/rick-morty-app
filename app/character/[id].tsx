import { fetchCharacter } from '@/services/api';
import { useFavoritesStore } from '@/store/favorites-store';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function CharacterDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: character, isLoading, isError } = useQuery({
    queryKey: ['character', id],
    queryFn: () => fetchCharacter(Number(id)),
  });

  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();
  const favorited = character ? isFavorite(character.id) : false;

  if (isLoading) return (
    <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center' }}>
      <ActivityIndicator />
    </View>
  );
  if (isError || !character) return (
    <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center' }}>
      <Text className="text-center text-gray-500">Character not found.</Text>
    </View>
  );

  return (
    <ScrollView className="flex-1 bg-white">
      <Image
        source={{ uri: character.image }}
        className="w-full h-72"
        resizeMode="cover"
      />
      <View className="p-4 gap-3">
        <Text className="text-2xl font-bold">{character.name}</Text>

        <TouchableOpacity
          onPress={() => favorited ? removeFavorite(character.id) : addFavorite(character)}
          className={`py-2 px-4 rounded-full self-start ${favorited ? 'bg-red-100' : 'bg-green-100'}`}
        >
          <Text className={favorited ? 'text-red-600' : 'text-green-600'}>
            {favorited ? 'Remove from Favorites' : 'Add to Favorites'}
          </Text>
        </TouchableOpacity>

        <View className="gap-1">
          <Text className="text-gray-500">Status: <Text className="text-black font-medium">{character.status}</Text></Text>
          <Text className="text-gray-500">Species: <Text className="text-black font-medium">{character.species}</Text></Text>
          <Text className="text-gray-500">Gender: <Text className="text-black font-medium">{character.gender}</Text></Text>
          <Text className="text-gray-500">Origin: <Text className="text-black font-medium">{character.origin.name}</Text></Text>
          <Text className="text-gray-500">Location: <Text className="text-black font-medium">{character.location.name}</Text></Text>
          <Text className="text-gray-500">Episodes: <Text className="text-black font-medium">{character.episode.length}</Text></Text>
        </View>
      </View>
    </ScrollView>
  );
}