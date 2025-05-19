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
import {
  fetchIdsForSection,
  fetchItemsByIds,
  fetchItem,
  fetchRootComment,
  BASE_URL
} from '../api/hackerNewsApi'

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
    return (
      ['Top', 'New', 'Best', 'Ask', 'Show', 'Jobs'] as PageType[]
    ).includes(capitalized as PageType)
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

  // ───────────────── INITIAL FETCH ─────────────────
  useEffect(() => {
    const resetStoriesState = () => {
      setStories([])
      setStoryIds([])
      setVisibleStoryCount(
        pageType === 'Ask' || pageType === 'Show' ? PAGE_SIZE * 2 : PAGE_SIZE
      )
    }

    // Ask/Show only supports Stories tab
    if (
      (pageType === 'Ask' || pageType === 'Show') &&
      activeTab !== 'Stories'
    ) {
      resetStoriesState()
      return
    }

    setIsLoading(true)
    resetStoriesState()

    // fetch IDs
    const sectionKey = pageType.toLowerCase()
    fetchIdsForSection(sectionKey)
      .then((ids) => {
        setStoryIds(ids)

        const batchSize =
          pageType === 'Ask' || pageType === 'Show' ? PAGE_SIZE * 2 : PAGE_SIZE

        return Promise.all(ids.slice(0, batchSize).map((id) => fetchItem(id)))
      })
      .then((items: any[]) => {
        let sortedItems = items
        if (
          (pageType === 'Ask' || pageType === 'Show') &&
          askShowView === 'Top'
        ) {
          sortedItems = [...items].sort(
            (a, b) => (b.score || 0) - (a.score || 0)
          )
        }

        const mapped = sortedItems.map((i, idx) => ({
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
    if (
      loadingMore ||
      visibleStoryCount >= storyIds.length ||
      pageType === 'Ask' ||
      pageType === 'Show'
    ) {
      return
    }

    setLoadingMore(true)
    const nextIds = storyIds.slice(
      visibleStoryCount,
      visibleStoryCount + PAGE_SIZE
    )

    fetchItemsByIds(nextIds)
      .then((items: any[]) => {
        const mapped = items.map((i, idx) => ({
          index: i.id,
          rank: visibleStoryCount + idx + 1,
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

        setStories((prev) => [...prev, ...mapped])
        setVisibleStoryCount((prev) => prev + nextIds.length)
      })
      .catch((err) => {
        console.error('Error loading more stories:', err)
      })
      .finally(() => {
        setLoadingMore(false)
      })
  }

  // ───────────────── COMMENTS TAB in New ─────────────────
  useEffect(() => {
    const resetCommentsState = () => {
      setComments([])
      setCommentIds([])
      setVisibleCommentCount(PAGE_SIZE)
    }

    if (activeTab !== 'Comments' || pageType !== 'New') {
      resetCommentsState()
      return
    }

    setIsLoading(true)
    resetCommentsState()

    fetch(`${BASE_URL}/updates.json`)
      .then((r) => r.json())
      .then(async (data: { items: number[] }) => {
        setCommentIds(data.items)
        const firstBatch = data.items.slice(0, PAGE_SIZE)
        const processed = await Promise.all(
          firstBatch.map(async (id) => {
            const raw = await fetchItem(id)
            if (raw?.type !== 'comment') return null
            const rootId = await fetchRootComment(id)
            const root = await fetchItem(rootId)
            return {
              id: raw.id,
              author: raw.by || '[deleted]',
              time: getRelativeTime(raw.time || Date.now() / 1000),
              text: raw.text || '',
              postTitle: root?.title || '[deleted]',
              postUrl:
                root?.url ?? `https://news.ycombinator.com/item?id=${root?.id}`,
              storyId: root?.id || raw.id
            } as CommentItemProps
          })
        )
        setComments(processed.filter((c): c is CommentItemProps => !!c))
      })
      .catch((err) => {
        console.error('Error fetching comments:', err)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [pageType, activeTab])

  // ───────────────── COMMENTS PAGINATION ─────────────────
  const loadMoreComments = () => {
    if (loadingMore || visibleCommentCount >= commentIds.length) return

    setLoadingMore(true)
    const nextIds = commentIds.slice(
      visibleCommentCount,
      visibleCommentCount + PAGE_SIZE
    )

    Promise.all(
      nextIds.map(async (id) => {
        const raw = await fetchItem(id)
        if (raw.type !== 'comment') return null
        const rootId = await fetchRootComment(id)
        const root = await fetchItem(rootId)
        return {
          id: raw.id,
          author: raw.by || '[deleted]',
          time: getRelativeTime(raw.time || Date.now() / 1000),
          text: raw.text || '',
          postTitle: root?.title || '[deleted]',
          postUrl:
            root?.url ?? `https://news.ycombinator.com/item?id=${root?.id}`,
          storyId: root?.id || raw.id
        } as CommentItemProps
      })
    )
      .then((results) => {
        const valid = results.filter((c): c is CommentItemProps => !!c)
        setComments((prev) => [...prev, ...valid])
        setVisibleCommentCount((prev) => prev + nextIds.length)
      })
      .catch((err) => {
        console.error('Error loading more comments:', err)
      })
      .finally(() => {
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
