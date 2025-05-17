// src/components/comments/CommentList.tsx
import CommentItem from './CommentItem'
import { useSectionPageContext } from '../../contexts/SectionPageContext'

export default function CommentList() {
  const { comments } = useSectionPageContext()

  return (
    <div className="max-w-[600px] mx-auto pb-6">
      <div className="px-2 divide-y divide-gray-100">
        {comments.map((c) => (
          <CommentItem key={c.id} {...c} variant="list" />
        ))}
      </div>
    </div>
  )
}
