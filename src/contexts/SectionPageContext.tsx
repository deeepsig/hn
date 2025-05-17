// src/contexts/SectionPageContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from 'react'

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
  const [pageType, setPageType] = useState<PageType>('New')
  const [activeTab, setActiveTab] = useState<Tab>('Stories')
  const [stories, setStories] = useState<StoryItemProps[]>([])
  const [comments, setComments] = useState<CommentItemProps[]>([])

  // Fetch stories when pageType or activeTab change
  useEffect(() => {
    if (activeTab !== 'Stories') return

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
      })
  }, [pageType, activeTab])

  // Fetch recent comments when activeTab is “Comments”
  useEffect(() => {
    if (activeTab !== 'Comments') return

    fetch('https://hacker-news.firebaseio.com/v0/updates.json')
      .then((r) => r.json())
      .then((data: { items: number[] }) => {
        // take first 30 updated item IDs
        return Promise.all(
          data.items.slice(0, 30).map((id) =>
            fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
              .then((r) => r.json())
              .then((item: any) => {
                if (item.type !== 'comment') return null
                return { raw: item }
              })
          )
        )
      })
      .then((maybeComments) =>
        Promise.all(
          (maybeComments.filter(Boolean) as { raw: any }[]).map(
            async ({ raw }) => {
              // fetch parent story for title/url
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
            }
          )
        )
      )
      .then((list: CommentItemProps[]) => setComments(list))
  }, [activeTab])

  return (
    <SectionPageContext.Provider
      value={{
        pageType,
        setPageType,
        activeTab,
        setActiveTab,
        stories,
        comments
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
