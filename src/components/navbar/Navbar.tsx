// src/components/navbar/Navbar.tsx
import MiddleSectionHandler from './MiddleSectionHandler'
import RightSectionHandler from './RightSectionHandler'
import hnLogo from '../../assets/hn.png'

export default function Navbar() {
  return (
    <header className="flex items-center justify-between bg-white border-b border-gray-200 h-16 px-8 font-inter">
      {/* Left section - Logo and Name */}
      <div className="flex items-center">
        <img src={hnLogo} alt="Hacker News" className="h-5 mr-3" />
        <span className="font-semibold text-gray-700 text-base">
          Hacker News
        </span>
      </div>

      {/* Middle section - Navigation links */}
      <MiddleSectionHandler />

      {/* Right section - Icons */}
      <RightSectionHandler />
    </header>
  )
}
