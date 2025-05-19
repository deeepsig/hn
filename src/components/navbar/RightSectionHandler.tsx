import {
  MagnifyingGlass,
  User,
  ClockCounterClockwise,
  TextAa
} from '@phosphor-icons/react'
import { NavIconItem } from '../../types/navigation'

// Header icons data - defined inside the component
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

export default function RightSectionHandler() {
  return (
    <div className="hidden lg:flex items-center space-x-2 md:space-x-4 lg:space-x-8">
      {headerIcons.map((item, index) => (
        <button
          key={index}
          className="text-gray-500 cursor-help"
          aria-label={item.ariaLabel}
          onClick={item.onClick}
          title="Coming soon"
        >
          {item.icon}
        </button>
      ))}
    </div>
  )
}
