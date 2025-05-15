import { DotsThree } from '@phosphor-icons/react'

export default function TopSectionHeader() {
  // Get current date
  const date = new Date()
  const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' })
  const day = date.getDate()
  const month = date.toLocaleDateString('en-US', { month: 'short' })
  const year = date.getFullYear()

  return (
    <div className="max-w-[600px] mx-auto pt-8 pb-5 border-b border-gray-100 font-inter">
      <div className="flex items-baseline justify-between">
        <div className="flex items-baseline">
          <h1 className="text-[36px] font-medium text-gray-900 mr-2">
            {dayOfWeek}
          </h1>
          <span className="text-[22px] text-gray-500 ml-4">
            {day} {month}
          </span>
          <span className="text-gray-400 text-lg ml-4 font-light">{year}</span>
        </div>

        <button className="flex items-baseline">
          <DotsThree size={32} className="text-gray-600" weight="bold" />
        </button>
      </div>
    </div>
  )
}
