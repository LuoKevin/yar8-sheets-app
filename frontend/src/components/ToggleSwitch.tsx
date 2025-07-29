import { motion } from 'framer-motion'

interface ToggleSwitchProps {
  checked: boolean
  label?: string
}

const ToggleSwitch = ({ checked, label }: ToggleSwitchProps) => {
  return (
    <label className="inline-flex items-center space-x-3 cursor-pointer select-none">
      {label && <span className="text-sm text-gray-800">{label}</span>}
      <div
        className={`w-18 h-8 flex items-center px-1 rounded-full transition-colors duration-300 ${
          checked ? 'bg-red-600' : 'bg-gray-300'
        }`}
      >
        <motion.div
          className="w-5 h-5 bg-white rounded-full shadow-md"
          layout
          transition={{
            type: 'spring',
            stiffness: 700,
            damping: 30,
          }}
        />
      </div>
        <span
        className={`text-lg font-extrabold transition-colors duration-300 ${
            checked ? 'text-red-600' : 'text-gray-600'
        }`}
        style={{
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
        }}
        >
        {checked ? "GROUPS LOCKED" : "Groups unlocked"}
        </span>
    </label>
  )
}

export default ToggleSwitch
