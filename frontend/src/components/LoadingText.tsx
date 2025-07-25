
import React from "react"
import { motion } from "framer-motion"

interface LoadingProps {
    text: string | undefined
    visible: boolean
}

const rainbow = [
	"#ff0000", // red
	"#ff7f00", // orange
	"#ffff00", // yellow
	"#00ff00", // green
	"#0000ff", // blue
	"#4b0082", // indigo
	"#8f00ff", // violet
	"#ff0000", // red again to loop
]

export const LoadingText: React.FC<LoadingProps> = ({text, visible}: LoadingProps) => {
	const letters = `${text ? text : "Loading"}...`.split("")


	return (visible &&
    <div className="flex space-x-1">
    	{letters.map((char, i) => (
    		<motion.span
    			key={i}
    			className="font-extrabold text-3xl"
    			initial={{ y: 0, opacity: 0, color: rainbow[0] }}
    			animate={{
    				y: [0, -10, 0],
    				opacity: [1, 1, 1],
    				color: rainbow,
    			}}
    			transition={{
    				delay: i * 0.1,
    				duration: 1,            // total time to run through all 8 colors & bounce
    				repeat: Infinity,
    				repeatType: "loop",
    			}}
    		>
    			{char}
    		</motion.span>
    	))}
    </div>
	)
}