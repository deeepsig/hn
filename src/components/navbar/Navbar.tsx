import {
  MagnifyingGlass,
  User,
  Clock,
  CaretDown,
  TextAa
} from '@phosphor-icons/react'
import hnLogo from '../../assets/hn.png'

export default function Navbar() {
  return (
    <header className="flex items-center justify-between bg-white border-b border-gray-200 px-6 py-3 font-inter">
      {/* Left section - Logo and Name */}
      <div className="flex items-center">
        <img src={hnLogo} alt="Hacker News" className="h-5 mr-3" />
        <span className="font-semibold text-gray-700 text-base">
          Hacker News
        </span>
      </div>
      {/* Middle section - Navigation links */}
      <nav className="hidden md:flex items-center space-x-6">
        <a
          href="#"
          className="px-3 py-2 text-black border-b-2 border-orange-500 text-base font-medium"
        >
          Top
        </a>
        <a
          href="#"
          className="px-3 py-2 text-gray-500 hover:text-gray-800 text-base"
        >
          Ask
        </a>
        <a
          href="#"
          className="px-3 py-2 text-gray-500 hover:text-gray-800 text-base"
        >
          Show
        </a>
        <a
          href="#"
          className="px-3 py-2 text-gray-500 hover:text-gray-800 text-base"
        >
          Best
        </a>
        <a
          href="#"
          className="px-3 py-2 text-gray-500 hover:text-gray-800 text-base"
        >
          New
        </a>
        <a
          href="#"
          className="px-3 py-2 text-gray-500 hover:text-gray-800 text-base"
        >
          Active
        </a>
        <button className="text-gray-500 flex items-center">
          <CaretDown size={20} />
        </button>
      </nav>
      {/* Right section - Icons */}
      <div className="flex items-center space-x-6">
        <button className="text-gray-500">
          <TextAa size={24} weight="regular" />
        </button>
        <button className="text-gray-500">
          <Clock size={24} />
        </button>
        <button className="text-gray-500">
          <User size={24} />
        </button>
        <button className="text-gray-500">
          <MagnifyingGlass size={24} />
        </button>
      </div>
    </header>
  )
}
