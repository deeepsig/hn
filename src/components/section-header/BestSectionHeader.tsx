// src/components/section-header/BestSectionHeader.tsx
import { DotsThree } from '@phosphor-icons/react'

export default function BestSectionHeader() {
  return (
    <div className="max-w-[600px] mx-auto pt-6 sm:pt-8 pb-5 border-b border-gray-100 font-inter sm:px-2 md:px-0">
      <div className="flex items-baseline justify-between">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium text-gray-900">
          Best
        </h1>
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
