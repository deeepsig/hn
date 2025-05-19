// src/components/section-header/JobsSectionHeader.tsx
import { DotsThree } from '@phosphor-icons/react'

export default function JobsSectionHeader() {
  return (
    <div className="max-w-[600px] mx-auto pt-8 pb-5 border-b border-gray-100 font-inter">
      <div className="flex items-baseline justify-between">
        <h1 className="text-[36px] font-medium text-gray-900">Jobs</h1>
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
