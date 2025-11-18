import { getCountries, searchGeo } from '../api/api'
import type { CountriesMap, ErrorResponse, GeoResponse } from '../types'

const parseResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error: ErrorResponse = await response.json()
    throw error
  }
  return await response.json()
}

export const fetchCountries = async (): Promise<CountriesMap> => {
  const response = await getCountries()
  return parseResponse<CountriesMap>(response)
}

export const fetchGeo = async (query: string): Promise<GeoResponse> => {
  const response = await searchGeo(query)
  return parseResponse<GeoResponse>(response)
}
