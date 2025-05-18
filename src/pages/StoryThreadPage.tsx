import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import ThreadHeader from '../components/thread/ThreadHeader'
import CommentItem, {
  RawWithChildren
} from '../components/comments/CommentItem'
import { getRelativeTime } from '../contexts/SectionPageContext'
import hnLogo from '../assets/hn.png'

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

// fetch a node plus one level of children (limit 5), to seed the tree
async function fetchNode(
  nodeId: number,
  depth: number
): Promise<RawWithChildren | null> {
  const res = await fetch(
    `https://hacker-news.firebaseio.com/v0/item/${nodeId}.json`
  )
  const raw: RawItem = await res.json()
  if (!raw || raw.deleted || raw.dead) return null

  const node: RawWithChildren = {
    ...raw,
    kids: raw.kids ?? [],
    children: []
  }

  // prefetch one level of replies, max 5
  if (depth < 1 && Array.isArray(raw.kids)) {
    const toFetch = raw.kids.slice(0, 5)
    const ps = toFetch.map((kidId) => fetchNode(kidId, depth + 1))
    const fetched = await Promise.all(ps)
    node.children = fetched.filter((c): c is RawWithChildren => Boolean(c))
  }

  return node
}

export default function StoryThreadPage() {
  const { storyId } = useParams<{ storyId: string }>()
  const id = Number(storyId)

  const [story, setStory] = useState<RawItem | null>(null)
  const [allKids, setAllKids] = useState<number[]>([])
  const [commentTree, setCommentTree] = useState<RawWithChildren[]>([])
  const [visibleCount, setVisibleCount] = useState(0)
  const [loadingStory, setLoadingStory] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  // load story + first batch
  useEffect(() => {
    setLoadingStory(true)
    async function load() {
      const res = await fetch(
        `https://hacker-news.firebaseio.com/v0/item/${id}.json`
      )
      const s: RawItem = await res.json()
      setStory(s)

      const kids = Array.isArray(s.kids) ? s.kids : []
      setAllKids(kids)
      // start with first 5
      const firstBatch = kids.slice(0, 5)
      const roots = await Promise.all(
        firstBatch.map((kidId) => fetchNode(kidId, 0))
      )
      setCommentTree(roots.filter((n): n is RawWithChildren => Boolean(n)))
      setVisibleCount(firstBatch.length)
      setLoadingStory(false)
    }

    load().catch((err) => {
      console.error(err)
      setLoadingStory(false)
    })
  }, [id])

  // load next batch of 5
  async function loadMore() {
    if (visibleCount >= allKids.length) return
    setLoadingMore(true)
    const nextBatch = allKids.slice(visibleCount, visibleCount + 5)
    const more = await Promise.all(
      nextBatch.map((kidId) => fetchNode(kidId, 0))
    )
    setCommentTree((prev) => [
      ...prev,
      ...more.filter((n): n is RawWithChildren => Boolean(n))
    ])
    setVisibleCount((v) => v + nextBatch.length)
    setLoadingMore(false)
  }

  if (loadingStory || !story) {
    return (
      <div className="flex items-center justify-center h-screen">
        <img
          src={hnLogo}
          alt="Loading..."
          className="w-12 h-12"
          style={{ transform: 'translateY(-10vh)' }}
        />
      </div>
    )
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
        {commentTree.length === 0 && (
          <p className="py-4 text-center">No comments yet…</p>
        )}
        {commentTree.map((node) => (
          <CommentItem
            key={node.id}
            id={node.id}
            author={node.by!}
            time={getRelativeTime(node.time!)}
            text={node.text ?? ''}
            variant="thread"
            depth={0}
            replies={node.children}
            kids={node.kids}
          />
        ))}

        {visibleCount < allKids.length && (
          <div className="py-4 text-center">
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="px-4 py-2 text-white bg-orange-500 rounded hover:bg-orange-600 disabled:opacity-50"
            >
              {loadingMore ? 'Loading…' : 'Load more comments'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
