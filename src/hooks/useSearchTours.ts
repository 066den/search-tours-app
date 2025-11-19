import { useCallback, useRef } from 'react'
import { searchTours as searchToursUtil } from '../utils/searchTours'
import { fetchStopSearchPrices } from '../utils/api'
import { useToursStore } from '../store/useToursStore'
import type { PricesMap } from '../types'

export const useSearchTours = () => {
  const { startSearch, setPrices, setSearchError, finishSearch, clearSearch, searchToken } =
    useToursStore()
  const abortControllerRef = useRef<AbortController | null>(null)
  const currentTokenRef = useRef<string | null>(null)

  const searchTours = useCallback(
    async (countryID: string) => {
      const activeToken = searchToken
      if (activeToken) {
        try {
          await fetchStopSearchPrices(activeToken)
        } catch (error) {
          console.warn('Failed to stop previous search:', error)
        }
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      abortControllerRef.current = new AbortController()

      currentTokenRef.current = null

      await searchToursUtil(countryID, {
        onStart: (token, waitUntil) => {
          currentTokenRef.current = token
          startSearch(token, waitUntil, countryID)
        },
        onSuccess: (prices: PricesMap) => {
          setPrices(prices)
          finishSearch()
          currentTokenRef.current = null
        },
        onError: message => {
          setSearchError(message)
          currentTokenRef.current = null
        },
        onAbort: () => {
          return abortControllerRef.current?.signal.aborted ?? false
        },
        isTokenValid: (token: string) => {
          return currentTokenRef.current === token
        },
      })
    },
    [searchToken, startSearch, setPrices, setSearchError, finishSearch]
  )

  const cancelSearch = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      clearSearch()
    }
  }, [clearSearch])

  return { searchTours, cancelSearch }
}
