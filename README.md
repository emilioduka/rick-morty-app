# Rick & Morty Explorer

A React Native app built as part of a coding challenge. Browse Rick & Morty characters, search and filter them, view details, and save favorites that persist across sessions.

## Stack

- **Expo** (managed workflow, SDK 54)
- **expo-router** — tab group + dynamic route for character detail
- **TanStack Query v5** — infinite scroll, caching, background refetch
- **NativeWind v4 + Tailwind CSS** — styling
- **Zustand + AsyncStorage** — persisted favorites store
- **Axios** — HTTP client
- **react-native-reanimated** — entrance animations, press scale, skeleton loading
- **TypeScript** with `strict: true`

## Features

- Character list with infinite scroll
- Name search (debounced) and status filter (Alive / Dead / Unknown)
- Character detail screen
- Add / remove favorites from list cards or the detail screen
- Favorites tab with persistence across app restarts
- Skeleton loading, error, and empty states
- Dark mode support

## Getting Started

```bash
npm install
npx expo start
```

Then press `a` for Android emulator, `i` for iOS simulator, or scan the QR code with Expo Go.

## Project Structure

```
app/
  _layout.tsx              # Root layout — QueryClient, ThemeProvider
  (tabs)/
    _layout.tsx            # Tab bar config
    index.tsx              # Characters list
    favorites.tsx          # Favorites tab
  character/
    [id].tsx               # Character detail
components/
  character-card.tsx
  skeleton-card.tsx
  haptic-tab.tsx
  ui/
    icon-symbol.tsx        # Material Icons fallback (Android/web)
    icon-symbol.ios.tsx    # SF Symbols (iOS)
constants/
  theme.ts                 # Color tokens
services/
  api.ts                   # Axios client + fetch functions
store/
  favorites-store.ts       # Zustand store with AsyncStorage persistence
hooks/
  use-debounce.ts
  use-color-scheme.ts
types/
  index.ts
```

## Notes

**Decisions worth calling out:**

- **Zustand over Context + useReducer** — the persist middleware removes boilerplate and was much easier for me to understand.
- **`useInfiniteQuery` from the start** — the API is paginated, so I used infinite query directly instead of basic `useQuery` + manual page state.
- **Targeted Zustand selectors in `CharacterCard`** — each card subscribes only to whether its own character is favorited, avoiding unnecessary re-renders across the whole list when a single favorite changes.
- **Search debounce in a separate hook** — Keeps the query logic clean and the hook reusable.
- **404 → empty result** — the API returns 404 (not an empty array) when a search has no matches. The API layer intercepts this and returns an empty page so the UI shows the empty state rather than an error.
- **`expo-image` over RN's built-in `Image`** — for better memory management/caching, important since we're scrolling through a long list of thumbnails.

**Given more time:**

- Unit tests for the store and API layer
- Localization with `expo-localization` + `i18n-js`
- Optimistic favorite updates
