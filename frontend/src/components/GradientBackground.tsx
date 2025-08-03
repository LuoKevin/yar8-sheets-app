import { motion, useMotionValue, animate, useMotionTemplate } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Page, usePageContext } from '../context/PageContext'

const colorThemes = [
  { start: '#000428', end: '#004e92', angle: 135 }, // Deep blue
  { start: '#004d00', end: '#00cc44', angle: 135 },
  { start: '#c28800ff', end: '#000000ff', angle: 180 },
  { start: '#ff0000', end: '#280000ff', angle: 135 }, // Red to hot pinkish red
  { start: '#2b0000', end: '#8b0000', angle: 135 }, // Scarlet dark red
  { start: '#68038d8e', end: '#ff00f7ff', angle: 135 }, // Scarlet dark red
]

const GradientBackground = () => {
  const { page } = usePageContext()
  const startColor = useMotionValue<string>(colorThemes[0].start)
  const endColor = useMotionValue<string>(colorThemes[0].end)
  const angle = useMotionValue<number>(colorThemes[0].angle)

  const background = useMotionTemplate`
    linear-gradient(${angle}deg, ${startColor}, ${endColor})
  `

  useEffect(() => {
    // Map each page string to a specific color theme index
    const pageToTheme: Record<Page, number> = {
      groups: 0,
      attendance: 1,
      latecoming: 2,
      shuffling: 3,
      locked: 4,
      care: 5
    }

    const newThemeIndex = pageToTheme[page] ?? 0
    const theme = colorThemes[newThemeIndex]

    animate(startColor, theme.start, { duration: 0.6, ease: 'easeInOut' })
    animate(endColor, theme.end, { duration: 0.6, ease: 'easeInOut' })
    animate(angle, theme.angle, { duration: 0.6, ease: 'easeInOut' })
  }, [page])

  return <motion.div className="fixed inset-0 z-0" style={{ background }} />
}

export default GradientBackground
