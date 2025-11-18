import SearchForm from '../components/ui/SearchForm'
import { useSearchTours } from '../hooks/useSearchTours'
import { useToursStore } from '../store/useToursStore'
import type { GeoEntity } from '../types'

function Home() {
  const { searchTours } = useSearchTours()
  const { isSearching, searchError, prices, hasSearched } = useToursStore()

  const handleSearchSubmit = (_selectedEntity: GeoEntity | null, countryID?: string) => {
    if (countryID) {
      searchTours(countryID)
    }
  }
  const pricesCount = Object.keys(prices).length
  const hasResults = pricesCount > 0
  const showEmptyState = hasSearched && !isSearching && !searchError && pricesCount === 0

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Форма пошуку турів</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <SearchForm onSubmit={handleSearchSubmit} />

          {isSearching && (
            <div className="mt-6 flex items-center justify-center py-8">
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
                <p className="text-sm text-gray-600">Пошук турів...</p>
              </div>
            </div>
          )}

          {searchError && !isSearching && (
            <div className="mt-6 rounded-lg bg-red-50 border border-red-200 p-4">
              <p className="text-sm text-red-800">{searchError}</p>
            </div>
          )}

          {showEmptyState && (
            <div className="mt-6 rounded-lg bg-gray-50 border border-gray-200 p-6 text-center">
              <p className="text-gray-600">За вашим запитом турів не знайдено</p>
            </div>
          )}

          {!isSearching && !searchError && hasResults && (
            <div className="mt-6">
              <p className="text-sm text-gray-600 mb-2">Знайдено турів: {pricesCount}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home
