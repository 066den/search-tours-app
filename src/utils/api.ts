import { getCountries, searchGeo, startSearchPrices, getSearchPrices, stopSearchPrices, getHotels, getHotel, getPrice } from '../api/api'
import type {
  CountriesMap,
  ErrorResponse,
  GeoResponse,
  StartSearchResponse,
  GetSearchPricesResponse,
  StopSearchResponse,
  HotelsMap,
  HotelDetails,
  PriceOffer,
} from '../types'

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

export const fetchStartSearchPrices = async (countryID: string): Promise<StartSearchResponse> => {
  const response = await startSearchPrices(countryID)
  return parseResponse<StartSearchResponse>(response)
}

export const fetchSearchPrices = async (token: string): Promise<GetSearchPricesResponse> => {
  const response = await getSearchPrices(token)
  return parseResponse<GetSearchPricesResponse>(response)
}

export const fetchStopSearchPrices = async (token: string): Promise<StopSearchResponse> => {
  const response = await stopSearchPrices(token)
  return parseResponse<StopSearchResponse>(response)
}

export const fetchHotels = async (countryID: string): Promise<HotelsMap> => {
  const response = await getHotels(countryID)
  return parseResponse<HotelsMap>(response)
}

export const fetchHotel = async (hotelId: number | string): Promise<HotelDetails> => {
  const response = await getHotel(hotelId)
  return parseResponse<HotelDetails>(response)
}

export const fetchPrice = async (priceId: string): Promise<PriceOffer> => {
  const response = await getPrice(priceId)
  return parseResponse<PriceOffer>(response)
}
