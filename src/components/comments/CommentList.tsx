// src/components/comments/CommentList.tsx

import comments from '../../data/comments'
import CommentItem from './CommentItem'

export default function CommentList() {
  return (
    <div className="max-w-[600px] mx-auto pt-4 pb-6">
      <div className="px-2">
        {comments.map((c) => (
          <CommentItem key={c.id} {...c} />
        ))}
      </div>
    </div>
  )
}
