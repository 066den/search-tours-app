import SearchForm from '../components/ui/SearchForm'
import type { GeoEntity } from '../types'

function Home() {
  const handleSearchSubmit = (selectedEntity: GeoEntity | null) => {
    if (selectedEntity) {
      console.log('Selected entity:', selectedEntity)
    } else {
      console.log('No entity selected')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Форма пошуку турів</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <SearchForm onSubmit={handleSearchSubmit} />
        </div>
      </div>
    </div>
  )
}

export default Home
