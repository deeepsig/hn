// src/pages/SectionPage.tsx
import SectionHeaderController from '../components/section-header/SectionHeaderController'
import StoryList from '../components/story/StoryList'
import CommentList from '../components/comments/CommentList'
import { useSectionPageContext } from '../contexts/SectionPageContext'
import hnLogo from '../assets/hn.png'

export default function SectionPage() {
  const { activeTab, isLoading, pageType } = useSectionPageContext()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <img
          src={hnLogo}
          alt="Loading..."
          className="w-12 h-12"
          style={{ transform: 'translateY(-10vh)' }}
        />
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-0">
      <SectionHeaderController />
      {pageType === 'New' && activeTab === 'Comments' ? (
        <CommentList />
      ) : (
        <StoryList />
      )}
    </div>
  )
}
