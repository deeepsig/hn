// src/components/comments/CommentList.tsx

import comments from '../../data/comments'
import CommentItem from './CommentItem'

export default function CommentList() {
  return (
    <div className="max-w-[600px] mx-auto pb-6">
      <div className="px-2">
        {comments.map((c) => (
          <CommentItem key={c.id} {...c} variant="list" />
        ))}
      </div>
    </div>
  )
}
