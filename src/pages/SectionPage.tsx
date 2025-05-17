// src/pages/SectionPage.tsx
import SectionHeaderController from '../components/section-header/SectionHeaderController'
import StoryList from '../components/story/StoryList'
import CommentList from '../components/comments/CommentList'
import { useSectionPageContext } from '../contexts/SectionPageContext'

export default function SectionPage() {
  const { activeTab } = useSectionPageContext()

  return (
    <>
      <SectionHeaderController />
      {activeTab === 'Stories' ? <StoryList /> : <CommentList />}
    </>
  )
}
