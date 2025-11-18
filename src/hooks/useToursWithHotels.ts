import { useEffect, useState, useMemo } from 'react'
import { useToursStore } from '../store/useToursStore'
import { fetchHotels } from '../utils/api'
import { enrichToursWithHotels } from '../utils/enrichTours'
import type { Tour, HotelsMap, City, Hotel } from '../types'

const hotelsCache = new Map<string, HotelsMap>()

export const useToursWithHotels = () => {
  const { prices, currentCountryID, filterEntity } = useToursStore()
  const [loadedHotels, setLoadedHotels] = useState<HotelsMap>({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const hotels = useMemo<HotelsMap>(() => {
    if (!currentCountryID) {
      return {}
    }
    return hotelsCache.get(currentCountryID) || loadedHotels
  }, [currentCountryID, loadedHotels])

  useEffect(() => {
    if (!currentCountryID || Object.keys(prices).length === 0) {
      return
    }

    const cachedHotels = hotelsCache.get(currentCountryID)
    if (cachedHotels) {
      return
    }

    const timeoutId = setTimeout(() => {
      setIsLoading(true)
      setError(null)
    }, 0)

    fetchHotels(currentCountryID)
      .then((result: HotelsMap) => {
        hotelsCache.set(currentCountryID, result)
        setLoadedHotels(result)
        setIsLoading(false)
      })
      .catch((err: unknown) => {
        const errorMessage =
          err && typeof err === 'object' && 'message' in err
            ? String(err.message)
            : 'Failed to load hotels'
        setError(errorMessage)
        setIsLoading(false)
      })

    return () => {
      clearTimeout(timeoutId)
    }
  }, [currentCountryID, prices])

  const tours = useMemo<Tour[]>(() => {
    if (Object.keys(prices).length === 0) {
      return []
    }
    const allTours = enrichToursWithHotels(prices, hotels)

    if (!filterEntity) {
      return allTours
    }

    if (filterEntity.type === 'country') {
      return allTours
    } else if (filterEntity.type === 'city') {
      const cityId = (filterEntity as City).id
      return allTours.filter(tour => tour.hotel?.cityId === cityId)
    } else if (filterEntity.type === 'hotel') {
      const hotelId = (filterEntity as Hotel).id
      return allTours.filter(tour => tour.hotel?.id === hotelId)
    }

    return allTours
  }, [prices, hotels, filterEntity])

  return {
    tours,
    isLoading,
    error,
  }
}
