export type SubItem = {
  title: string
  link: string
  description?: string
  image?: string | null
}

export type MenuItem = {
  id: string
  title: string
  link: string
  icon?: string | null
  image?: string | null
  action?: string | null
  buttonLabel?: string | null
  hasDropdown: boolean
  submenu?: SubItem[]
}

export type BottomMenuItem = {
  id: string
  title: string
  link?: string
  action?: string
  icon?: string
}

export type MenuResponse = {
  menuItems: MenuItem[]
  bottomMenuItems?: BottomMenuItem[]
}
