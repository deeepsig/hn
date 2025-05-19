import { DotsThree } from '@phosphor-icons/react'

export default function TopSectionHeader() {
  // Get current date
  const date = new Date()
  const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' })
  const day = date.getDate()
  const month = date.toLocaleDateString('en-US', { month: 'short' })
  const year = date.getFullYear()

  return (
    <div className="max-w-[600px] mx-auto pt-6 sm:pt-8 pb-5 border-b border-gray-100 font-inter sm:px-2 md:px-0">
      <div className="flex items-baseline justify-between flex-wrap">
        <div className="flex items-baseline">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium text-gray-900 mr-2">
            {dayOfWeek}
          </h1>
          <span className="text-lg sm:text-[22px] text-gray-500 sm:ml-4">
            {day} {month}
          </span>
          <span className="text-gray-400 text-base sm:text-lg ml-2 sm:ml-4 font-light">
            {year}
          </span>
        </div>

        <button className="flex items-baseline">
          <DotsThree
            size={32}
            className="text-gray-600 cursor-help"
            weight="bold"
          />
        </button>
      </div>
    </div>
  )
}
