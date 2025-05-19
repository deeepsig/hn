// src/pages/SectionPageController.tsx
import { useEffect } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import SectionPage from './SectionPage'
import { useSectionPageContext, PageType } from '../contexts/SectionPageContext'

// 1) define your literal tuple and derive the union type
const allowed = ['top', 'ask', 'show', 'best', 'new', 'jobs'] as const
type AllowedParam = (typeof allowed)[number] // 'top' | 'ask' | 'show' | 'best' | 'new' | 'jobs'

// 2) type‑guard function
function isAllowedParam(x: string): x is AllowedParam {
  return (allowed as readonly string[]).includes(x)
}

export default function SectionPageController() {
  const { pageType: ctxPageType, setPageType } = useSectionPageContext()

  const { pageType: rawParam } = useParams<{ pageType: string }>()

  // redirect if missing or not in our allowed list
  if (!rawParam || !isAllowedParam(rawParam)) {
    return <Navigate to="/show" replace />
  }

  // now rawParam is narrowed to AllowedParam
  useEffect(() => {
    // capitalize: 'new' → 'New', etc.
    const normalized = (rawParam[0].toUpperCase() +
      rawParam.slice(1)) as PageType

    if (normalized !== ctxPageType) {
      setPageType(normalized)
    }
  }, [rawParam, ctxPageType, setPageType])

  return <SectionPage />
}
