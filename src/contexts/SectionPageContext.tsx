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
import { getRelativeTime } from '../utils/timeUtils'

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
  time: string
  comments: number
  detailUrl: string
  authorUrl: string
}

export interface CommentItemProps {
  id: number
  author: string
  time: string
  text: string
  postTitle: string
  postUrl?: string
  storyId: number
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

// Base page-size for "normal" pages
const PAGE_SIZE = 15

export default function SectionPageProvider({
  children
}: {
  children: ReactNode
}) {
  const { pathname } = useLocation()

  const initialPageType = useMemo<PageType>(() => {
    const p = pathname.slice(1)
    const capitalized = p.charAt(0).toUpperCase() + p.slice(1)
    return (Object.keys(endpointMap) as PageType[]).includes(
      capitalized as PageType
    )
      ? (capitalized as PageType)
      : 'Top'
  }, [pathname])

  const [pageType, setPageType] = useState<PageType>(initialPageType)
  const [activeTab, setActiveTab] = useState<Tab>('Stories')
  const [askShowView, setAskShowView] = useState<AskShowView>('New')
  const [stories, setStories] = useState<StoryItemProps[]>([])
  const [comments, setComments] = useState<CommentItemProps[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [loadingMore, setLoadingMore] = useState<boolean>(false)

  const [storyIds, setStoryIds] = useState<number[]>([])
  const [commentIds, setCommentIds] = useState<number[]>([])
  const [visibleStoryCount, setVisibleStoryCount] = useState<number>(PAGE_SIZE)
  const [visibleCommentCount, setVisibleCommentCount] =
    useState<number>(PAGE_SIZE)

  async function getItem(id: number): Promise<any> {
    const res = await fetch(
      `https://hacker-news.firebaseio.com/v0/item/${id}.json`
    )
    if (!res.ok) throw new Error(`Failed to fetch item ${id}`)
    return res.json()
  }

  async function findRootStory(comment: any): Promise<any> {
    let current = comment
    while (current && current.type === 'comment') {
      current = await getItem(current.parent)
    }
    return current
  }

  // ───────────────── INITIAL FETCH ─────────────────
  useEffect(() => {
    const resetState = () => {
      setStories([])
      setStoryIds([])
      setVisibleStoryCount(
        pageType === 'Ask' || pageType === 'Show' ? PAGE_SIZE * 2 : PAGE_SIZE
      )
    }

    // Only Stories tab for Ask/Show
    if (pageType === 'New' && activeTab !== 'Stories') {
      resetState()
      return
    }

    setIsLoading(true)
    resetState()

    const key = endpointMap[pageType]
    fetch(`https://hacker-news.firebaseio.com/v0/${key}.json`)
      .then((r) => r.json())
      .then((ids: number[]) => {
        setStoryIds(ids)

        // Decide how many to pull up front:
        const batchSize =
          pageType === 'Ask' || pageType === 'Show' ? PAGE_SIZE * 2 : PAGE_SIZE

        const firstBatch = ids.slice(0, batchSize)
        return Promise.all(
          firstBatch.map((id) =>
            fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(
              (r) => r.json()
            )
          )
        )
      })
      .then((items: any[]) => {
        // Sort first for Ask/Show→Top
        let sorted = items
        if (
          (pageType === 'Ask' || pageType === 'Show') &&
          askShowView === 'Top'
        ) {
          sorted = [...items].sort((a, b) => b.score - a.score)
        }

        // Then map & rank
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

  // ───────────────── PAGINATION ─────────────────
  const loadMoreStories = () => {
    // Never load more in Ask/Show
    if (
      loadingMore ||
      visibleStoryCount >= storyIds.length ||
      pageType === 'Ask' ||
      pageType === 'Show'
    ) {
      return
    }

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
        let sorted = items
        // normal pages never sort; Ask/Show is already blocked above
        // then map & assign proper ranks:
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

  // ───────────────── COMMENTS TAB ─────────────────
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
        const valid = results.filter((c): c is CommentItemProps => Boolean(c))
        setComments(valid)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching comments:', err)
        setIsLoading(false)
      })
  }, [pageType, activeTab])

  // ───────────────── COMMENTS PAGINATION ─────────────────
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
        postUrl: root?.url || `https://news.ycominator.com/item?id=${root?.id}`,
        storyId: root?.id || raw.id
      } as CommentItemProps
    }

    Promise.all(nextBatch.map((id) => processComment(id)))
      .then((results) => {
        const valid = results.filter((c): c is CommentItemProps => Boolean(c))
        setComments((prev) => [...prev, ...valid])
        setVisibleCommentCount((prev) => prev + nextBatch.length)
        setLoadingMore(false)
      })
      .catch((err) => {
        console.error('Error loading more comments:', err)
        setLoadingMore(false)
      })
  }

  const hasMoreStories =
    visibleStoryCount < storyIds.length &&
    pageType !== 'Ask' &&
    pageType !== 'Show'
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
