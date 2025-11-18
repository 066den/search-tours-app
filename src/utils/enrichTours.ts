import type { Tour, PriceOffer, HotelsMap, PricesMap, Hotel } from '../types'

/**
 * Links tours (PriceOffer) with hotels by hotelID
 * @param prices - dictionary of tour prices
 * @param hotels - dictionary of hotels
 * @returns array of tours with linked hotels
 */
export const enrichToursWithHotels = (prices: PricesMap, hotels: HotelsMap): Tour[] => {
  return Object.values(prices).map((priceOffer: PriceOffer): Tour => {
    let hotel: Hotel | undefined

    if (priceOffer.hotelID) {
      // hotelID in PriceOffer is a string, id in Hotel is a number
      // Search for hotel by id (can be both string and number)
      hotel = Object.values(hotels).find(
        h => h.id.toString() === priceOffer.hotelID || h.id === Number(priceOffer.hotelID)
      )
    }

    return {
      id: priceOffer.id,
      priceOffer,
      hotel,
    }
  })
}
