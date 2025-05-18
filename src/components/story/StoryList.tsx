// src/components/story/StoryList.tsx
import StoryItem from './StoryItem'
import { useSectionPageContext } from '../../contexts/SectionPageContext'

export default function StoryList() {
  const { stories, loadMoreStories, hasMoreStories, loadingMore } =
    useSectionPageContext()

  return (
    <div className="max-w-[600px] mx-auto pt-2 pb-6">
      <div className="px-2 divide-y divide-gray-100">
        {stories.map((story, _idx) => (
          <StoryItem key={story.index} {...story} />
        ))}

        {hasMoreStories && (
          <div className="py-4 text-center">
            <button
              onClick={loadMoreStories}
              disabled={loadingMore}
              className="px-4 py-2 text-white bg-orange-500 rounded hover:bg-orange-600 disabled:opacity-50"
            >
              {loadingMore ? 'Loading…' : 'Load more stories'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
