const TABS = [
  'Home',
  'Chat',
  'Whiteboard',
  'Pages',
  'Vault',
  'Issues',
  'Settings',
] as const

export function MockupTabs({ active = 'Chat' }: { active?: string }) {
  return (
    <div className="flex h-12 shrink-0 items-center gap-6 border-b border-border/60 bg-background px-6 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {TABS.map((tab) => {
        const isActive = tab === active
        return (
          <div
            key={tab}
            className={`relative flex h-12 items-center text-12 font-medium transition-colors select-none ${
              isActive
                ? 'text-primary font-semibold'
                : 'text-tertiary'
            }`}
          >
            {tab}
            {isActive && (
              <div className="absolute -bottom-px left-0 right-0 h-0.5 bg-foreground" />
            )}
          </div>
        )
      })}
    </div>
  )
}
