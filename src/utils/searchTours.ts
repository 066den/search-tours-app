import { fetchStartSearchPrices, fetchSearchPrices } from './api'
import type { ErrorResponse, PricesMap } from '../types'

const MAX_RETRIES = 2

const waitUntilTime = (waitUntil: string): Promise<void> => {
  const waitUntilDate = new Date(waitUntil).getTime()
  const now = Date.now()
  const delay = Math.max(0, waitUntilDate - now)
  return new Promise(resolve => setTimeout(resolve, delay))
}

interface SearchCallbacks {
  onStart: (token: string, waitUntil: string) => void
  onSuccess: (prices: PricesMap) => void
  onError: (message: string) => void
  onAbort?: () => boolean
}

export const searchTours = async (countryID: string, callbacks: SearchCallbacks): Promise<void> => {
  try {
    const { token, waitUntil } = await fetchStartSearchPrices(countryID)
    if (callbacks.onAbort?.()) return

    callbacks.onStart(token, waitUntil)

    const currentToken = token
    let currentWaitUntil = waitUntil
    let retryCount = 0

    while (true) {
      if (callbacks.onAbort?.()) return

      await waitUntilTime(currentWaitUntil)
      if (callbacks.onAbort?.()) return

      try {
        const pricesResponse = await fetchSearchPrices(currentToken)
        if (callbacks.onAbort?.()) return

        callbacks.onSuccess(pricesResponse.prices)
        return
      } catch (error) {
        if (callbacks.onAbort?.()) return

        const errorResponse = error as ErrorResponse

        if (errorResponse?.code === 425 && errorResponse.waitUntil) {
          currentWaitUntil = errorResponse.waitUntil
          continue
        }

        if (retryCount < MAX_RETRIES) {
          retryCount++
          await new Promise(resolve => setTimeout(resolve, 1000))
          continue
        }

        const errorMessage =
          errorResponse?.message || 'Помилка при пошуку турів. Спробуйте пізніше.'
        callbacks.onError(errorMessage)
        return
      }
    }
  } catch (error) {
    if (callbacks.onAbort?.()) return

    const errorResponse = error as ErrorResponse
    const errorMessage = errorResponse?.message || 'Помилка при пошуку турів. Спробуйте пізніше.'
    callbacks.onError(errorMessage)
  }
}
