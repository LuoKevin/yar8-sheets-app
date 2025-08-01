import { motion, Variants, Transition as FMTransition } from 'framer-motion'
import { ReactNode } from 'react'

interface PageTransitionWrapperProps {
  children: ReactNode
  transition?: FMTransition
  variants?: Variants
}

const defaultVariants: Variants = {
  initial: { x: '100vw', opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: '-100vw', opacity: 0 },
}

const defaultTransition: FMTransition = {
  type: 'tween',
  duration: 0.4,
}

const PageTransitionWrapper = ({
  children,
  transition = defaultTransition,
  variants = defaultVariants,
}: PageTransitionWrapperProps) => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      transition={transition}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  )
}

export default PageTransitionWrapper
