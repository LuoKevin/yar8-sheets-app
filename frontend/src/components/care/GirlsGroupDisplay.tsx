interface GirlsGroupDisplayProps {
  girls: string[]
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const GirlsGroupDisplay = ({ girls }: GirlsGroupDisplayProps) => {
  return (
    <div className="relative z-10 min-h-screen w-full px-2 sm:px-4">
      {/* Main Display */}
      <div className="h-64 w-full"></div>
    </div>
  )
}

export default GirlsGroupDisplay
