// src/components/comments/CommentItem.tsx
import parse, { DOMNode, domToReact, Element } from 'html-react-parser'
import { Link } from 'react-router-dom'
import DOMPurify from 'dompurify'

interface CommentItemProps {
  id: number
  author: string
  time: string
  postTitle: string
  text: string
  variant?: 'list' | 'thread'
  depth?: number
  isCollapsed?: boolean
  onToggle?: () => void

  // only needed for list‑view linking
  storyId?: number
}

export default function CommentItem({
  author,
  time,
  postTitle,
  text,
  variant = 'list',
  depth = 0,
  isCollapsed = false,
  onToggle,
  storyId
}: CommentItemProps) {
  const isThread = variant === 'thread'

  const cleanHtml = DOMPurify.sanitize(text, {
    ALLOWED_TAGS: [
      'a',
      'b',
      'i',
      'em',
      'strong',
      'code',
      'pre',
      'p',
      'br',
      'ul',
      'ol',
      'li'
    ],
    ALLOWED_ATTR: ['href', 'title', 'target']
  })

  const content = parse(cleanHtml, {
    replace: (node) => {
      if (node instanceof Element && node.name === 'a') {
        return (
          <a
            href={node.attribs.href}
            title={node.attribs.title}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 break-words hover:underline"
          >
            {domToReact(node.children as DOMNode[])}
          </a>
        )
      }
    }
  })

  return (
    <div
      className={
        `flex flex-col py-4 font-inter text-sm ` +
        `${depth > 0 ? 'border-l border-gray-200 pl-4' : ''}`
      }
    >
      <div className="inline-flex items-baseline space-x-2 whitespace-nowrap">
        <a className="font-medium text-gray-900 hover:underline">{author}</a>
        <span className="text-base text-gray-400">·</span>
        <span className="font-normal text-gray-800">{time}</span>

        {!isThread && storyId && (
          <>
            <span className="text-base text-gray-400">·</span>
            <Link
              to={`/story/${storyId}`}
              className="font-normal text-orange-500 truncate hover:underline"
              title={postTitle}
            >
              {postTitle}
            </Link>
          </>
        )}
      </div>

      <div
        className={
          isThread
            ? 'mt-2 text-gray-800 leading-relaxed'
            : 'mt-1 font-normal text-gray-800'
        }
      >
        {content}
      </div>

      {isThread && onToggle && (
        <button
          onClick={onToggle}
          className="self-start mt-2 text-xs text-gray-500 hover:underline"
        >
          {isCollapsed ? '+ expand replies' : '– collapse replies'}
        </button>
      )}
    </div>
  )
}
