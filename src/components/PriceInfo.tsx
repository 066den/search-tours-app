import type { PriceOffer } from '../types'
import { formatDate, formatPrice } from '../utils/format'
import { FaCalendarAlt } from 'react-icons/fa'

interface PriceInfoProps {
  priceOffer: PriceOffer
}

const PriceInfo = ({ priceOffer }: PriceInfoProps) => {
  return (
    <div className="border-t border-gray-200 pt-4 mt-4">
      <div className="flex items-center gap-2 mb-2 text-gray-600">
        <FaCalendarAlt className="w-4 h-4" />
        <span className="text-sm">{formatDate(priceOffer.startDate)}</span>
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-gray-900">{formatPrice(priceOffer.amount)}</p>
      </div>
    </div>
  )
}

export default PriceInfo

