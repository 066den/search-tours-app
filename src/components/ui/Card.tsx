import type { HTMLAttributes, ReactNode } from 'react'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  variant?: 'default' | 'outlined' | 'elevated'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
}

const Card = ({
  children,
  variant = 'default',
  padding = 'md',
  hover = false,
  className = '',
  ...props
}: CardProps) => {
  const baseStyles = 'bg-white rounded-lg'

  const variantStyles = {
    default: 'shadow-md',
    outlined: 'border border-gray-200',
    elevated: 'shadow-lg',
  }

  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
  }

  const hoverStyles = hover ? 'hover:shadow-lg transition-shadow duration-300 cursor-pointer' : ''

  const combinedClassName =
    `${baseStyles} ${variantStyles[variant]} ${paddingStyles[padding]} ${hoverStyles} ${className}`.trim()

  return (
    <div className={combinedClassName} {...props}>
      {children}
    </div>
  )
}

export default Card
