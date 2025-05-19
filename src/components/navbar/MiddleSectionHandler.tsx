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
    <nav className="flex h-full space-x-2 md:space-x-4 lg:space-x-6">
      {navigationItems.map((item) => (
        <NavLink
          key={item.label}
          to={item.href}
          className={({ isActive }) =>
            `flex items-center h-full text-base px-2 lg:px-4 ${
              isActive
                ? 'text-orange-500 font-medium border-b-2 border-orange-500'
                : 'text-black hover:text-gray-800'
            }`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}
