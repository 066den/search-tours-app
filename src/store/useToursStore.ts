import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Tour, SearchParams, PricesMap, GeoEntity } from '../types'

interface ToursState {
  tours: Tour[]
  searchParams: SearchParams
  prices: PricesMap
  isSearching: boolean
  searchError: string | null
  searchToken: string | null
  waitUntil: string | null
  hasSearched: boolean
  currentCountryID: string | null
  searchQuery: string
  selectedEntity: GeoEntity | null
  filterEntity: GeoEntity | null
  setTours: (tours: Tour[]) => void
  setSearchParams: (params: SearchParams) => void
  setPrices: (prices: PricesMap) => void
  startSearch: (token: string, waitUntil: string, countryID: string) => void
  setSearchError: (error: string | null) => void
  finishSearch: () => void
  clearSearch: () => void
  setCurrentCountryID: (countryID: string | null) => void
  setSearchQuery: (query: string) => void
  setSelectedEntity: (entity: GeoEntity | null) => void
  setFilterEntity: (entity: GeoEntity | null) => void
}

export const useToursStore = create<ToursState>()(
  persist(
    set => ({
      tours: [],
      searchParams: {},
      prices: {},
      isSearching: false,
      searchError: null,
      searchToken: null,
      waitUntil: null,
      hasSearched: false,
      currentCountryID: null,
      searchQuery: '',
      selectedEntity: null,
      filterEntity: null,
      setTours: tours => set({ tours }),
      setSearchParams: params => set({ searchParams: params }),
      setPrices: prices => set({ prices }),
      startSearch: (token, waitUntil, countryID) =>
        set({
          isSearching: true,
          searchToken: token,
          waitUntil,
          searchError: null,
          prices: {},
          hasSearched: true,
          currentCountryID: countryID,
        }),
      setSearchError: error => set({ searchError: error, isSearching: false }),
      finishSearch: () => set({ isSearching: false, searchError: null }),
      clearSearch: () =>
        set({
          isSearching: false,
          searchError: null,
          searchToken: null,
          waitUntil: null,
          hasSearched: false,
          currentCountryID: null,
          searchQuery: '',
          selectedEntity: null,
          filterEntity: null,
        }),
      setCurrentCountryID: countryID => set({ currentCountryID: countryID }),
      setSearchQuery: query => set({ searchQuery: query }),
      setSelectedEntity: entity => set({ selectedEntity: entity }),
      setFilterEntity: entity => set({ filterEntity: entity }),
    }),
    {
      name: 'tours-store',
      partialize: state => ({
        tours: state.tours,
        searchParams: state.searchParams,
        prices: state.prices,
        searchToken: state.searchToken,
        waitUntil: state.waitUntil,
        currentCountryID: state.currentCountryID,
        searchQuery: state.searchQuery,
        selectedEntity: state.selectedEntity,
        filterEntity: state.filterEntity,
      }),
    }
  )
)
