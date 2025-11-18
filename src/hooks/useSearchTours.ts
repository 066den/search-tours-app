import { useCallback, useRef } from 'react'
import { searchTours as searchToursUtil } from '../utils/searchTours'
import { useToursStore } from '../store/useToursStore'
import type { PricesMap } from '../types'

export const useSearchTours = () => {
  const { startSearch, setPrices, setSearchError, finishSearch, clearSearch } = useToursStore()
  const abortControllerRef = useRef<AbortController | null>(null)

  const searchTours = useCallback(
    async (countryID: string) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      abortControllerRef.current = new AbortController()

      await searchToursUtil(countryID, {
        onStart: (token, waitUntil) => {
          startSearch(token, waitUntil)
        },
        onSuccess: (prices: PricesMap) => {
          setPrices(prices)
          finishSearch()
        },
        onError: message => {
          setSearchError(message)
        },
        onAbort: () => {
          return abortControllerRef.current?.signal.aborted ?? false
        },
      })
    },
    [startSearch, setPrices, setSearchError, finishSearch]
  )

  const cancelSearch = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      clearSearch()
    }
  }, [clearSearch])

  return { searchTours, cancelSearch }
}
