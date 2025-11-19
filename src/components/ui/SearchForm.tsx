import { useState, useEffect, useRef, useCallback } from 'react'
import type { ChangeEvent, KeyboardEvent, FormEvent } from 'react'
import type { GeoEntity, Country, City, Hotel } from '../../types'
import Dropdown from './DropDown'
import { FaHotel, FaMapMarkerAlt } from 'react-icons/fa'
import Button from './Button'
import Input from './Input'
import { fetchCountries, fetchGeo } from '../../utils/api'
import { useToursStore } from '../../store/useToursStore'

interface SearchFormProps {
  onSubmit?: (selectedEntity: GeoEntity | null, countryID?: string) => void
}

const SearchForm = ({ onSubmit }: SearchFormProps) => {
  const {
    searchQuery,
    selectedEntity: savedSelectedEntity,
    setSearchQuery,
    setSelectedEntity,
    clearSearch,
  } = useToursStore()

  const { isSearching } = useToursStore()

  const [inputValue, setInputValue] = useState(() => searchQuery || '')
  const [selectedEntity, setSelectedEntityLocal] = useState<GeoEntity | null>(
    () => savedSelectedEntity
  )
  const [suggestions, setSuggestions] = useState<GeoEntity[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const inputRef = useRef<HTMLInputElement | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const loadCountries = useCallback(async () => {
    setIsLoading(true)
    try {
      const countries = await fetchCountries()
      const countryEntities: GeoEntity[] = Object.values(countries).map(country => ({
        ...country,
        type: 'country' as const,
      }))
      setSuggestions(countryEntities)
      setIsOpen(true)
    } catch (error) {
      console.error('Failed to load countries:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const performSearch = useCallback(async (query: string) => {
    setIsLoading(true)
    try {
      const results = await fetchGeo(query)
      const geoEntities: GeoEntity[] = Object.values(results)
      setSuggestions(geoEntities)
      setIsOpen(true)
    } catch (error) {
      console.error('Failed to search geo:', error)
      setSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleInputClick = () => {
    if (!inputValue && !selectedEntity) {
      loadCountries()
    } else if (selectedEntity) {
      if (selectedEntity.type === 'country') {
        loadCountries()
      } else {
        performSearch(inputValue)
      }
    } else {
      if (inputValue) {
        performSearch(inputValue)
      }
    }
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    setSearchQuery(value)
    setSelectedEntityLocal(null)
    setSelectedEntity(null)

    if (value.trim()) {
      performSearch(value)
    } else {
      setSuggestions([])
      setIsOpen(false)
    }
  }

  const handleSelectEntity = (entity: GeoEntity) => {
    setSelectedEntityLocal(entity)
    setSelectedEntity(entity)
    setInputValue(entity.name)
    setSearchQuery(entity.name)
    setIsOpen(false)
  }

  const handleClear = () => {
    setInputValue('')
    setSearchQuery('')
    setSelectedEntityLocal(null)
    setSelectedEntity(null)
    setSuggestions([])
    setIsOpen(false)
    inputRef.current?.focus()
    clearSearch()
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setIsOpen(false)
    if (onSubmit) {
      let countryID: string | undefined
      if (selectedEntity) {
        if (selectedEntity.type === 'country') {
          countryID = selectedEntity.id
        } else if (selectedEntity.type === 'city') {
          countryID = (selectedEntity as City & { countryId?: string }).countryId
        } else if (selectedEntity.type === 'hotel') {
          countryID = (selectedEntity as Hotel).countryId
        }
      }
      onSubmit(selectedEntity, countryID)
    }

    setSearchQuery(inputValue)
    if (selectedEntity) {
      setSelectedEntity(selectedEntity)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit(e)
    } else if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const getIcon = (entity: GeoEntity) => {
    switch (entity.type) {
      case 'country':
        return (
          <img src={(entity as Country).flag} alt="" className="w-6 h-4 object-cover rounded-sm" />
        )
      case 'city':
        return <FaMapMarkerAlt className="size-5 text-gray-600" />
      case 'hotel':
        return <FaHotel className="size-5 text-orange-500" />
      default:
        return null
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div ref={containerRef} className="relative mb-4">
        <div className="relative">
          <Input
            elementRef={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Оберіть напрямок подорожі"
            onClick={handleInputClick}
            onClear={handleClear}
            onKeyDown={handleKeyDown}
            fullWidth
          />
        </div>

        <Dropdown
          isOpen={isOpen}
          items={suggestions}
          isLoading={isLoading}
          onSelect={handleSelectEntity}
          onClose={() => setIsOpen(false)}
          renderItem={(entity: GeoEntity) => (
            <div className="flex items-center gap-2">
              <span className="shrink-0">{getIcon(entity)}</span>
              <span className="flex-1 text-gray-900">{entity.name}</span>
              {entity.type === 'hotel' && (
                <span className="text-sm text-gray-500">{(entity as Hotel).cityName}</span>
              )}
            </div>
          )}
          getItemKey={(entity: GeoEntity) => `${entity.type}-${entity.id}`}
          emptyMessage="Нічого не знайдено"
          loadingMessage="Завантаження..."
        />
      </div>

      <Button type="submit" size="lg" disabled={isLoading || isSearching} fullWidth>
        {isSearching ? 'Завантаження...' : 'Знайти'}
      </Button>
    </form>
  )
}

export default SearchForm
