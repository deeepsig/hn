// src/components/navbar/MiddleSectionHandler.tsx
import { CaretDown } from '@phosphor-icons/react'
import { NavItem } from '../../types/navigation'

// Navigation link data - defined inside the component
const navigationItems: NavItem[] = [
  { label: 'Top', href: '#', isActive: true },
  { label: 'Ask', href: '#' },
  { label: 'Show', href: '#' },
  { label: 'Best', href: '#' },
  { label: 'New', href: '#' },
  { label: 'Active', href: '#' }
]

export default function MiddleSectionHandler() {
  return (
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
  )
}
