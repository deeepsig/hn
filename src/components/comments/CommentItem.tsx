import parse, { DOMNode, domToReact, Element } from 'html-react-parser'
import { Link } from 'react-router-dom'
import DOMPurify from 'dompurify'
import { useState } from 'react'
import { getRelativeTime } from '../../contexts/SectionPageContext'

export interface RawWithChildren {
  id: number
  by?: string
  time?: number
  text?: string
  kids?: number[] // <-- keep raw child IDs
  deleted?: boolean
  dead?: boolean
  children: RawWithChildren[] // pre‑fetched subset
}

interface CommentItemProps {
  id: number
  author: string
  time: string
  text: string
  variant?: 'list' | 'thread'
  depth?: number
  postTitle?: string
  storyId?: number
  replies?: RawWithChildren[] // pre‑fetched
  kids?: number[] // raw kids array
}

export default function CommentItem({
  author,
  time,
  postTitle,
  storyId,
  text,
  variant = 'list',
  depth = 0,
  replies = [],
  kids = []
}: CommentItemProps) {
  const isThread = variant === 'thread'
  const [collapsed, setCollapsed] = useState(false)

  // Dynamic replies state:
  const [childReplies, setChildReplies] = useState<RawWithChildren[] | null>(
    replies.length > 0 ? replies : null
  )
  const [loadingChildren, setLoadingChildren] = useState(false)

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

  // On expand: if we haven’t fetched children yet, do so
  async function handleToggle() {
    if (collapsed && childReplies === null && Array.isArray(kids)) {
      setLoadingChildren(true)
      const fetched = await Promise.all(
        kids.map(async (kidId) => {
          const res = await fetch(
            `https://hacker-news.firebaseio.com/v0/item/${kidId}.json`
          )
          const raw = await res.json()
          if (!raw || raw.deleted || raw.dead) return null
          return {
            ...raw,
            kids: raw.kids ?? [],
            children: []
          } as RawWithChildren
        })
      )
      setChildReplies(fetched.filter((c): c is RawWithChildren => Boolean(c)))
      setLoadingChildren(false)
    }

    setCollapsed((c) => !c)
  }

  return (
    <div
      className={
        `flex flex-col py-4 font-inter text-sm ` +
        `${depth > 0 ? 'border-l border-gray-200 pl-4' : ''}`
      }
      style={{ marginLeft: depth * 16 }}
    >
      {/* header row */}
      <div className="inline-flex items-baseline space-x-2 whitespace-nowrap">
        <a className="font-medium text-gray-900 hover:underline">{author}</a>
        <span className="text-base text-gray-400">·</span>
        <span className="font-normal text-gray-800">{time}</span>

        {!isThread && storyId && postTitle && (
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

        {isThread && (childReplies?.length || kids.length) > 0 && (
          <button
            onClick={handleToggle}
            className="ml-2 text-xs text-gray-500 hover:underline"
          >
            {collapsed ? '+ expand replies' : '– collapse replies'}
          </button>
        )}
      </div>

      {/* comment body */}
      <div
        className={
          isThread
            ? 'mt-2 text-gray-800 leading-relaxed'
            : 'mt-1 font-normal text-gray-800'
        }
      >
        {content}
      </div>

      {/* dynamic replies */}
      {isThread && !collapsed && (
        <>
          {loadingChildren && (
            <p className="mt-2 text-xs text-gray-500">Loading replies…</p>
          )}
          {childReplies?.map((child) => (
            <CommentItem
              key={child.id}
              id={child.id}
              author={child.by!}
              time={getRelativeTime(child.time!)}
              text={child.text ?? ''}
              variant="thread"
              depth={depth + 1}
              replies={child.children}
              kids={child.kids}
            />
          ))}
        </>
      )}
    </div>
  )
}
