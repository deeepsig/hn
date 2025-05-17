// src/components/section-header/SectionHeaderController.tsx
import TopSectionHeader from './TopSectionHeader'
import OtherSectionHeader from './OtherSectionHeader'
import { useSectionPageContext } from '../../contexts/SectionPageContext'

export default function SectionHeaderController() {
  const { pageType } = useSectionPageContext()

  if (pageType === 'Top') {
    return <TopSectionHeader />
  }
  return <OtherSectionHeader />
}
