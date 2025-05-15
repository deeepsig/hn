// src/types/navigation.ts
export type NavItem = {
  label: string
  href: string
  isActive?: boolean
}

export type NavIconItem = {
  icon: React.ReactNode
  ariaLabel: string
  onClick?: () => void
}
