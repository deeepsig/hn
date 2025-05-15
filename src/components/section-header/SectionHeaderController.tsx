import { ReactNode } from 'react'
import TopSectionHeader from './TopSectionHeader'
import OtherSectionHeader from './OtherSectionHeader'

// Define the page types that our app supports
export type PageType = 'Top' | 'New' | 'Best'

// Interface for the component props
interface SectionHeaderControllerProps {
  pageType: PageType
}

/**
 * SectionHeaderController component
 *
 * Manages which header component to render based on the current page type:
 * - TopSectionHeader for the "Top" page
 * - OtherSectionHeader for "New" and "Best" pages
 */
export default function SectionHeaderController({
  pageType
}: SectionHeaderControllerProps): ReactNode {
  // Render the appropriate header based on page type
  if (pageType === 'Top') {
    return <TopSectionHeader />
  } else {
    return <OtherSectionHeader pageType={pageType} />
  }
}
