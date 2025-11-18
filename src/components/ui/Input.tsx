import type { InputHTMLAttributes, ReactNode, RefObject } from 'react'
import Button from './Button'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  error?: boolean
  leftIcon?: ReactNode
  onClear?: () => void
  elementRef?: RefObject<HTMLInputElement | null>
}

const Input = ({
  size = 'md',
  fullWidth = false,
  error = false,
  leftIcon,
  onClear,
  className = '',
  disabled = false,
  value,
  elementRef,
  ...props
}: InputProps) => {
  const baseStyles =
    'border rounded-lg focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed'

  const sizeStyles = {
    sm: 'py-1.5 px-3 text-sm',
    md: 'py-3 px-4 text-base',
    lg: 'py-4 px-5 text-base',
  }

  const stateStyles = error
    ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-transparent'
    : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent'

  const widthStyles = fullWidth ? 'w-full' : ''

  const paddingStyles = leftIcon
    ? size === 'sm'
      ? 'pl-9'
      : size === 'md'
        ? 'pl-10'
        : 'pl-12'
    : onClear && value
      ? size === 'sm'
        ? 'pr-9'
        : size === 'md'
          ? 'pr-10'
          : 'pr-12'
      : ''

  const combinedClassName =
    `${baseStyles} ${sizeStyles[size]} ${stateStyles} ${widthStyles} ${paddingStyles} ${className}`.trim()

  const iconSize = size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-6 h-6'
  const iconPosition = size === 'sm' ? 'left-2.5' : size === 'md' ? 'left-3' : 'left-4'
  const rightIconPosition = size === 'sm' ? 'right-2.5' : size === 'md' ? 'right-3' : 'right-4'

  return (
    <div className={`relative ${fullWidth ? 'w-full' : ''}`}>
      {leftIcon && (
        <div
          className={`absolute ${iconPosition} top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none`}
        >
          <div className={iconSize}>{leftIcon}</div>
        </div>
      )}
      <input
        ref={elementRef}
        className={combinedClassName}
        disabled={disabled}
        value={value}
        {...props}
      />
      {onClear && value && (
        <Button
          type="button"
          variant="icon"
          size="sm"
          onClick={onClear}
          className={`absolute ${rightIconPosition} top-1/2 -translate-y-1/2`}
          aria-label="Очистити"
        >
          <svg
            className={iconSize}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Button>
      )}
    </div>
  )
}

export default Input
