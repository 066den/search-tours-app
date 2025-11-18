/**
 * Formats date from YYYY-MM-DD to DD.MM.YYYY
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}.${month}.${year}`
}

/**
 * Converts USD to UAH and formats with thousand separators
 * @param amount - amount in USD
 * @param exchangeRate - USD to UAH exchange rate (default: 37)
 * @returns formatted price string like "12 345 грн"
 */
export const formatPrice = (amount: number, exchangeRate: number = 37): string => {
  const uahAmount = Math.round(amount * exchangeRate)
  return `${uahAmount.toLocaleString('uk-UA').replace(/,/g, ' ')} грн`
}

