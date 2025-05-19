// src/contexts/SectionPageContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode
} from 'react'
import { useLocation } from 'react-router-dom'

type Tab = 'Stories' | 'Comments'
type AskShowView = 'Top' | 'New'

export type PageType = 'Top' | 'New' | 'Best' | 'Ask' | 'Show' | 'Jobs'

export interface StoryItemProps {
  index: number
  rank?: number
  title: string
  url: string
  source: string
  points: number
  author: string
  time: string // e.g. "5 hours ago"
  comments: number
  detailUrl: string
  authorUrl: string
}

export interface CommentItemProps {
  id: number // comment's own ID
  author: string
  time: string // e.g. "2 days ago"
  text: string
  postTitle: string
  postUrl?: string // full story URL
  storyId: number // ← NEW: root story's ID
}

interface SectionPageContextType {
  pageType: PageType
  setPageType: (pt: PageType) => void
  activeTab: Tab
  setActiveTab: (tab: Tab) => void
  askShowView: AskShowView
  setAskShowView: (view: AskShowView) => void
  stories: StoryItemProps[]
  comments: CommentItemProps[]
  isLoading: boolean
  loadingMore: boolean
  hasMoreStories: boolean
  hasMoreComments: boolean
  loadMoreStories: () => void
  loadMoreComments: () => void
}

const SectionPageContext = createContext<SectionPageContextType | undefined>(
  undefined
)

const endpointMap: Record<PageType, string> = {
  Top: 'topstories',
  New: 'newstories',
  Best: 'beststories',
  Ask: 'askstories',
  Show: 'showstories',
  Jobs: 'jobstories'
}

// Items to load per page
const PAGE_SIZE = 15

/**
 * Convert a Unix-seconds timestamp into a human-friendly
 * "X minutes/hours/days ago" string (or short date after 7 days).
 */
export function getRelativeTime(unixSec: number): string {
  const now = Date.now()
  const thenMs = unixSec * 1000
  const deltaMs = now - thenMs

  const seconds = Math.floor(deltaMs / 1000)
  if (seconds < 60) {
    return `${seconds} second${seconds !== 1 ? 's' : ''} ago`
  }

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`
  }

  const hours = Math.floor(minutes / 60)
  if (hours < 24) {
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`
  }

  const days = Math.floor(hours / 24)
  if (days < 7) {
    return `${days} day${days !== 1 ? 's' : ''} ago`
  }

  // Older than a week: short date
  const d = new Date(thenMs)
  const month = d.toLocaleString('en-US', { month: 'short' })
  const day = d.getDate()
  return `${month} ${day}`
}

