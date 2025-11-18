import type { HotelServices as HotelServicesType } from '../types'
import { FaWifi, FaCar } from 'react-icons/fa'
import { MdPool, MdSportsTennis } from 'react-icons/md'
import { GiWashingMachine } from 'react-icons/gi'

interface HotelServicesProps {
  services: HotelServicesType
}

const serviceConfig = {
  wifi: { icon: FaWifi, label: 'Wi-Fi' },
  aquapark: { icon: MdPool, label: 'Басейн' },
  tennis_court: { icon: MdSportsTennis, label: 'Тенісний корт' },
  laundry: { icon: GiWashingMachine, label: 'Пральня' },
  parking: { icon: FaCar, label: 'Парковка' },
} as const

const HotelServices = ({ services }: HotelServicesProps) => {
  if (!services) {
    return null
  }

  const activeServices = Object.entries(services).filter(([, value]) => value === 'yes')

  if (activeServices.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-4">
      {activeServices.map(([key]) => {
        const config = serviceConfig[key as keyof typeof serviceConfig]
        if (!config) return null

        const Icon = config.icon
        return (
          <div key={key} className="flex items-center gap-2 text-gray-600">
            <Icon className="w-5 h-5" />
            <span className="text-sm">{config.label}</span>
          </div>
        )
      })}
    </div>
  )
}

export default HotelServices
