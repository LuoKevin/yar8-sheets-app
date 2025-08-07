import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface SimpleModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (value: string) => void
  title?: string
  placeholder?: string
}

const SimpleModal = ({
  isOpen,
  onClose,
  onSubmit,
  title = 'Enter Text',
  placeholder = 'Type here...',
}: SimpleModalProps) => {
  const [inputValue, setInputValue] = useState('')

  const handleSubmit = () => {
    onSubmit(inputValue)
    setInputValue('')
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <h2 className="text-lg font-semibold mb-4 text-gray-800">{title}</h2>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder={placeholder}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 text-gray-800"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default SimpleModal
