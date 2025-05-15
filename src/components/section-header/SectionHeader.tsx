import { useState } from 'react'
import { DotsThree } from '@phosphor-icons/react'

export default function SectionHeader() {
  const [activeTab, setActiveTab] = useState('Stories')

  return (
    <div className="max-w-[600px] mx-auto pt-8 pb-6 border-b border-gray-200 font-inter">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-[36px] font-medium text-gray-900 mr-10">New</h1>

          <div className="flex rounded-md bg-gray-100 p-0.5">
            <button
              className={`px-3 py-1 text-sm ${
                activeTab === 'Stories'
                  ? 'bg-white shadow-sm rounded-md'
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('Stories')}
            >
              Stories
            </button>
            <button
              className={`px-3 py-1 text-sm ${
                activeTab === 'Comments'
                  ? 'bg-white shadow-sm rounded-md'
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('Comments')}
            >
              Comments
            </button>
          </div>
        </div>

        <button>
          <DotsThree size={32} className="text-gray-700" weight="bold" />
        </button>
      </div>
    </div>
  )
}
