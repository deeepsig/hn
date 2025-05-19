// src/components/section-header/AskShowSectionHeader.tsx
import { DotsThree } from '@phosphor-icons/react'
import { useSectionPageContext } from '../../contexts/SectionPageContext'

export default function AskShowSectionHeader() {
  const { pageType, askShowView, setAskShowView } = useSectionPageContext()

  return (
    <div className="max-w-[600px] mx-auto pt-8 pb-5 border-b border-gray-100 font-inter">
      <div className="flex items-baseline justify-between">
        <div className="flex items-baseline">
          <h1 className="text-[36px] font-medium text-gray-900 mr-10">
            {pageType}
          </h1>

          <div className="flex rounded-full bg-gray-100 p-0.5 self-center">
            {(['Top', 'New'] as const).map((view) => (
              <button
                key={view}
                className={`px-4 py-1.5 text-sm rounded-full ${
                  askShowView === view ? 'bg-white shadow-sm' : 'text-gray-500'
                }`}
                onClick={() => setAskShowView(view)}
              >
                {view}
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
