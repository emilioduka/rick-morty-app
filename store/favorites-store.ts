import { Character } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface FavoritesState {
    favorites: Character[];
    addFavorite: (character: Character) => void;
    removeFavorite: (id: number) => void;
    isFavorite: (id: number) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
    persist(
        (set, get) => ({
            favorites: [],
            addFavorite: (character) => set((state) => ({ favorites: [...state.favorites, character] })),
            removeFavorite: (id) => set((state) => ({ favorites: state.favorites.filter((c) => c.id !== id) })),
            isFavorite: (id) => get().favorites.some((c) => c.id === id),
        }),
        {
            name: 'favorites-storage',
            storage: createJSONStorage(() => AsyncStorage)
        }
    )
)
