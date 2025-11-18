import SearchForm from '../components/ui/SearchForm'
import ToursGrid from '../components/ToursGrid'
import { useSearchTours } from '../hooks/useSearchTours'
import { useToursStore } from '../store/useToursStore'
import type { GeoEntity, City, Hotel } from '../types'

function Home() {
  const { searchTours } = useSearchTours()
  const { setFilterEntity } = useToursStore()

  const handleSearchSubmit = (selectedEntity: GeoEntity | null, countryID?: string) => {
    // Save selected entity for filtering (only on submit)
    setFilterEntity(selectedEntity)

    // Use provided countryID or extract from selected entity
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

  const handleOpenPrice = (tourId: string) => {
    // TODO: Implement price opening functionality
    console.log('Open price for tour:', tourId)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Форма пошуку турів</h1>
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <SearchForm onSubmit={handleSearchSubmit} />
        </div>

        <ToursGrid onOpenPrice={handleOpenPrice} />
      </div>
    </div>
  )
}

export default Home
