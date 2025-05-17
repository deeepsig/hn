// src/components/comments/CommentItem.tsx
import parse, { DOMNode, domToReact, Element } from 'html-react-parser'
import DOMPurify from 'dompurify'

interface CommentItemProps {
  id: number
  author: string
  time: string
  postTitle: string
  postUrl: string
  text: string // raw, HTML‑escaped string from the API
  authorUrl?: string
  variant?: 'list' | 'thread'
  depth?: number
  isCollapsed?: boolean
  onToggle?: () => void
}

export default function CommentItem({
  author,
  time,
  postTitle,
  postUrl,
  text,
  authorUrl = `#/user/${author}`,
  variant = 'list',
  depth = 0,
  isCollapsed = false,
  onToggle
}: CommentItemProps) {
  const isThread = variant === 'thread'

  /** Decode HTML entities via DOMParser */
  function decodeHTML(html: string): string {
    const doc = new window.DOMParser().parseFromString(html, 'text/html')
    return doc.documentElement.textContent || ''
  }

  /** Sanitize the decoded HTML */
  const cleanHtml = DOMPurify.sanitize(decodeHTML(text), {
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

  /** Parse into React nodes, casting children to DOMNode[] */
  const content = parse(cleanHtml, {
    replace: (node: DOMNode) => {
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
      // other tags fall through and render normally
    }
  })

  return (
    <div
      className={`
        flex flex-col py-4 font-inter text-sm
        ${depth > 0 ? 'border-l border-gray-200 pl-4' : ''}
      `}
    >
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
      <div
        className={
          isThread
            ? 'mt-2 text-gray-800 leading-relaxed'
            : 'mt-1 font-normal text-gray-800'
        }
      >
        {content}
      </div>

      {/* Toggle for collapsing replies */}
      {isThread && onToggle && (
        <button
          onClick={onToggle}
          className="self-start mt-2 text-xs text-gray-500 hover:underline"
        >
          {isCollapsed ? `+ expand replies` : `– collapse replies`}
        </button>
      )}
    </div>
  )
}
