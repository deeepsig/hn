// src/components/story/StoryItem.tsx
import { Link } from 'react-router-dom'
import { useSectionPageContext } from '../../contexts/SectionPageContext'

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
  const { pageType } = useSectionPageContext()
  const displayIndex = rank ?? index
  const storyPath = `/story/${index}`

  return (
    <div className="flex items-baseline py-2 font-inter font-light text-[12px]">
      <span className="mr-4 font-normal text-right text-gray-400">
        {displayIndex}.
      </span>

      <div className="flex-1">
        <a
          href={pageType == 'Ask' ? storyPath : url}
          className="block text-[14.5px] font-normal text-gray-900 hover:underline truncate"
          title={title}
          target="_blank"
          rel="noopener noreferrer"
        >
          {title}
        </a>

        <div className="inline-flex flex-wrap items-center space-x-2">
          {/* Source (hidden on Ask pages) */}
          {pageType !== 'Ask' && (
            <span className="inline-flex items-center space-x-2">
              <a
                href={source}
                className="font-normal text-orange-500 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                ({source})
              </a>
              <span className="text-sm text-gray-400">·</span>
            </span>
          )}

          {/* Points */}
          <span className="inline-flex items-center space-x-2">
            <Link to={storyPath} className="hover:underline">
              {points} pts
            </Link>
            <span className="text-sm text-gray-400">·</span>
          </span>

          {/* Author */}
          <span className="inline-flex items-center space-x-2">
            <Link to={storyPath} className="hover:underline">
              by {author}
            </Link>
            <span className="text-sm text-gray-400">·</span>
          </span>

          {/* Time */}
          <span className="inline-flex items-center space-x-2">
            <Link to={storyPath} className="hover:underline">
              {time}
            </Link>
            <span className="text-sm text-gray-400">·</span>
          </span>

          {/* Comments */}
          <span className="inline-flex items-center">
            <Link to={storyPath} className="hover:underline">
              {comments} comments
            </Link>
          </span>
        </div>
      </div>
    </div>
  )
}
