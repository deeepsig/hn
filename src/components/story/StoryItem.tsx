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
    <div className="flex items-start py-2 font-inter font-light text-[12px]">
      {/* Rank */}
      <span className="w-6 text-sm text-right text-gray-400 mr-4">
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
        <div className="">
          <span className=" text-orange-500 font-normal">({source})</span>
          <ul className="inline-flex flex-wrap items-center ml-2 space-x-2">
            <li className="text-gray-400 text-sm">·</li>
            <li>{points} pts</li>
            <li className="text-gray-400 text-sm">·</li>
            <li>by {author}</li>
            <li className="text-gray-400 text-sm">·</li>
            <li>{time}</li>
            <li className="text-gray-400 text-sm">·</li>
            <li>{comments} comments</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
