export interface Country {
  id: string
  name: string
  flag: string
}

export interface City {
  id: number
  name: string
  countryId?: string
}

export interface Hotel {
  id: number
  name: string
  img: string
  cityId: number
  cityName: string
  countryId: string
  countryName: string
}

export interface HotelDetails extends Hotel {
  description: string
  services: HotelServices
}

export interface HotelServices {
  wifi: 'yes' | 'no' | 'none'
  aquapark: 'yes' | 'no' | 'none'
  tennis_court: 'yes' | 'no' | 'none'
  laundry: 'yes' | 'no' | 'none'
  parking: 'yes' | 'no' | 'none'
}

export interface PriceOffer {
  id: string
  amount: number
  currency: 'usd'
  startDate: string
  endDate: string
  hotelID?: string
}

export type CountriesMap = Record<string, Country>
export type HotelsMap = Record<string, Hotel>
export type PricesMap = Record<string, PriceOffer>

export type GeoEntity =
  | (Country & { type: 'country' })
  | (City & { type: 'city' })
  | (Hotel & { type: 'hotel' })

export type GeoResponse = Record<string, GeoEntity>

export interface ErrorResponse {
  code: number // 400, 404, 425
  error: true
  message: string
  waitUntil?: string // ISO для 425
}

export interface StartSearchResponse {
  token: string
  waitUntil: string
}

export interface GetSearchPricesResponse {
  prices: PricesMap
}

export interface StopSearchResponse {
  status: 'cancelled'
  message: string
}

export interface Tour {
  id: string
  priceOffer: PriceOffer
  hotel?: Hotel | HotelDetails
}

export interface SearchParams {
  destination?: string
  departureCity?: string
  countryID?: string
}
