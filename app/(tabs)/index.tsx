import { CharacterFilters, fetchCharacters } from '@/services/api';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';

const STATUS_FILTERS: Array<{label: string, value: CharacterFilters['status']}> = [
  {label: 'All', value: ''},
  {label: 'Alive', value: 'Alive'},
  {label: 'Dead', value: 'Dead'},
  {label: 'Unknown', value: 'unknown'},
]

export default function CharactersScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [status, setStatus] = useState<CharacterFilters['status']>('')

  const {data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError} =
    useInfiniteQuery({
      queryKey: ['characters', name, status],
      queryFn: ({ pageParam }) => fetchCharacters(pageParam, {name, status}),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) =>
        lastPage.info.next ? allPages.length +1 : undefined});
  
  const characters = data?.pages.flatMap((page) => page.results) ?? [];

  if (isLoading) return <ActivityIndicator className="flex-1" />;
  if (isError) return <Text className="flex-1 text-center mt-10">Ωχ αμάν...</Text>

  return (
    <View className="flex-1 bg-white">
      <TextInput
        className="mx-4 mt-4 px-4 py-2 border border-gray-300 rounded-xl"
        placeholder="Search characters..."
        value={name}
        onChangeText={setName}
      />
      <View className="flex-row gap-2 px-4 my-3">
        {STATUS_FILTERS.map((f) => (
          <TouchableOpacity
            key={f.value}
            onPress={() => setStatus(f.value)}
            className={`px-3 py-1 rounded-full border ${status === f.value ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}
          >
            <Text className={status === f.value ? 'text-white' : 'text-gray-600'}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={characters}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="flex-row items-center px-4 py-3 border-b border-gray-100"
            onPress={() => router.push({ pathname: '/character/[id]', params: { id: item.id } })}
          >
            <Text className="text-base font-medium">{item.name}</Text>
          </TouchableOpacity>
        )}
        onEndReached={() => { if (hasNextPage) fetchNextPage(); }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={isFetchingNextPage ? <ActivityIndicator className="py-4" /> : null}
        ListEmptyComponent={<Text className="text-center mt-10 text-gray-400">No characters found.</Text>}
      />
    </View>
  );
}