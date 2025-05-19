// src/components/navbar/MiddleSectionHandler.tsx
import { NavLink } from 'react-router-dom'
// import { CaretDown } from '@phosphor-icons/react'
import { NavItem } from '../../types/navigation'

const navigationItems: NavItem[] = [
  { label: 'Top', href: '/top' },
  { label: 'Ask', href: '/ask' },
  { label: 'Show', href: '/show' },
  { label: 'Best', href: '/best' },
  { label: 'New', href: '/new' },
  { label: 'Jobs', href: '/jobs' }
]

export default function MiddleSectionHandler() {
  return (
    <nav className="flex h-full">
      {navigationItems.map((item) => (
        <NavLink
          key={item.label}
          to={item.href}
          className={({ isActive }) =>
            `flex items-center px-2 md:px-4 lg:px-8 h-full text-sm sm:text-base ${
              isActive
                ? 'text-orange-500 font-medium border-b-2 border-orange-500'
                : 'text-black hover:text-gray-800'
            }`
          }
        >
          {item.label}
        </NavLink>
      ))}
      {/* <button
        className="flex items-center h-full px-6 text-gray-500"
        aria-label="More options"
      >
        <CaretDown size={16} weight="bold" />
      </button> */}
    </nav>
  )
}
