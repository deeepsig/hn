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

export default function Navbar() {
  // Navigation link data
  const navigationItems: NavItem[] = [
    { label: 'Top', href: '#', isActive: true },
    { label: 'Ask', href: '#' },
    { label: 'Show', href: '#' },
    { label: 'Best', href: '#' },
    { label: 'New', href: '#' },
    { label: 'Active', href: '#' }
  ]

  // Header icons data
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
        {navigationItems.map((item, index) => (
          <a
            key={index}
            href={item.href}
            className={`px-3 py-2 text-base ${
              item.isActive
                ? 'text-black border-b-2 border-orange-500 font-medium'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            {item.label}
          </a>
        ))}
        <button
          className="text-gray-500 flex items-center"
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
