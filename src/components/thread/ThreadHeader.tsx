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
    <div className="w-full max-w-[600px] mx-auto pt-6 sm:pt-8 pb-5 border-b border-gray-100 font-inter sm:px-2 md:px-0">
      {/* Title + menu */}
      <div className="flex items-baseline justify-between flex-wrap">
        <a
          href={url}
          className="flex-1 min-w-0 text-2xl sm:text-3xl md:text-4xl font-medium text-gray-900 hover:underline break-words"
          title={title}
        >
          {title}
        </a>
        <button className="flex-shrink-0 ml-2">
          <DotsThree
            size={32}
            weight="bold"
            className="text-gray-600 cursor-help"
          />
        </button>
      </div>

      {/* Metadata */}
      <div className="mt-2 flex flex-col sm:flex-row flex-wrap items-start sm:items-center text-[14px] text-gray-500 space-y-1 sm:space-y-0 sm:space-x-2">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-orange-500 hover:underline"
        >
          ({source.replace(/^https?:\/\//, '')})
        </a>
        <span className="hidden sm:inline">·</span>
        <a href={detailUrl} className="hover:underline">
          {points} pts
        </a>
        <span className="hidden sm:inline">·</span>
        <a href={authorUrl} className="hover:underline">
          {author}
        </a>
        <span className="hidden sm:inline">·</span>
        <a href={detailUrl} className="hover:underline">
          {time}
        </a>
        <span className="hidden sm:inline">·</span>
        <a href={detailUrl} className="hover:underline">
          {comments} comments
        </a>
      </div>
    </div>
  )
}
