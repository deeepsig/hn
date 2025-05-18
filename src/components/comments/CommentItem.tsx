// src/components/comments/CommentItem.tsx
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
  kids?: number[]
  deleted?: boolean
  dead?: boolean
  children: RawWithChildren[]
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
  replies?: RawWithChildren[]
  kids?: number[]
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

  // controls whether we've expanded/collapsed loaded replies
  const [expanded, setExpanded] = useState(true)

  // keep track of replies we've fetched & pagination index
  const [childReplies, setChildReplies] = useState<RawWithChildren[]>(replies)
  const [nextIndex, setNextIndex] = useState(replies.length)
  const [loadingMore, setLoadingMore] = useState(false)

  // sanitize + parse HTML
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

  // fetch a single comment (no children)
  async function fetchComment(id: number): Promise<RawWithChildren | null> {
    const res = await fetch(
      `https://hacker-news.firebaseio.com/v0/item/${id}.json`
    )
    const raw = await res.json()
    if (!raw || raw.deleted || raw.dead) return null
    return {
      ...raw,
      kids: raw.kids ?? [],
      children: []
    } as RawWithChildren
  }

  // load next batch of up to 5 replies
  async function loadMoreReplies() {
    if (nextIndex >= kids.length) return
    setLoadingMore(true)

    const batch = kids.slice(nextIndex, nextIndex + 5)
    const fetched = await Promise.all(batch.map(fetchComment))
    const valid = fetched.filter((c): c is RawWithChildren => Boolean(c))

    setChildReplies((prev) => [...prev, ...valid])
    setNextIndex((i) => i + batch.length)
    setLoadingMore(false)
  }

  return (
    <div
      className={
        `flex flex-col py-4 font-inter text-sm ` +
        `${depth > 0 ? 'border-l border-gray-200 pl-4' : ''}`
      }
      style={{ marginLeft: depth * 16 }}
    >
      {/* header */}
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

        {isThread && kids.length > 0 && (
          <button
            onClick={() => setExpanded((e) => !e)}
            className="ml-2 text-xs text-gray-500 hover:underline"
          >
            {expanded ? '– collapse replies' : '+ expand replies'}
          </button>
        )}
      </div>

      {/* body */}
      <div
        className={
          isThread
            ? 'mt-2 text-gray-800 leading-relaxed'
            : 'mt-1 font-normal text-gray-800'
        }
      >
        {content}
      </div>

      {/* replies */}
      {isThread && expanded && (
        <div>
          {childReplies.map((child) => (
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

          {/* load more replies */}
          {nextIndex < kids.length && (
            <div style={{ marginLeft: (depth + 1) * 16 }} className="mt-4">
              {/* vertical line segment */}
              <div className="border-l border-gray-200 h-4 ml-[-1px]" />
              {/* button */}
              <div
                onClick={loadMoreReplies}
                className="mt-2 text-xs text-gray-500 cursor-pointer hover:underline"
              >
                {loadingMore ? 'Loading replies…' : 'Load more replies'}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
