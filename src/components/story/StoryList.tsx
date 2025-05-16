import stories from '../../data/stories'
import StoryItem from './StoryItem'

export default function StoryList() {
  return (
    <div className="max-w-[600px] mx-auto pt-4 pb-6">
      <div className="px-2">
        {stories.map((story) => (
          <StoryItem key={story.index} {...story} />
        ))}
      </div>
    </div>
  )
}
