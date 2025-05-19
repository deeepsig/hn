// src/api/hackerNewsApi.ts
export const BASE_URL = 'https://hacker-news.firebaseio.com/v0'

export const fetchItem = async (id: number) => {
  const res = await fetch(`${BASE_URL}/item/${id}.json`)
  if (!res.ok) throw new Error('Failed to fetch item')
  return res.json()
}

export const fetchIdsForSection = async (
  section: string
): Promise<number[]> => {
  const endpoint = section === 'best' ? 'beststories' : `${section}stories`
  const res = await fetch(`${BASE_URL}/${endpoint}.json`)
  if (!res.ok) throw new Error('Failed to fetch IDs')
  return res.json()
}

export const fetchItemsByIds = async (ids: number[]) => {
  return Promise.all(ids.map(fetchItem))
}

export const fetchRootComment = async (commentId: number): Promise<number> => {
  const comment = await fetchItem(commentId)
  if (!comment || !comment.parent) return commentId
  let current = comment
  while (current && current.type === 'comment') {
    current = await fetchItem(current.parent)
    if (current && current.type === 'story') return current.id
  }
  return commentId
}
