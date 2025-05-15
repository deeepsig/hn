import {
  MagnifyingGlass,
  User,
  Clock,
  CaretDown,
  TextAa
} from '@phosphor-icons/react'
import hnLogo from '../../assets/hn.png'

// Types
type NavItem = {
  label: string
  href: string
  isActive?: boolean
}

type NavIconItem = {
  icon: React.ReactNode
  ariaLabel: string
  onClick?: () => void
}

// Navigation link data - defined outside the component
const navigationItems: NavItem[] = [
  { label: 'Top', href: '#', isActive: true },
  { label: 'Ask', href: '#' },
  { label: 'Show', href: '#' },
  { label: 'Best', href: '#' },
  { label: 'New', href: '#' },
  { label: 'Active', href: '#' }
]

// Header icons data - defined outside the component
const headerIcons: NavIconItem[] = [
  {
    icon: <TextAa size={24} weight="regular" />,
    ariaLabel: 'Text settings'
  },
  {
    icon: <Clock size={24} />,
    ariaLabel: 'History'
  },
  {
    icon: <User size={24} />,
    ariaLabel: 'Profile'
  },
  {
    icon: <MagnifyingGlass size={24} />,
    ariaLabel: 'Search'
  }
]

export default function Navbar() {
  return (
    <header className="flex items-center justify-between bg-white border-b border-gray-200 px-6 font-inter">
      {/* Left section - Logo and Name */}
      <div className="flex items-center">
        <img src={hnLogo} alt="Hacker News" className="h-5 mr-3" />
        <span className="font-semibold text-gray-700 text-base">
          Hacker News
        </span>
      </div>

      {/* Middle section - Navigation links */}
      <nav className="hidden md:flex items-end">
        {navigationItems.map((item, index) => (
          <div key={index} className="relative">
            <a
              href={item.href}
              className={`px-4 py-3 inline-block text-base ${
                item.isActive
                  ? 'text-black font-medium'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {item.label}
            </a>
            {item.isActive && (
              <div className="absolute bottom-0 left-0 h-0.5 w-full bg-orange-500"></div>
            )}
          </div>
        ))}
        <button
          className="text-gray-500 flex items-center ml-2 py-3"
          aria-label="More options"
        >
          <CaretDown size={20} />
        </button>
      </nav>

      {/* Right section - Icons */}
      <div className="flex items-center space-x-6">
        {headerIcons.map((item, index) => (
          <button
            key={index}
            className="text-gray-500"
            aria-label={item.ariaLabel}
            onClick={item.onClick}
          >
            {item.icon}
          </button>
        ))}
      </div>
    </header>
  )
}
