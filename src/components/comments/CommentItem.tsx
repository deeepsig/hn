// src/components/comments/CommentItem.tsx

import type { CommentItemProps } from '../../data/comments'

export interface CommentItemWithVariantProps extends CommentItemProps {
  /** controls layout style; data itself remains unaware of this */
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
  // in thread, split into paragraphs on double‐newline
  const paragraphs = isThread ? text.split(/\n{2,}/g) : [text]

  return (
    <div
      className={[
        'flex flex-col py-4 font-inter font-light text-sm border-b border-gray-200 '
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Header */}
      <div className="inline-flex items-baseline space-x-2 whitespace-nowrap">
        <a
          href={authorUrl}
          className="font-medium text-gray-900 hover:underline"
        >
          {author}
        </a>
        <span className="text-gray-400 text-base">·</span>
        <span className="text-gray-800 font-normal">{time}</span>
        {!isThread && (
          <>
            <span className="text-gray-400 text-base">·</span>
            <a
              href={postUrl}
              className="font-normal text-orange-500 hover:underline truncate"
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
