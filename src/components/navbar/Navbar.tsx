// src/components/navbar/Navbar.tsx
import MiddleSectionHandler from './MiddleSectionHandler'
import RightSectionHandler from './RightSectionHandler'
import hnLogo from '../../assets/hn.png'

export default function Navbar() {
  return (
    <header className="flex items-center justify-between h-16 px-4 sm:px-8 bg-white border-b border-gray-200 font-inter">
      <div className="flex items-center">
        <img src={hnLogo} alt="SPC News" className="h-6 sm:h-5 mr-3" />
        {/* Hide text on screens smaller than 'sm' */}
        <span className="hidden sm:inline text-sm sm:text-base font-semibold text-gray-700">
          SPC Maker News
        </span>
      </div>
      <MiddleSectionHandler />
      <RightSectionHandler />
    </header>
  )
}
