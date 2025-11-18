import { useEffect, useRef, useState } from 'react'

export interface DropdownProps<T> {
  isOpen: boolean
  items: T[]
  isLoading?: boolean
  onSelect: (item: T) => void
  onClose?: () => void
  renderItem: (item: T) => React.ReactNode
  getItemKey: (item: T) => string | number
  emptyMessage?: string
  loadingMessage?: string
  className?: string
  maxHeight?: string
  position?: 'bottom' | 'top'
  enableKeyboardNavigation?: boolean
}

function Dropdown<T>({
  isOpen,
  items,
  isLoading = false,
  onSelect,
  onClose,
  renderItem,
  getItemKey,
  emptyMessage = 'Нічого не знайдено',
  loadingMessage = 'Завантаження...',
  className = '',
  maxHeight = 'max-h-80',
  position = 'bottom',
  enableKeyboardNavigation = true,
}: DropdownProps<T>) {
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const listRef = useRef<HTMLUListElement>(null)
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])

  const currentHighlightedIndex = !isOpen ? -1 : highlightedIndex

  useEffect(() => {
    if (currentHighlightedIndex >= 0 && itemRefs.current[currentHighlightedIndex]) {
      itemRefs.current[currentHighlightedIndex]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      })
    }
  }, [currentHighlightedIndex])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!enableKeyboardNavigation || !isOpen) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex(prev => {
          const next = prev < items.length - 1 ? prev + 1 : 0
          return next
        })
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex(prev => {
          const next = prev > 0 ? prev - 1 : items.length - 1
          return next
        })
        break
      case 'Enter':
        e.preventDefault()
        if (currentHighlightedIndex >= 0 && currentHighlightedIndex < items.length) {
          onSelect(items[currentHighlightedIndex])
        }
        break
      case 'Escape':
        e.preventDefault()
        onClose?.()
        break
    }
  }

  if (!isOpen) return null

  const positionClasses = position === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'

  return (
    <div
      className={`absolute z-10 w-full ${positionClasses} bg-white border border-gray-300 rounded-lg shadow-lg ${maxHeight} overflow-auto ${className}`}
      onKeyDown={handleKeyDown}
      role="listbox"
      tabIndex={-1}
    >
      {isLoading ? (
        <div className="px-4 py-3 text-gray-500 text-center">{loadingMessage}</div>
      ) : items.length > 0 ? (
        <ul ref={listRef} className="py-1">
          {items.map((item, index) => (
            <li key={getItemKey(item)}>
              <button
                ref={el => {
                  itemRefs.current[index] = el
                }}
                type="button"
                onClick={() => onSelect(item)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`w-full px-4 py-3 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition-colors ${
                  currentHighlightedIndex === index ? 'bg-gray-100' : ''
                }`}
                role="option"
                aria-selected={currentHighlightedIndex === index}
              >
                {renderItem(item)}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="px-4 py-3 text-gray-500 text-center">{emptyMessage}</div>
      )}
    </div>
  )
}

export default Dropdown
