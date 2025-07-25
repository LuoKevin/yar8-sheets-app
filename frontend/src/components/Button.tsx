// src/components/Button.tsx
import React, { type ReactNode } from "react"
import { motion } from "framer-motion"

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
	children,
	onClick,
	disabled = false,
	className = "",
}) => (
	<motion.button
		type="button"
		onClick={onClick}
		disabled={disabled}
		className={`
      flex items-center justify-center 
      px-4 py-2
      bg-white/10 backdrop-blur-sm
      rounded-lg border border-white/30
      text-white font-extrabold uppercase tracking-wider
      transition-colors duration-200
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
