// src/components/thread/ThreadHeaderController.tsx
import ThreadHeader from './ThreadHeader'
import stories from '../../data/stories'

export default function ThreadHeaderController() {
  // take the very first story in the list
  const firstStory = stories[0]

  // render it as a ThreadHeader
  return (
    <ThreadHeader
      index={firstStory.index}
      title={firstStory.title}
      url={firstStory.url}
      source={firstStory.source}
      points={firstStory.points}
      author={firstStory.author}
      time={firstStory.time}
      comments={firstStory.comments}
      // detailUrl and authorUrl will default if you omit them
    />
  )
}
