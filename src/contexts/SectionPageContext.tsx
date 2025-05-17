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
export type PageType = 'Top' | 'New' | 'Best' | 'Ask' | 'Show' | 'Active'

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
  Active: 'jobstories'
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
    return Object.keys(endpointMap).includes(capitalized)
      ? (capitalized as PageType)
      : 'New'
  }, [pathname])

  const [pageType, setPageType] = useState<PageType>(initialPageType)
  const [activeTab, setActiveTab] = useState<Tab>('Stories')
  const [stories, setStories] = useState<StoryItemProps[]>([])
  const [comments, setComments] = useState<CommentItemProps[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Fetch stories
  useEffect(() => {
    if (activeTab !== 'Stories') return

    setIsLoading(true)
    const key = endpointMap[pageType]
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
  }, [pageType, activeTab])

  // Fetch comments
  useEffect(() => {
    if (activeTab !== 'Comments') return

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
          (maybe.filter(Boolean) as { raw: any }[]).map(async ({ raw }) => {
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
  }, [activeTab])

  return (
    <SectionPageContext.Provider
      value={{
        pageType,
        setPageType,
        activeTab,
        setActiveTab,
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
  if (!ctx)
    throw new Error(
      'useSectionPageContext must be used inside SectionPageProvider'
    )
  return ctx
}
