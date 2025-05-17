// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/navbar/Navbar'
import SectionPageController from './pages/SectionPageController'

export default function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/new" replace />} />
        <Route path="/:pageType" element={<SectionPageController />} />
      </Routes>
    </div>
  )
}
