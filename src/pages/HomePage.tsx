import { useNavigate } from 'react-router-dom'
import SearchForm from '../components/ui/SearchForm'
import ToursGrid from '../components/ToursGrid'
import Card from '../components/ui/Card'
import { useSearchTours } from '../hooks/useSearchTours'
import { useToursStore } from '../store/useToursStore'
import { ROUTES } from '../constants'
import type { GeoEntity, City, Hotel } from '../types'

const HomePage = () => {
  const navigate = useNavigate()
  const { searchTours } = useSearchTours()
  const { setFilterEntity } = useToursStore()

  const handleSearchSubmit = (selectedEntity: GeoEntity | null, countryID?: string) => {
    setFilterEntity(selectedEntity)

    const targetCountryID =
      countryID ||
      (() => {
        if (!selectedEntity) return undefined
        if (selectedEntity.type === 'country') {
          return selectedEntity.id
        } else if (selectedEntity.type === 'city') {
          return (selectedEntity as City).countryId
        } else if (selectedEntity.type === 'hotel') {
          return (selectedEntity as Hotel).countryId
        }
        return undefined
      })()

    if (targetCountryID) {
      searchTours(targetCountryID)
    }
  }

  const handleOpenPrice = (priceId: string, hotelId?: number) => {
    if (!hotelId) {
      console.warn('Hotel ID is missing for tour:', priceId)
      return
    }
    const tourPath = ROUTES.TOUR_DETAILS.replace(':id', priceId)
    navigate(`${tourPath}?hotelId=${hotelId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Форма пошуку турів</h1>
        <Card variant="default" padding="md" className="mb-8">
          <SearchForm onSubmit={handleSearchSubmit} />
        </Card>

        <ToursGrid onOpenPrice={handleOpenPrice} />
      </div>
    </div>
  )
}

export default HomePage
