// src/components/section-header/NewSectionHeader.tsx
import { DotsThree } from '@phosphor-icons/react'
import { useSectionPageContext } from '../../contexts/SectionPageContext'

export default function NewSectionHeader() {
  const { pageType, activeTab, setActiveTab } = useSectionPageContext()

  return (
    <div className="max-w-[600px] mx-auto pt-6 sm:pt-8 pb-5 border-b border-gray-100 font-inter sm:px-2 md:px-0">
      <div className="flex items-baseline justify-between">
        <div className="flex items-baseline justify-between flex-wrap">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium text-gray-900 mr-6 sm:mr-10">
            {pageType}
          </h1>

          <div className="flex rounded-full bg-gray-100 p-0.5 self-center">
            {(['Stories', 'Comments'] as const).map((tab) => (
              <button
                key={tab}
                className={`px-4 py-1.5 text-sm rounded-full ${
                  activeTab === tab ? 'bg-white shadow-sm' : 'text-gray-500'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
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
