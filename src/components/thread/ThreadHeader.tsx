// src/components/thread/ThreadHeader.tsx
import { DotsThree } from '@phosphor-icons/react'
import { StoryItemProps } from '../story/StoryItem'

export default function ThreadHeader({
  index,
  title,
  url,
  source,
  points,
  author,
  time,
  comments
}: StoryItemProps) {
  const detailUrl = `/story/${index}`
  const authorUrl = `/user/${author}`

  return (
    <div className="max-w-[600px] mx-auto pt-8 pb-5 border-b border-gray-100 font-inter">
      {/* Title + menu */}
      <div className="flex items-baseline justify-between space-x-2">
        <a
          href={url}
          className="text-[36px] font-medium text-gray-900 hover:underline"
          title={title}
        >
          {title}
        </a>
        <button className="flex items-center">
          <DotsThree size={32} weight="bold" className="text-gray-600" />
        </button>
      </div>

      {/* Metadata */}
      <div className="mt-2 flex flex-wrap items-center text-[14px] text-gray-500 space-x-2">
        <a
          href={source.startsWith('http') ? source : `https://${source}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-orange-500 hover:underline"
        >
          ({source.replace(/^https?:\/\//, '')})
        </a>
        <span>·</span>
        <a href={detailUrl} className="hover:underline">
          {points} pts
        </a>
        <span>·</span>
        <a href={authorUrl} className="hover:underline">
          by {author}
        </a>
        <span>·</span>
        <a href={detailUrl} className="hover:underline">
          {time}
        </a>
        <span>·</span>
        <a href={detailUrl} className="hover:underline">
          {comments} comments
        </a>
      </div>
    </div>
  )
}
