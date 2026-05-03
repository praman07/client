import { Outlet } from '@tanstack/react-router'

/**
 * UserSettingsLayout — fluid wrapper for all /user/* child pages.
 * Navigation is natively handled by the global UserSidebar layer.
 */
export function UserSettingsLayout() {
  return (
    <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 lg:py-12 flex-1 relative min-h-full">
      <Outlet />
    </div>
  )
}

