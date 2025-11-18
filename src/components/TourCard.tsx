import { useEffect, useState, useMemo } from 'react'
import type { Tour, CountriesMap } from '../types'
import { formatDate, formatPrice } from '../utils/format'
import { fetchCountries } from '../utils/api'
import Button from './ui/Button'
import Card from './ui/Card'

interface TourCardProps {
  tour: Tour
  onOpenPrice?: (priceId: string, hotelId?: number) => void
}

const countriesCache = new Map<string, CountriesMap>()

const TourCard = ({ tour, onOpenPrice }: TourCardProps) => {
  const { hotel, priceOffer } = tour
  const [loadedCountries, setLoadedCountries] = useState<CountriesMap>({})

  const countryFlag = useMemo<string | null>(() => {
    if (!hotel?.countryId) return null
    const cached = countriesCache.get('all')
    const countries = cached || loadedCountries
    return countries[hotel.countryId]?.flag || null
  }, [hotel?.countryId, loadedCountries])

  useEffect(() => {
    if (!hotel?.countryId) return

    const cached = countriesCache.get('all')
    if (cached) {
      return
    }

    const timeoutId = setTimeout(() => {
      fetchCountries()
        .then(countries => {
          countriesCache.set('all', countries)
          setLoadedCountries(countries)
        })
        .catch(() => {
          // Ignore errors
        })
    }, 0)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [hotel?.countryId])

  if (!hotel) {
    return null
  }

  const handleOpenPrice = () => {
    if (onOpenPrice) {
      onOpenPrice(tour.id, hotel?.id)
    }
  }

  return (
    <Card variant="default" padding="none" className="min-w-[250px] flex flex-col">
      <div className="w-full h-48 bg-gray-200 overflow-hidden">
        <img
          src={hotel.img}
          alt={hotel.name}
          className="w-full h-full object-cover"
          onError={e => {
            const target = e.target as HTMLImageElement
            target.src = 'https://via.placeholder.com/400x300?text=Hotel'
          }}
        />
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{hotel.name}</h3>

        <div className="flex items-center gap-2 mb-3 text-gray-600">
          {countryFlag && (
            <img
              src={countryFlag}
              alt={hotel.countryName}
              className="w-6 h-4 object-cover rounded-sm"
            />
          )}
          <span className="text-sm">
            {hotel.countryName}, {hotel.cityName}
          </span>
        </div>

        <div className="mb-3">
          <span className="text-sm text-gray-500">Старт туру</span>
          <p className="text-sm font-medium text-gray-900">{formatDate(priceOffer.startDate)}</p>
        </div>

        <div className="mt-auto mb-4">
          <p className="text-2xl font-bold text-gray-900">{formatPrice(priceOffer.amount)}</p>
        </div>

        <Button onClick={handleOpenPrice} variant="text">
          Відкрити ціну
        </Button>
      </div>
    </Card>
  )
}

export default TourCard
