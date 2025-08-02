import { FC } from 'react'

interface ToggleCheckboxProps {
  checked: boolean
  onClick: () => void
  label?: string
  color: string
}

const ToggleCheckbox: FC<ToggleCheckboxProps> = ({ checked, onClick, label, color }) => {
  return (
    <label className="flex items-center space-x-2 cursor-pointer select-none">
      <input type="checkbox" checked={checked} onClick={onClick} className="hidden" />
      <div
        className={`w-10 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out 
          ${checked ? (color ?? 'bg-green-500') : `bg-gray-300`}`}
      >
        <div
          className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out
            ${checked ? 'translate-x-4' : 'translate-x-0'}`}
        />
      </div>
      {label && <span className="text-white font-medium">{label}</span>}
    </label>
  )
}

export default ToggleCheckbox
