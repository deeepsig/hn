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
  detailUrl?: string
  authorUrl?: string
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
  comments,
  detailUrl = `#/story/${index}`, // placeholder for story detail
  authorUrl = `#/user/${author}` // placeholder for author profile
}: StoryItemProps) {
  // show `rank` if provided, otherwise fall back to `index`
  const displayIndex = rank ?? index

  return (
    <div className="flex items-baseline py-2 font-inter font-light text-[12px]">
      {/* Rank */}
      <span className="mr-4 font-normal text-right text-gray-400">
        {displayIndex}.
      </span>

      {/* Main content */}
      <div className="flex-1">
        {/* Title */}
        <a
          href={url}
          className="block text-[14.5px] font-normal text-gray-900 hover:underline truncate"
          title={title}
        >
          {title}
        </a>

        {/* Source and metadata */}
        <div>
          {/* Source external link */}
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
              <a href={detailUrl} className="hover:underline">
                {points} pts
              </a>
            </li>
            <li className="text-sm text-gray-400">·</li>
            <li>
              <a href={authorUrl} className="hover:underline">
                by {author}
              </a>
            </li>
            <li className="text-sm text-gray-400">·</li>
            <li>
              <a href={detailUrl} className="hover:underline">
                {time}
              </a>
            </li>
            <li className="text-sm text-gray-400">·</li>
            <li>
              <a href={detailUrl} className="hover:underline">
                {comments} comments
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
