import {
  MagnifyingGlass,
  User,
  ClockCounterClockwise,
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
    icon: <TextAa size={24} weight="light" />,
    ariaLabel: 'Text settings'
  },
  {
    icon: <ClockCounterClockwise size={24} weight="light" />,
    ariaLabel: 'History'
  },
  {
    icon: <User size={24} weight="light" />,
    ariaLabel: 'Profile'
  },
  {
    icon: <MagnifyingGlass size={24} weight="light" />,
    ariaLabel: 'Search'
  }
]

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
      <nav className="hidden md:flex h-full">
        {navigationItems.map((item, index) => (
          <div key={index} className="relative h-full flex items-center px-6">
            <a
              href={item.href}
              className={`text-base ${
                item.isActive
                  ? 'text-orange-500 font-medium'
                  : 'text-black hover:text-gray-800'
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
          className="text-gray-500 flex items-center h-full px-6"
          aria-label="More options"
        >
          <CaretDown size={16} weight="bold" />
        </button>
      </nav>

      {/* Right section - Icons */}
      <div className="flex items-center space-x-8">
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
