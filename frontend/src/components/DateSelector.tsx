import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePostActiveDate } from '../hooks/usePostActiveDate'

interface DateSelectorProps {
  dates: string[]
  initialDate: string
  onSelect: (item: string) => void
  className?: string
}

const DateSelector = ({ dates, initialDate, onSelect, className = '' }: DateSelectorProps) => {
  const [activeDate, setActiveDate] = useState(initialDate)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { postDate, success, loading, error } = usePostActiveDate()

  // Sync activeDate with initialDate prop changes
  useEffect(() => {
    setActiveDate(initialDate)
  }, [initialDate])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = async (date: string) => {
    try {
      // Update local state immediately for responsive UI
      setActiveDate(date)

      // Call the provided onSelect callback

      // Make the POST request
      await postDate(date)

      await onSelect(date)

      // Close the dropdown
      setIsOpen(false)
    } catch (error) {
      // Revert if there was an error
      setActiveDate(initialDate)
      console.error('Date selection failed:', error)
    }
  }

  return (
    activeDate && (
      <motion.div
        className={`relative ${className}`}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: 'spring',
          stiffness: 150,
          damping: 15,
          delay: 0.2,
        }}
        ref={dropdownRef}
      >
        {/* Main dropdown button */}
        <motion.button
          className="flex items-center justify-between w-full px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/30 text-white"
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          disabled={loading}
        >
          <span className="truncate">{activeDate}</span>
          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="ml-2"
          >
            ▼
          </motion.span>
        </motion.button>

        {/* Status indicators */}
        {loading && <div className="text-xs text-blue-400 mt-1">Saving...</div>}
        {error && <div className="text-xs text-red-400 mt-1">Error: {error}</div>}
        {success && <div className="text-xs text-green-400 mt-1">Saved!</div>}

        {/* Dropdown menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="absolute z-50 mt-1 w-full bg-gray-900/95 backdrop-blur-md rounded-lg border border-gray-600 shadow-lg"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              role="listbox"
            >
              <div
                className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent"
                style={{ scrollbarGutter: 'stable' }}
              >
                {dates.map((date) => (
                  <motion.button
                    key={date}
                    className={`w-full px-4 py-2 text-left text-white hover:bg-gray-700 transition-colors ${
                      date === activeDate ? 'bg-gray-600 font-medium' : ''
                    }`}
                    onClick={() => handleSelect(date)}
                    whileHover={{ backgroundColor: 'rgba(55, 65, 81, 0.8)' }}
                    whileTap={{ backgroundColor: 'rgba(55, 65, 81, 1)' }}
                    role="option"
                    aria-selected={date === activeDate}
                    disabled={loading}
                  >
                    {date}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    )
  )
}

export default DateSelector
