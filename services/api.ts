import { Character, PaginatedResponse } from '@/types';
import axios from "axios";

const client = axios.create({
    baseURL: 'https://rickandmortyapi.com/api',
})

export interface CharacterFilters {
    name?: string;
    status?: 'Alive' | 'Dead' | 'unknown' | '';
}

export async function fetchCharacters(
    page: number,
    filters: CharacterFilters = {}
): Promise<PaginatedResponse<Character>> {
    const params: Record<string, string> = {page: String(page)};

    if (filters.name) params.name = filters.name;
    if (filters.status) params.status = filters.status.toLowerCase();

    const {data} = await client.get<PaginatedResponse<Character>>('/character', {params})
    return data
}

export async function fetchCharacter(id: number): Promise<Character> {
    const {data} = await client.get<Character>(`/character/${id}`);
    return data;
}