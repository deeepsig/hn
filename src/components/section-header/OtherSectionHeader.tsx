import { useState } from 'react'
import { DotsThree } from '@phosphor-icons/react'

// Define the interface for the component props
interface OtherSectionHeaderProps {
  pageType: 'New' | 'Best'
}

export default function OtherSectionHeader({
  pageType = 'New'
}: OtherSectionHeaderProps) {
  const [activeTab, setActiveTab] = useState('Stories')

  return (
    <div className="max-w-[600px] mx-auto pt-8 pb-5 border-b border-gray-100 font-inter">
      {/* keep baseline here so dots stay aligned with TopSectionHeader */}
      <div className="flex items-baseline justify-between">
        <div className="flex items-baseline">
          <h1 className="text-[36px] font-medium text-gray-900 mr-10">
            {pageType}
          </h1>

          {/* add self-center to vertically center this pill block */}
          <div className="flex rounded-full bg-gray-100 p-0.5 self-center">
            <button
              className={`px-4 py-1.5 text-sm rounded-full ${
                activeTab === 'Stories' ? 'bg-white shadow-sm' : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('Stories')}
            >
              Stories
            </button>
            <button
              className={`px-4 py-1.5 text-sm rounded-full ${
                activeTab === 'Comments'
                  ? 'bg-white shadow-sm'
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('Comments')}
            >
              Comments
            </button>
          </div>
        </div>

        <button className="flex items-baseline">
          <DotsThree size={32} className="text-gray-600" weight="bold" />
        </button>
      </div>
    </div>
  )
}
