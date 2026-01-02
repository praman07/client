export type UIConfig = {
  theme: 'light' | 'dark' | 'system'
  features: {
    [key: string]: boolean
  }
  layout: {
    sidebarCollapsed: boolean
  }
}

export const defaultUIConfig: UIConfig = {
  theme: 'system',
  features: {
    experimental: false,
  },
  layout: {
    sidebarCollapsed: false,
  },
}
