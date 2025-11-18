import TourCard from './TourCard'
import { useToursStore } from '../store/useToursStore'
import { useToursWithHotels } from '../hooks/useToursWithHotels'

interface ToursGridProps {
  onOpenPrice?: (priceId: string, hotelId?: number) => void
}

const ToursGrid = ({ onOpenPrice }: ToursGridProps) => {
  const { isSearching, searchError, hasSearched } = useToursStore()
  const { tours, isLoading: isLoadingHotels, error: hotelsError } = useToursWithHotels()

  if (isSearching || isLoadingHotels) {
    return (
      <div className="w-full max-w-[700px] mx-auto px-[25px] py-8">
        <div className="flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
            <p className="text-sm text-gray-600">
              {isSearching ? 'Пошук турів...' : 'Завантаження готелів...'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (searchError) {
    return (
      <div className="w-full max-w-[700px] mx-auto px-[25px] py-8">
        <div className="rounded-lg bg-red-50 border border-red-200 p-4">
          <p className="text-sm text-red-800">{searchError}</p>
        </div>
      </div>
    )
  }

  if (hotelsError) {
    return (
      <div className="w-full max-w-[700px] mx-auto px-[25px] py-8">
        <div className="rounded-lg bg-red-50 border border-red-200 p-4">
          <p className="text-sm text-red-800">{hotelsError}</p>
        </div>
      </div>
    )
  }

  if (hasSearched && tours.length === 0) {
    return (
      <div className="w-full max-w-[700px] mx-auto px-[25px] py-8">
        <div className="rounded-lg bg-gray-50 border border-gray-200 p-6 text-center">
          <p className="text-gray-600">За вашим запитом турів не знайдено</p>
        </div>
      </div>
    )
  }

  if (!hasSearched) {
    return null
  }

  return (
    <div className="w-full max-w-[700px] mx-auto px-[25px]">
      <div className="grid sm:grid-cols-2 grid-cols-1 gap-6">
        {tours.map(tour => (
          <TourCard key={tour.id} tour={tour} onOpenPrice={onOpenPrice} />
        ))}
      </div>
    </div>
  )
}

export default ToursGrid
