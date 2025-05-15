import { DotsThree } from '@phosphor-icons/react'

export interface StoryItemProps {
  index: number
  title: string
  url: string
  source: string
  points: number
  author: string
  time: string
  comments: number
}

export default function StoryItem({
  index,
  title,
  url,
  source,
  points,
  author,
  time,
  comments
}: StoryItemProps) {
  return (
    <div className="flex items-start py-4 border-b border-gray-100 font-inter">
      {/* Rank */}
      <span className="w-6 text-right text-gray-400 mr-4">{index}.</span>

      {/* Main content */}
      <div className="flex-1">
        <a
          href={url}
          className="text-base font-medium text-gray-900 hover:underline"
        >
          {title}
        </a>
        <span className="ml-2 text-sm text-gray-500">({source})</span>

        <ul className="flex flex-wrap items-center text-sm text-gray-500 mt-1 space-x-2">
          <li>{points} points</li>
          <li>·</li>
          <li>by {author}</li>
          <li>·</li>
          <li>{time}</li>
          <li>·</li>
          <li>{comments} comments</li>
        </ul>
      </div>

      {/* More menu */}
      <button className="ml-4 flex-shrink-0">
        <DotsThree size={20} weight="bold" className="text-gray-400" />
      </button>
    </div>
  )
}
