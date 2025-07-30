import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'

interface LoadingInterfaceProps {
  isLoading: boolean
}

const LoadingIndicator = ({ isLoading }: LoadingInterfaceProps) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="absolute inset-0 backdrop-blur-sm z-20 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="w-16 h-16 border-4 border-white/80 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default LoadingIndicator
