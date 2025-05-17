// src/components/section-header/SectionHeaderController.tsx
import TopSectionHeader from './TopSectionHeader'
import NewSectionHeader from './NewSectionHeader'
import BestSectionHeader from './BestSectionHeader'
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
  if (pageType === 'Best') {
    return <BestSectionHeader />
  }
  // New
  return <NewSectionHeader />
}
