// src/components/comments/CommentItem.tsx

import type { CommentItemProps } from '../../data/comments'

export default function CommentItem({
  author,
  time,
  postTitle,
  postUrl,
  text,
  authorUrl = `#/user/${author}`
}: CommentItemProps) {
  return (
    <div className="flex flex-col py-2 font-inter font-light text-sm">
      {/* First line: author → time → post title */}
      <div className="inline-flex flex-wrap items-baseline space-x-2">
        <a
          href={authorUrl}
          className="font-medium  text-gray-900 hover:underline"
        >
          {author}
        </a>
        <span className="text-gray-400 text-base">·</span>
        <span className="text-gray-400 ">{time}</span>
        <span className="text-gray-400 text-base">·</span>
        <a
          href={postUrl}
          className=" font-normal text-orange-500 hover:underline truncate"
          title={postTitle}
        >
          {postTitle}
        </a>
      </div>

      {/* Second line: comment body */}
      <p className="mt-1  font-normal text-gray-800">{text}</p>
    </div>
  )
}
