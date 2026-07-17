import { motion, useReducedMotion } from 'motion/react'

interface ZoomingNamesProps {
  names: string[]
}

const LANES = 6

const ZoomingNames = ({ names }: ZoomingNamesProps) => {
  const prefersReducedMotion = useReducedMotion()
  const visibleNames = names.filter((name) => name.trim().length > 0)

  if (prefersReducedMotion) {
    return (
      <div className="flex min-h-72 flex-wrap items-center justify-center gap-4 rounded-2xl border border-white/20 bg-black/25 p-8 backdrop-blur-sm">
        {visibleNames.map((name, index) => (
          <span
            key={`${name}-${index}`}
            className="rounded-xl border-2 border-cyan-200 bg-indigo-700 px-5 py-3 text-2xl font-extrabold text-white shadow-lg"
          >
            {name}
          </span>
        ))}
      </div>
    )
  }

  return (
    <div
      className="relative min-h-72 w-full overflow-hidden rounded-2xl border border-white/20 bg-black/25 backdrop-blur-sm"
      aria-label="Present people without a care group"
    >
      {visibleNames.map((name, index) => {
        const lane = index % LANES
        const duration = 7 + (index % 4) * 0.8
        const delay = (index % 8) * 0.85
        const travelsLeftToRight = index % 2 === 0

        return (
          <motion.div
            key={`${name}-${index}`}
            className="absolute left-0 whitespace-nowrap rounded-xl border-2 border-cyan-200 bg-indigo-700 px-5 py-3 text-2xl font-extrabold text-white shadow-lg shadow-cyan-400/30 sm:text-3xl"
            style={{ top: `calc(${lane * (100 / LANES)}% + 0.5rem)` }}
            initial={{
              x: travelsLeftToRight ? '-110%' : '100vw',
              scale: 0.45,
              opacity: 0,
            }}
            animate={{
              x: travelsLeftToRight
                ? ['-110%', '45vw', '100vw']
                : ['100vw', '45vw', '-110%'],
              scale: [0.45, 1.35, 0.75],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              repeatDelay: 0.5,
              ease: 'linear',
              times: [0, 0.48, 1],
            }}
          >
            {name}
          </motion.div>
        )
      })}
    </div>
  )
}

export default ZoomingNames
