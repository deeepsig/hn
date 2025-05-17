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
  id: number
  author: string
  time: string // e.g. "2 days ago"
  text: string
  postTitle: string
  postUrl: string
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

/**
 * Convert a Unix‑seconds timestamp into a human‑friendly
 * “X minutes/hours/days ago” string (or short date after 7 days).
 */
function getRelativeTime(unixSec: number): string {
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

  // Older than a week: show short date
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
    const p = pathname.slice(1) // e.g. "top"
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

  // Fetch stories for all page types & toggles
  useEffect(() => {
    setIsLoading(true)
    const key = endpointMap[pageType]

    // ASK / SHOW: always stories; toggle Top vs New
    if (pageType === 'Ask' || pageType === 'Show') {
      fetch(`https://hacker-news.firebaseio.com/v0/${key}.json`)
        .then((r) => r.json())
        .then((ids: number[]) =>
          Promise.all(
            ids
              .slice(0, 30)
              .map((id) =>
                fetch(
                  `https://hacker-news.firebaseio.com/v0/item/${id}.json`
                ).then((r) => r.json())
              )
          )
        )
        .then((items: any[]) => {
          let mapped: StoryItemProps[] = items.map((i, idx) => ({
            index: i.id,
            rank: idx + 1,
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
          if (askShowView === 'Top') {
            mapped = mapped.sort((a, b) => b.points - a.points)
          }
          setStories(mapped)
          setIsLoading(false)
        })
        .catch(() => setIsLoading(false))

      return
    }

    // NEW / BEST: if Comments tab active, skip story fetch
    if (
      (pageType === 'New' || pageType === 'Best') &&
      activeTab !== 'Stories'
    ) {
      setIsLoading(false)
      return
    }

    // TOP, JOBS, or New/Best Stories
    fetch(`https://hacker-news.firebaseio.com/v0/${key}.json`)
      .then((r) => r.json())
      .then((ids: number[]) =>
        Promise.all(
          ids
            .slice(0, 30)
            .map((id) =>
              fetch(
                `https://hacker-news.firebaseio.com/v0/item/${id}.json`
              ).then((r) => r.json())
            )
        )
      )
      .then((items: any[]) => {
        const mapped: StoryItemProps[] = items.map((i, idx) => ({
          index: i.id,
          rank: idx + 1,
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
        setStories(mapped)
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [pageType, activeTab, askShowView])

  // Fetch comments only for New/Best → Comments
  useEffect(() => {
    if (activeTab !== 'Comments' || !['New', 'Best'].includes(pageType)) {
      return
    }

    setIsLoading(true)

    // helper to fetch an item by ID
    async function getItem(id: number): Promise<any> {
      const res = await fetch(
        `https://hacker-news.firebaseio.com/v0/item/${id}.json`
      )
      if (!res.ok) throw new Error(`Failed to fetch item ${id}`)
      return res.json()
    }

    // walk up the parent chain until you hit a non-comment (i.e. a story/job/ask)
    async function findRootStory(comment: any): Promise<any> {
      let current = comment
      while (current && current.type === 'comment') {
        current = await getItem(current.parent)
      }
      return current
    }

    fetch('https://hacker-news.firebaseio.com/v0/updates.json')
      .then((r) => r.json())
      .then((data: { items: number[] }) =>
        Promise.all(
          data.items.slice(0, 30).map(async (id) => {
            const raw = await getItem(id)
            if (raw.type !== 'comment') return null

            // climb up to the root story
            const root = await findRootStory(raw)

            return {
              id: raw.id,
              author: raw.by,
              time: getRelativeTime(raw.time),
              text: raw.text,
              postTitle: root?.title ?? '[deleted]',
              postUrl:
                root?.url ?? `https://news.ycombinator.com/item?id=${root?.id}`
            }
          })
        )
      )
      .then((results) => {
        // filter out any nulls (non-comments)
        setComments(results.filter((c): c is CommentItemProps => Boolean(c)))
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [pageType, activeTab])

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
        isLoading
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
