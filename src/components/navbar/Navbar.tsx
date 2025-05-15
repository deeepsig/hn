import {
  MagnifyingGlass,
  User,
  BookmarkSimple,
  Clock,
  CaretDown
} from '@phosphor-icons/react'
import hnLogo from '../../assets/hn.png'

export default function Navbar() {
  return (
    <header className="flex items-center justify-between bg-white border-b border-gray-200 px-2 h-12 font-inter">
      {/* Left section - Logo and Name */}
      <div className="flex items-center">
        <img src={hnLogo} alt="Hacker News" className="h-6 mr-2" />
        <span className="font-semibold text-gray-700">Hacker News</span>
      </div>
      {/* Middle section - Navigation links */}
      <nav className="hidden md:flex items-center space-x-4">
        <a
          href="#"
          className="px-2 py-1 text-black border-b-2 border-orange-500"
        >
          Top
        </a>
        <a href="#" className="px-2 py-1 text-gray-500 hover:text-gray-800">
          Ask
        </a>
        <a href="#" className="px-2 py-1 text-gray-500 hover:text-gray-800">
          Show
        </a>
        <a href="#" className="px-2 py-1 text-gray-500 hover:text-gray-800">
          Best
        </a>
        <a href="#" className="px-2 py-1 text-gray-500 hover:text-gray-800">
          New
        </a>
        <a href="#" className="px-2 py-1 text-gray-500 hover:text-gray-800">
          Active
        </a>
        <button className="text-gray-500 flex items-center">
          <CaretDown size={16} />
        </button>
      </nav>
      {/* Right section - Icons */}
      <div className="flex items-center space-x-4">
        <button className="text-gray-500">
          <span className="text-lg">Aa</span>
        </button>
        <button className="text-gray-500">
          <Clock size={20} />
        </button>
        <button className="text-gray-500">
          <BookmarkSimple size={20} />
        </button>
        <button className="text-gray-500">
          <User size={20} />
        </button>
        <button className="text-gray-500">
          <MagnifyingGlass size={20} />
        </button>
      </div>
    </header>
  )
}
