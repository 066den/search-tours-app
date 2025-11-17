import { create } from 'zustand'
import type { Tour, SearchParams } from '../types'

interface ToursState {
  tours: Tour[]
  searchParams: SearchParams
  setTours: (tours: Tour[]) => void
  setSearchParams: (params: SearchParams) => void
}

export const useToursStore = create<ToursState>(set => ({
  tours: [],
  searchParams: {},
  setTours: tours => set({ tours }),
  setSearchParams: params => set({ searchParams: params }),
}))
