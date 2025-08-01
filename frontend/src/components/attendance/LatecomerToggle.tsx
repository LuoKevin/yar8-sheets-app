import { motion } from 'framer-motion'

interface ToggleSwitchProps {
  checked: boolean
  label?: string
  onClick: () => void
}

const LatecomerToggle = ({ checked, label, onClick }: ToggleSwitchProps) => {
  return (
    <label className="inline-flex items-center space-x-3 cursor-pointer select-none"
      onClick={onClick}
    >
      {label && <span className="text-sm text-gray-800">{label}</span>}
      <div
        className={`w-18 h-8 flex items-center px-1 rounded-full transition-colors duration-300 ${
          checked ? 'bg-yellow-300' : 'bg-yellow-100'
        }`}
      >
        <motion.div
          className="w-5 h-5 bg-black rounded-full shadow-md"
          layout
          animate={{ x: checked ? 40 : 0 }}
          transition={{
            type: 'spring',
            stiffness: 700,
            damping: 30,
          }}
        />
      </div>
      <span
        className={`text-lg font-extrabold transition-colors duration-300 ${
          checked ? 'text-yellow-300' : 'text-yellow-100'
        }`}
        style={{
          textShadow: '2px 2px 3px rgba(0, 0, 0, 0.5)',
        }}
      >
        {checked ? 'Latecomer Mode Active!' : 'Enable Latecomer Mode'}
      </span>
    </label>
  )
}

export default LatecomerToggle
