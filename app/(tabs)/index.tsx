import { CharacterCard } from '@/components/character-card';
import { SkeletonCard } from '@/components/skeleton-card';
import { useDebounce } from '@/hooks/use-debounce';
import { CharacterFilters, fetchCharacters } from '@/services/api';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

const STATUS_FILTERS: Array<{ label: string; value: CharacterFilters['status'] }> = [
  { label: 'All', value: '' },
  { label: 'Alive', value: 'Alive' },
  { label: 'Dead', value: 'Dead' },
  { label: 'Unknown', value: 'unknown' },
];

export default function CharactersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const [name, setName] = useState('');
  const [status, setStatus] = useState<CharacterFilters['status']>('');
  const debouncedName = useDebounce(name);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, refetch, isRefetching } =
    useInfiniteQuery({
      queryKey: ['characters', debouncedName, status],
      queryFn: ({ pageParam }) => fetchCharacters(pageParam, { name: debouncedName, status }),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) =>
        lastPage.info.next ? allPages.length + 1 : undefined,
    });

  const characters = data?.pages.flatMap((page) => page.results) ?? [];

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-950">
      <View
        className="bg-white dark:bg-gray-900 pb-3 px-4 border-b border-gray-100 dark:border-gray-800"
        style={{ paddingTop: insets.top + 12, elevation: 3, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } }}
      >
        <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Characters</Text>
        <TextInput
          className="bg-gray-100 dark:bg-gray-800 px-4 py-2.5 rounded-xl text-gray-900 dark:text-white"
          placeholder="Search characters..."
          placeholderTextColor={colorScheme === 'dark' ? '#6b7280' : '#9ca3af'}
          value={name}
          onChangeText={setName}
        />
        <View className="flex-row gap-2 mt-3">
          {STATUS_FILTERS.map((f) => (
            <TouchableOpacity
              key={f.value}
              onPress={() => setStatus(f.value)}
              className={`px-3 py-1 rounded-full border ${status === f.value ? 'bg-green-500 border-green-500' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'}`}
            >
              <Text className={`text-sm font-medium ${status === f.value ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {isLoading && characters.length === 0 ? (
        <View style={{ paddingTop: 12, paddingBottom: 24 }}>
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} index={i} />)}
        </View>
      ) : (
        <FlatList
          data={characters}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item, index }) => (
            <CharacterCard
              character={item}
              index={index}
              onPress={() => router.push({ pathname: '/character/[id]', params: { id: item.id } })}
            />
          )}
          contentContainerStyle={{ paddingTop: 12, paddingBottom: 24, flexGrow: 1 }}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#22c55e" colors={['#22c55e']} />}
          onEndReached={() => { if (hasNextPage) fetchNextPage(); }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={isFetchingNextPage ? <ActivityIndicator color="#22c55e" style={{ paddingVertical: 16 }} /> : null}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center mt-32">
              {isError
                ? <Text className="text-gray-400 dark:text-gray-500 text-base">Something went wrong.</Text>
                : <Text className="text-gray-400 dark:text-gray-500 text-base">No characters found.</Text>
              }
            </View>
          }
        />
      )}
    </View>
  );
}
