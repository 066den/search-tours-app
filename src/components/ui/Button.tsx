import type { ButtonHTMLAttributes, ReactNode } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon' | 'text'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  children: ReactNode
}

const Button = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  className = '',
  children,
  type = 'button',
  ...props
}: ButtonProps) => {
  const baseStyles =
    'font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'

  const variantStyles = {
    primary:
      'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
    secondary:
      'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2',
    ghost:
      'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2',
    icon: 'bg-transparent text-gray-400 hover:text-gray-600 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2',
    text: 'bg-transparent text-blue-600 hover:text-blue-700 transition-colors text-left px-0',
  }

  const sizeStyles = {
    sm: 'py-1.5 px-3 text-sm rounded-md',
    md: `text-base rounded-lg ${variant !== 'text' ? 'px-4 py-2.5' : 'p-0'}`,
    lg: `text-base rounded-lg ${variant !== 'text' ? 'px-6 py-3' : 'p-0'}`,
  }

  const widthStyles = fullWidth ? 'w-full' : ''

  const combinedClassName =
    `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]}  ${widthStyles} ${className}`.trim()

  return (
    <button className={combinedClassName} disabled={disabled} type={type} {...props}>
      {children}
    </button>
  )
}

export default Button
