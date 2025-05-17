// src/components/story/StoryList.tsx
import StoryItem from './StoryItem'
import { useSectionPageContext } from '../../contexts/SectionPageContext'

export default function StoryList() {
  const { stories } = useSectionPageContext()

  return (
    <div className="max-w-[600px] mx-auto pt-2 pb-6">
      <div className="px-2 divide-y divide-gray-100">
        {stories.map((story, idx) => (
          <StoryItem key={story.index} {...story} rank={idx + 1} />
        ))}
      </div>
    </div>
  )
}
