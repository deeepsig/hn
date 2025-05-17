// src/pages/SectionPage.tsx
import { useEffect, useState } from 'react'
import SectionHeaderController from '../components/section-header/SectionHeaderController'
import StoryList from '../components/story/StoryList'
import type { StoryItemProps } from '../components/story/StoryItem'

const endpointMap: Record<string, string> = {
  Top: 'topstories',
  New: 'newstories',
  Best: 'beststories',
  Ask: 'askstories',
  Show: 'showstories',
  Active: 'jobstories'
}

export default function SectionPage({ pageType }: { pageType: string }) {
  const [stories, setStories] = useState<StoryItemProps[]>([])

  useEffect(() => {
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
      .then((items: any[]) =>
        setStories(
          items.map((i) => ({
            index: i.id,
            title: i.title,
            url: i.url ?? `https://news.ycombinator.com/item?id=${i.id}`,
            source: i.url ? new URL(i.url).host : 'news.ycombinator.com',
            points: i.score,
            author: i.by,
            time: new Date(i.time * 1000).toLocaleString(),
            comments: i.descendants ?? 0
          }))
        )
      )
  }, [pageType])

  return (
    <>
      <SectionHeaderController pageType={pageType as any} />
      <StoryList storiesData={stories} />
    </>
  )
}
