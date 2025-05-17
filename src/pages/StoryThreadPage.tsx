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

export default function StoryThreadPage() {
  const { storyId } = useParams<{ storyId: string }>()
  const id = Number(storyId)
  const [story, setStory] = useState<RawItem | null>(null)
  const [comments, setComments] = useState<RawItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      // 1️⃣ fetch story
      const s = await fetch(
        `https://hacker-news.firebaseio.com/v0/item/${id}.json`
      ).then((r) => r.json())
      setStory(s)

      // 2️⃣ fetch only top‑level comments
      if (s.kids?.length) {
        const tops = s.kids.slice(0, 30)
        const rawComments = await Promise.all(
          tops.map((cid: number) =>
            fetch(
              `https://hacker-news.firebaseio.com/v0/item/${cid}.json`
            ).then((r) => r.json())
          )
        )
        setComments(rawComments.filter((c) => c && !c.deleted && !c.dead))
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
        {comments.map((c) => (
          <CommentItem
            key={c.id}
            id={c.id}
            author={c.by!}
            time={getRelativeTime(c.time!)}
            postTitle={story.title!}
            text={c.text ?? ''}
            variant="thread"
            depth={0}
          />
        ))}
      </div>
    </div>
  )
}
