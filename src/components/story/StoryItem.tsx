export interface StoryItemProps {
  index: number
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
  url,
  source,
  points,
  author,
  time,
  comments,
  detailUrl = `#/story/${index}`, // placeholder for story detail
  authorUrl = `#/user/${author}` // placeholder for author profile
}: StoryItemProps) {
  return (
    <div className="flex items-baseline py-2 font-inter font-light text-[12px]">
      {/* Rank */}
      <span className="w-6 text-right font-normal text-gray-400 mr-4">
        {index}.
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
            className="text-orange-500 font-normal hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            ({source})
          </a>

          <ul className="inline-flex flex-wrap items-center ml-2 space-x-2">
            <li className="text-gray-400 text-sm">·</li>
            <li>
              <a href={detailUrl} className="hover:underline">
                {points} pts
              </a>
            </li>
            <li className="text-gray-400 text-sm">·</li>
            <li>
              <a href={authorUrl} className="hover:underline">
                by {author}
              </a>
            </li>
            <li className="text-gray-400 text-sm">·</li>
            <li>
              <a href={detailUrl} className="hover:underline">
                {time}
              </a>
            </li>
            <li className="text-gray-400 text-sm">·</li>
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