export default function SectionPageProvider({
  children
}: {
  children: ReactNode
}) {
  const { pathname } = useLocation()

  // derive initial pageType from URL path, default to 'New'
  const initialPageType = useMemo<PageType>(() => {
    const p = pathname.slice(1)
    const capitalized = p.charAt(0).toUpperCase() + p.slice(1)
    return (Object.keys(endpointMap) as PageType[]).includes(
      capitalized as PageType
    )
      ? (capitalized as PageType)
      : 'New'
  }, [pathname])

  const [pageType, setPageType] = useState<PageType>(initialPageType)
  const [activeTab, setActiveTab] = useState<Tab>('Stories')
  const [askShowView, setAskShowView] = useState<AskShowView>('New')
  const [stories, setStories] = useState<StoryItemProps[]>([])
  const [comments, setComments] = useState<CommentItemProps[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [loadingMore, setLoadingMore] = useState<boolean>(false)

  // Store full IDs lists for pagination
  const [storyIds, setStoryIds] = useState<number[]>([])
  const [commentIds, setCommentIds] = useState<number[]>([])
  const [visibleStoryCount, setVisibleStoryCount] = useState<number>(PAGE_SIZE)
  const [visibleCommentCount, setVisibleCommentCount] =
    useState<number>(PAGE_SIZE)

  // Helper to fetch an item by ID
  async function getItem(id: number): Promise<any> {
    const res = await fetch(
      `https://hacker-news.firebaseio.com/v0/item/${id}.json`
    )
    if (!res.ok) throw new Error(`Failed to fetch item ${id}`)
    return res.json()
  }

  // Walk up the parent chain until you hit a non-comment (i.e. a story/job/ask)
  async function findRootStory(comment: any): Promise<any> {
    let current = comment
    while (current && current.type === 'comment') {
      current = await getItem(current.parent)
    }
    return current
  }

  // ─────────────── INITIAL FETCH ───────────────
  useEffect(() => {
    const resetState = () => {
      setStories([])
      setStoryIds([])
      setVisibleStoryCount(PAGE_SIZE)
    }

    if (pageType === 'New' && activeTab !== 'Stories') {
      resetState()
      return
    }

    setIsLoading(true)
    resetState()

    const key = endpointMap[pageType]

    // 1) Fetch story IDs
    fetch(`https://hacker-news.firebaseio.com/v0/${key}.json`)
      .then((r) => r.json())
      .then((ids: number[]) => {
        setStoryIds(ids)

        // 2) Fetch first batch of items
        const firstBatch = ids.slice(0, PAGE_SIZE)
        return Promise.all(
          firstBatch.map((id) =>
            fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(
              (r) => r.json()
            )
          )
        )
      })
      .then((items: any[]) => {
        // 3) Sort first if Ask/Show + Top
        let sorted = items
        if (
          (pageType === 'Ask' || pageType === 'Show') &&
          askShowView === 'Top'
        ) {
          sorted = [...items].sort((a, b) => b.score - a.score)
        }

        // 4) Then map & assign fresh ranks
        const mapped: StoryItemProps[] = sorted.map((i, idx) => ({
          index: i.id,
          rank: idx + 1,
          title: i.title || '[no title]',
          url: i.url ?? `https://news.ycombinator.com/item?id=${i.id}`,
          source: i.url ? new URL(i.url).host : 'news.ycombinator.com',
          points: i.score || 0,
          author: i.by || '[deleted]',
          time: getRelativeTime(i.time || Date.now() / 1000),
          comments: i.descendants ?? 0,
          detailUrl: `#/story/${i.id}`,
          authorUrl: `#/user/${i.by || 'anonymous'}`
        }))

        setStories(mapped)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching stories:', err)
        setIsLoading(false)
      })
  }, [pageType, activeTab, askShowView])

  // ─────────────── PAGINATION ───────────────
  const loadMoreStories = () => {
    if (loadingMore || visibleStoryCount >= storyIds.length) return

    setLoadingMore(true)
    const nextBatch = storyIds.slice(
      visibleStoryCount,
      visibleStoryCount + PAGE_SIZE
    )

    Promise.all(
      nextBatch.map((id) =>
        fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(
          (r) => r.json()
        )
      )
    )
      .then((items: any[]) => {
        // Sort first if needed
        let sorted = items
        if (
          (pageType === 'Ask' || pageType === 'Show') &&
          askShowView === 'Top'
        ) {
          sorted = [...items].sort((a, b) => b.score - a.score)
        }

        // Then map & assign fresh ranks
        const mapped: StoryItemProps[] = sorted.map((i, idx) => ({
          index: i.id,
          rank: visibleStoryCount + idx + 1,
          title: i.title,
          url: i.url ?? `https://news.ycombinator.com/item?id=${i.id}`,
          source: i.url ? new URL(i.url).host : 'news.ycombinator.com',
          points: i.score,
          author: i.by,
          time: getRelativeTime(i.time),
          comments: i.descendants ?? 0,
          detailUrl: `#/story/${i.id}`,
          authorUrl: `#/user/${i.by}`
        }))

        setStories((prev) => [...prev, ...mapped])
        setVisibleStoryCount((prev) => prev + nextBatch.length)
        setLoadingMore(false)
      })
      .catch((err) => {
        console.error('Error loading more stories:', err)
        setLoadingMore(false)
      })
  }

  // ─────────────── COMMENTS TAB ───────────────
  useEffect(() => {
    const resetState = () => {
      setComments([])
      setCommentIds([])
      setVisibleCommentCount(PAGE_SIZE)
    }

    if (activeTab !== 'Comments' || pageType !== 'New') {
      resetState()
      return
    }

    setIsLoading(true)
    resetState()

    async function processComment(id: number) {
      const raw = await getItem(id)
      if (raw?.type !== 'comment') return null
      const root = await findRootStory(raw)
      return {
        id: raw.id,
        author: raw.by || '[deleted]',
        time: getRelativeTime(raw.time || Date.now() / 1000),
        text: raw.text || '',
        postTitle: root?.title || '[deleted]',
        postUrl:
          root?.url || `https://news.ycombinator.com/item?id=${root?.id}`,
        storyId: root?.id || raw.id
      } as CommentItemProps
    }

    fetch('https://hacker-news.firebaseio.com/v0/updates.json')
      .then((r) => r.json())
      .then((data: { items: number[] }) => {
        setCommentIds(data.items)
        const firstBatch = data.items.slice(0, PAGE_SIZE)
        return Promise.all(firstBatch.map((id) => processComment(id)))
      })
      .then((results) => {
        const validComments = results.filter((c): c is CommentItemProps =>
          Boolean(c)
        )
        setComments(validComments)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching comments:', err)
        setIsLoading(false)
      })
  }, [pageType, activeTab])

  // ─────────────── COMMENTS PAGINATION ───────────────
  const loadMoreComments = () => {
    if (loadingMore || visibleCommentCount >= commentIds.length) return

    setLoadingMore(true)
    const nextBatch = commentIds.slice(
      visibleCommentCount,
      visibleCommentCount + PAGE_SIZE
    )

    async function processComment(id: number) {
      const raw = await getItem(id)
      if (raw.type !== 'comment') return null
      const root = await findRootStory(raw)
      return {
        id: raw.id,
        author: raw.by || '[deleted]',
        time: getRelativeTime(raw.time),
        text: raw.text || '',
        postTitle: root?.title || '[deleted]',
        postUrl:
          root?.url || `https://news.ycombinator.com/item?id=${root?.id}`,
        storyId: root?.id || raw.id
      } as CommentItemProps
    }

    Promise.all(nextBatch.map((id) => processComment(id)))
      .then((results) => {
        const validComments = results.filter((c): c is CommentItemProps =>
          Boolean(c)
        )
        setComments((prev) => [...prev, ...validComments])
        setVisibleCommentCount((prev) => prev + nextBatch.length)
        setLoadingMore(false)
      })
      .catch((err) => {
        console.error('Error loading more comments:', err)
        setLoadingMore(false)
      })
  }

  const hasMoreStories = visibleStoryCount < storyIds.length
  const hasMoreComments = visibleCommentCount < commentIds.length

  return (
    <SectionPageContext.Provider
      value={{
        pageType,
        setPageType,
        activeTab,
        setActiveTab,
        askShowView,
        setAskShowView,
        stories,
        comments,
        isLoading,
        loadingMore,
        hasMoreStories,
        hasMoreComments,
        loadMoreStories,
        loadMoreComments
      }}
    >
      {children}
    </SectionPageContext.Provider>
  )
}

export function useSectionPageContext() {
  const ctx = useContext(SectionPageContext)
  if (!ctx) {
    throw new Error(
      'useSectionPageContext must be used inside SectionPageProvider'
    )
  }
  return ctx
}
