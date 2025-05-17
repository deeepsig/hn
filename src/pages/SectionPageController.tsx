// src/pages/SectionPageController.tsx
import { useParams, Navigate } from 'react-router-dom'
import SectionPage from './SectionPage'

export default function SectionPageController() {
  const { pageType } = useParams<{ pageType: string }>()
  const allowed = ['top', 'ask', 'show', 'best', 'new', 'active']

  if (!pageType || !allowed.includes(pageType)) {
    return <Navigate to="/new" replace />
  }

  const cap = (s: string) => s[0].toUpperCase() + s.slice(1)
  return <SectionPage pageType={cap(pageType)} />
}
