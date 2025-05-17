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

  // Fetch stories (handles Top, Jobs, New/Best Stories,
  // and Ask/Show Top vs New)
  useEffect(() => {
    setIsLoading(true)
    const key = endpointMap[pageType]

    // Ask & Show: always fetch stories, toggle Top/New
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
          let mapped = items.map((i, idx) => ({
            index: i.id,
            rank: idx + 1,
            title: i.title,
            url: i.url ?? `https://news.ycombinator.com/item?id=${i.id}`,
            source: i.url ? new URL(i.url).host : 'news.ycombinator.com',
            points: i.score,
            author: i.by,
            time: new Date(i.time * 1000).toLocaleString(),
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

    // New/Best: if not on Stories tab, skip
    if (
      (pageType === 'New' || pageType === 'Best') &&
      activeTab !== 'Stories'
    ) {
      setIsLoading(false)
      return
    }

    // Top, Jobs, or New/Best Stories:
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
          time: new Date(i.time * 1000).toLocaleString(),
          comments: i.descendants ?? 0,
          detailUrl: `#/story/${i.id}`,
          authorUrl: `#/user/${i.by}`
        }))
        setStories(mapped)
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [pageType, activeTab, askShowView])

  // Fetch comments only on New/Best → Comments tab
  useEffect(() => {
    if (activeTab !== 'Comments' || !['New', 'Best'].includes(pageType)) {
      return
    }

    setIsLoading(true)
    fetch('https://hacker-news.firebaseio.com/v0/updates.json')
      .then((r) => r.json())
      .then((data: { items: number[] }) =>
        Promise.all(
          data.items.slice(0, 30).map((id) =>
            fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
              .then((r) => r.json())
              .then((item: any) =>
                item.type === 'comment' ? { raw: item } : null
              )
          )
        )
      )
      .then((maybe) =>
        Promise.all(
          (
            maybe.filter(Boolean) as {
              raw: any
            }[]
          ).map(async ({ raw }) => {
            const parent = await fetch(
              `https://hacker-news.firebaseio.com/v0/item/${raw.parent}.json`
            ).then((r) => r.json())
            return {
              id: raw.id,
              author: raw.by,
              time: new Date(raw.time * 1000).toLocaleString(),
              text: raw.text,
              postTitle: parent.title,
              postUrl:
                parent.url ??
                `https://news.ycombinator.com/item?id=${parent.id}`
            }
          })
        )
      )
      .then((list: CommentItemProps[]) => {
        setComments(list)
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
