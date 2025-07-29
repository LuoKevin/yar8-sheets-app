import React from 'react'

interface AnimatedCheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
}

const AnimatedCheckbox = ({ checked, onChange, label }: AnimatedCheckboxProps) => {
  return (
    <label className="inline-flex items-center cursor-pointer space-x-2 select-none">
      <div
        className={`relative w-5 h-5 border-2 rounded-md transition-colors duration-200
          ${checked ? 'bg-blue-600 border-blue-600' : 'border-gray-400'}`}
      >
        <svg
          className={`absolute left-0 top-0 w-full h-full stroke-white transition-opacity duration-200 ease-in-out 
            ${checked ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
          viewBox="0 0 24 24"
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="4 12 10 17 20 6" />
        </svg>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="absolute w-full h-full opacity-0 cursor-pointer"
        />
      </div>
      {label && <span className="text-sm text-gray-800">{label}</span>}
    </label>
  )
}

export default AnimatedCheckbox
