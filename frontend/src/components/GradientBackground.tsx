import { motion, useMotionValue, animate, useTransform, MotionValue, useMotionTemplate } from "framer-motion"
import { useState, useEffect } from "react"

const colorThemes = [
	{ start: "#0f0c29", end: "#302b63", angle: 135 }, // Deep purple
	{ start: "#1a2980", end: "#26d0ce", angle: 45 },  // Teal ocean
	{ start: "#3a1c71", end: "#d76d77", angle: 120 }, // Sunset
	{ start: "#000428", end: "#004e92", angle: 135 }, // Deep blue
	{ start: "#23074d", end: "#cc5333", angle: 135 }  // Purple to orange
]

interface GradientBackgroundProps {
    isLoading: boolean
    isShuffling: boolean
}



const GradientBackground = () => {
	const [currentTheme, setCurrentTheme] = useState(0)
	const startColor = useMotionValue<string>(colorThemes[3].start)
	const endColor = useMotionValue<string>(colorThemes[3].end)
	const angle = useMotionValue<number>(colorThemes[3].angle)

	// Create a transform that generates the gradient string
	const background = useMotionTemplate`
    linear-gradient(${angle}deg, ${startColor}, ${endColor})
  `

  
	const nextTheme = () => {
		const newTheme = (currentTheme + 1) % colorThemes.length
    
		// Animate all gradient properties
		animate(startColor, colorThemes[newTheme].start, {
			duration: 0.5,
			ease: "easeInOut"
		})
		animate(endColor, colorThemes[newTheme].end, {
			duration: 0.5,
			ease: "easeInOut"
		})
		animate(angle, colorThemes[newTheme].angle, {
			duration: 0.5,
			ease: "easeInOut"
		})
    
		setCurrentTheme(newTheme)
	}

	// Auto-cycle colors every 20 seconds
	// useEffect(() => {
	//   const interval = setInterval(nextTheme, 20000);
	//   return () => clearInterval(interval);
	// }, [currentTheme]);

	return (
		<>
			<motion.div 
				className="fixed inset-0 z-0"
				style={{ background }}
			/>
      
			<motion.button
				onClick={nextTheme}
				className="fixed bottom-8 right-8 z-20 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white border border-white/30 hover:bg-white/30 transition-all shadow-lg hover:scale-105 active:scale-95"
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.95 }}
			>
        Change Colors
			</motion.button>
		</>
	)
}

export default GradientBackground