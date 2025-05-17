// src/components/section-header/SectionHeaderController.tsx
import TopSectionHeader from './TopSectionHeader'
import NewBestSectionHeader from './NewBestSectionHeader'
import AskShowSectionHeader from './AskShowSectionHeader'
import JobsSectionHeader from './JobsSectionHeader'
import { useSectionPageContext } from '../../contexts/SectionPageContext'

export default function SectionHeaderController() {
  const { pageType } = useSectionPageContext()

  if (pageType === 'Top') {
    return <TopSectionHeader />
  }
  if (pageType === 'Jobs') {
    return <JobsSectionHeader />
  }
  if (pageType === 'Ask' || pageType === 'Show') {
    return <AskShowSectionHeader />
  }
  // New or Best
  return <NewBestSectionHeader />
}
