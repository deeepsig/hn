// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/navbar/Navbar'
import SectionPageController from './pages/SectionPageController'
import SectionPageProvider from './contexts/SectionPageContext'

export default function App() {
  return (
    <SectionPageProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/new" replace />} />
        <Route path="/:pageType" element={<SectionPageController />} />
      </Routes>
    </SectionPageProvider>
  )
}
