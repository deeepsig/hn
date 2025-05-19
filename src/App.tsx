// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/navbar/Navbar'
import SectionPageController from './pages/SectionPageController'
import SectionPageProvider from './contexts/SectionPageContext'
import StoryThreadPage from './pages/StoryThreadPage'

export default function App() {
  return (
    <SectionPageProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/show" replace />} />
        <Route path="/:pageType" element={<SectionPageController />} />
        <Route path="/story/:storyId" element={<StoryThreadPage />} />
      </Routes>
    </SectionPageProvider>
  )
}
