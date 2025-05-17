// src/components/comments/CommentItem.tsx
interface CommentItemProps {
  id: number
  author: string
  time: string
  postTitle: string
  postUrl: string
  text: string
  authorUrl?: string
}

export interface CommentItemWithVariantProps extends CommentItemProps {
  variant?: 'list' | 'thread'
}

export default function CommentItem({
  author,
  time,
  postTitle,
  postUrl,
  text,
  authorUrl = `#/user/${author}`,
  variant = 'list'
}: CommentItemWithVariantProps) {
  const isThread = variant === 'thread'
  const paragraphs = isThread ? text.split(/\n{2,}/g) : [text]

  return (
    <div className="flex flex-col py-4 text-sm font-light font-inter">
      {/* Header */}
      <div className="inline-flex items-baseline space-x-2 whitespace-nowrap">
        <a
          href={authorUrl}
          className="font-medium text-gray-900 hover:underline"
        >
          {author}
        </a>
        <span className="text-base text-gray-400">·</span>
        <span className="font-normal text-gray-800">{time}</span>
        {!isThread && (
          <>
            <span className="text-base text-gray-400">·</span>
            <a
              href={postUrl}
              className="font-normal text-orange-500 truncate hover:underline"
              title={postTitle}
            >
              {postTitle}
            </a>
          </>
        )}
      </div>

      {/* Body */}
      {paragraphs.map((para, i) => (
        <p
          key={i}
          className={
            isThread
              ? 'mt-2 text-gray-800 leading-relaxed'
              : 'mt-1 font-normal text-gray-800'
          }
        >
          {para}
        </p>
      ))}
    </div>
  )
}
