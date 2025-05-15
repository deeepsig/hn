import { useState } from 'react'
import { DotsThree } from '@phosphor-icons/react'

export default function SectionHeader() {
  const [activeTab, setActiveTab] = useState('Stories')

  return (
    <div className="max-w-[600px] mx-auto pt-8 pb-5 border-b border-gray-100 font-inter">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-[36px] font-medium text-gray-900 mr-10">New</h1>

          <div className="flex rounded-full bg-gray-100 p-0.5">
            <button
              className={`px-5 py-1.5 text-sm rounded-full ${
                activeTab === 'Stories' ? 'bg-white shadow-sm' : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('Stories')}
            >
              Stories
            </button>
            <button
              className={`px-5 py-1.5 text-sm rounded-full ${
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

        <button className="flex items-center h-10">
          <DotsThree size={32} className="text-gray-600" weight="bold" />
        </button>
      </div>
    </div>
  )
}
