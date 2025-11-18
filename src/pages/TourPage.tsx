import { useEffect, useState, useMemo } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import type { HotelDetails, PriceOffer, CountriesMap } from '../types'
import { fetchHotel, fetchPrice, fetchCountries } from '../utils/api'
import { ROUTES } from '../constants'
import HotelServices from '../components/HotelServices'
import PriceInfo from '../components/PriceInfo'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

const countriesCache = new Map<string, CountriesMap>()

const TourPage = () => {
  const { id: priceId } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const hotelId = searchParams.get('hotelId')
  const navigate = useNavigate()

  const [hotel, setHotel] = useState<HotelDetails | null>(null)
  const [priceOffer, setPriceOffer] = useState<PriceOffer | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loadedCountries, setLoadedCountries] = useState<CountriesMap>({})

  const validationError = useMemo<string | null>(() => {
    if (!priceId || !hotelId) {
      return 'Не вказано priceId або hotelId'
    }
    return null
  }, [priceId, hotelId])

  const [isLoadingState, setIsLoadingState] = useState(true)
  const isLoading = validationError ? false : isLoadingState

  const countryFlag = useMemo<string | null>(() => {
    if (!hotel?.countryId) return null
    const cached = countriesCache.get('all')
    const countries = cached || loadedCountries
    return countries[hotel.countryId]?.flag || null
  }, [hotel?.countryId, loadedCountries])

  useEffect(() => {
    if (validationError) {
      return
    }

    const timeoutId = setTimeout(() => {
      setIsLoadingState(true)
      setError(null)
    }, 0)

    const loadCountries = () => {
      const cached = countriesCache.get('all')
      if (cached) {
        return Promise.resolve(cached)
      }

      return fetchCountries()
        .then(countries => {
          countriesCache.set('all', countries)
          setLoadedCountries(countries)
          return countries
        })
        .catch(() => {
          // Ignore errors
          return {}
        })
    }

    Promise.all([
      fetchPrice(priceId!),
      fetchHotel(hotelId ? Number(hotelId) : hotelId!),
      loadCountries(),
    ])
      .then(([price, hotelData]) => {
        setPriceOffer(price)
        setHotel(hotelData)
        setIsLoadingState(false)
      })
      .catch((err: unknown) => {
        const errorMessage =
          err && typeof err === 'object' && 'message' in err
            ? String(err.message)
            : 'Не вдалося завантажити дані туру'
        setError(errorMessage)
        setIsLoadingState(false)
      })

    return () => {
      clearTimeout(timeoutId)
    }
  }, [priceId, hotelId, validationError])

  const displayError = validationError || error

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
              <p className="text-sm text-gray-600">Завантаження даних туру...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (displayError) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="rounded-lg bg-red-50 border border-red-200 p-4 mb-4">
            <p className="text-sm text-red-800">{displayError}</p>
          </div>
          <Button
            onClick={() => {
              if (validationError) {
                navigate(ROUTES.HOME)
              } else {
                navigate(-1)
              }
            }}
            variant="secondary"
          >
            {validationError ? 'На головну' : 'Назад'}
          </Button>
        </div>
      </div>
    )
  }

  if (!hotel || !priceOffer) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="rounded-lg bg-gray-50 border border-gray-200 p-6 text-center">
            <p className="text-gray-600">Дані туру не знайдено</p>
          </div>
          <div className="mt-4">
            <Button onClick={() => navigate(-1)} variant="secondary">
              Назад
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 relative">
      <div className="mb-4 fixed top-3 left-6 md:left-10 md:top-4">
        <Button onClick={() => navigate(-1)} variant="text">
          ← Назад
        </Button>
      </div>
      <div className="max-w-2xl mx-auto">
        <Card variant="default" padding="none">
          <div className="w-full h-64 bg-gray-200 overflow-hidden">
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

          <div className="p-6">
            {hotel.name && <h1 className="text-2xl font-bold text-gray-900 mb-4">{hotel.name}</h1>}

            {(hotel.countryName || hotel.cityName) && (
              <div className="flex items-center gap-2 mb-4 text-gray-600">
                {countryFlag && (
                  <img
                    src={countryFlag}
                    alt={hotel.countryName}
                    className="w-6 h-4 object-cover rounded-sm"
                  />
                )}
                <span className="text-sm">
                  {hotel.countryName && hotel.cityName
                    ? `${hotel.countryName}, ${hotel.cityName}`
                    : hotel.countryName || hotel.cityName}
                </span>
              </div>
            )}

            {hotel.description && (
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900 mb-2">Опис</h2>
                <p className="text-gray-700">{hotel.description}</p>
              </div>
            )}

            {hotel.services && (
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900 mb-3">Сервіси</h2>
                <HotelServices services={hotel.services} />
              </div>
            )}

            {priceOffer && <PriceInfo priceOffer={priceOffer} />}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default TourPage
