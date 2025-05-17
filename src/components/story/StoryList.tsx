// src/components/story/StoryList.tsx
import StoryItem from './StoryItem'
import type { StoryItemProps } from './StoryItem'

export default function StoryList({
  storiesData
}: {
  storiesData: StoryItemProps[]
}) {
  return (
    <div className="max-w-[600px] mx-auto pt-2 pb-6">
      <div className="px-2 divide-y divide-gray-100">
        {storiesData.map((story, idx) => (
          <StoryItem key={story.index} {...story} rank={idx + 1} />
        ))}
      </div>
    </div>
  )
}
