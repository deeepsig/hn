// src/pages/StoryThreadPage.tsx
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import ThreadHeader from '../components/thread/ThreadHeader'
import CommentItem from '../components/comments/CommentItem'
import { getRelativeTime } from '../contexts/SectionPageContext'

interface RawItem {
  id: number
  title?: string
  url?: string
  by?: string
  time?: number
  score?: number
  descendants?: number
  kids?: number[]
  text?: string
  deleted?: boolean
  dead?: boolean
}

type RawWithChildren = RawItem & { children: RawWithChildren[] }

export default function StoryThreadPage() {
  const { storyId } = useParams<{ storyId: string }>()
  const id = Number(storyId)
  const [story, setStory] = useState<RawItem | null>(null)
  const [commentTree, setCommentTree] = useState<RawWithChildren[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchNode(
      nodeId: number,
      depth: number
    ): Promise<RawWithChildren | null> {
      const res = await fetch(
        `https://hacker-news.firebaseio.com/v0/item/${nodeId}.json`
      )
      const raw: RawItem = await res.json()
      if (!raw || raw.deleted || raw.dead) return null

      const node: RawWithChildren = { ...raw, children: [] }

      if (depth < 3 && Array.isArray(raw.kids)) {
        for (const kidId of raw.kids.slice(0, 30)) {
          const child = await fetchNode(kidId, depth + 1)
          if (child) node.children.push(child)
        }
      }

      return node
    }

    async function load() {
      setLoading(true)
      const storyRes = await fetch(
        `https://hacker-news.firebaseio.com/v0/item/${id}.json`
      )
      const s: RawItem = await storyRes.json()
      setStory(s)

      if (Array.isArray(s.kids) && s.kids.length) {
        const roots: RawWithChildren[] = []
        for (const kidId of s.kids.slice(0, 30)) {
          const rootNode = await fetchNode(kidId, 0)
          if (rootNode) roots.push(rootNode)
        }
        setCommentTree(roots)
      } else {
        setCommentTree([])
      }

      setLoading(false)
    }

    load().catch(console.error)
  }, [id])

  if (loading || !story) {
    return <p className="py-20 text-center">Loading…</p>
  }

  const storyUrl =
    story.url ?? `https://news.ycombinator.com/item?id=${story.id}`

  return (
    <div className="max-w-[600px] mx-auto">
      <ThreadHeader
        index={story.id}
        title={story.title!}
        url={storyUrl}
        source={new URL(storyUrl).host}
        points={story.score ?? 0}
        author={story.by!}
        time={getRelativeTime(story.time!)}
        comments={story.descendants ?? 0}
      />

      <div className="px-2 divide-y divide-gray-100">
        {!commentTree && <p className="py-4 text-center">Loading comments…</p>}
        {commentTree?.map((node) => (
          <CommentItem
            key={node.id}
            id={node.id}
            author={node.by!}
            time={getRelativeTime(node.time!)}
            text={node.text ?? ''}
            variant="thread"
            depth={0}
            replies={node.children}
          />
        ))}
      </div>
    </div>
  )
}
