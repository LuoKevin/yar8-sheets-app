import React, { type ReactNode } from 'react'
import { motion } from 'framer-motion'

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  className?: string
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  className = '',
}) => (
  <motion.button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`
      flex items-center justify-center
      px-4 py-2
      bg-white text-gray-900
      border border-gray-300 shadow-md
      rounded-md
      font-semibold uppercase tracking-wide
      transition duration-200 ease-in-out
      hover:bg-blue-100 hover:border-blue-400
      focus:outline-none focus:ring-2 focus:ring-blue-500
      disabled:opacity-50 disabled:cursor-not-allowed
      ${className}
    `}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    aria-disabled={disabled}
  >
    {children}
  </motion.button>
)
