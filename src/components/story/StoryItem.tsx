// src/components/story/StoryItem.tsx
import { Link } from 'react-router-dom'

export interface StoryItemProps {
  index: number
  rank?: number
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
  rank,
  url,
  source,
  points,
  author,
  time,
  comments
}: StoryItemProps) {
  const displayIndex = rank ?? index
  const storyPath = `/story/${index}`

  return (
    <div className="flex items-baseline py-2 font-inter font-light text-[12px]">
      <span className="mr-4 font-normal text-right text-gray-400">
        {displayIndex}.
      </span>
      <div className="flex-1">
        <a
          href={url}
          className="block text-[14.5px] font-normal text-gray-900 hover:underline truncate"
          title={title}
          target="_blank"
          rel="noopener noreferrer"
        >
          {title}
        </a>
        <div>
          <a
            href={source}
            className="font-normal text-orange-500 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            ({source})
          </a>
          <ul className="inline-flex flex-wrap items-center ml-2 space-x-2">
            <li className="text-sm text-gray-400">·</li>
            <li>
              <Link to={storyPath} className="hover:underline">
                {points} pts
              </Link>
            </li>
            <li className="text-sm text-gray-400">·</li>
            <li>
              <Link to={storyPath} className="hover:underline">
                by {author}
              </Link>
            </li>
            <li className="text-sm text-gray-400">·</li>
            <li>
              <Link to={storyPath} className="hover:underline">
                {time}
              </Link>
            </li>
            <li className="text-sm text-gray-400">·</li>
            <li>
              <Link to={storyPath} className="hover:underline">
                {comments} comments
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
