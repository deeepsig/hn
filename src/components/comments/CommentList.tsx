// src/components/comments/CommentList.tsx
import CommentItem from './CommentItem'
import { useSectionPageContext } from '../../contexts/SectionPageContext'

export default function CommentList() {
  const { comments, loadMoreComments, hasMoreComments, loadingMore } =
    useSectionPageContext()

  return (
    <div className="max-w-[600px] mx-auto pb-6 text-sm font-inter">
      <div className="px-2 divide-y divide-gray-100">
        {comments.map((c) => (
          <CommentItem key={c.id} {...c} variant="list" />
        ))}

        {hasMoreComments && (
          <div className="py-10 text-center">
            <button
              onClick={loadMoreComments}
              disabled={loadingMore}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
            >
              {loadingMore ? 'Loading…' : 'More'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
