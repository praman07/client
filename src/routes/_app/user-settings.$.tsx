import { UserProfile } from '@clerk/clerk-react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/user-settings/$')({
  component: UserSettingsPage,
})

const appearance = {
  elements: {
    rootBox: 'w-full h-full flex items-center justify-center',
    card: 'shadow-sm border border-border bg-card rounded-xl w-full max-w-4xl h-[800px]',
    navbar: 'hidden md:flex bg-muted/30 border-r border-border p-4', // Sidebar style
    navbarButton: 'text-muted-foreground w-full text-left px-3 py-2 rounded-md hover:bg-muted/50 hover:text-foreground transition-all',
    navbarButtonActive: 'text-foreground bg-background shadow-sm font-medium',
    headerTitle: 'text-xl font-semibold tracking-tight text-foreground',
    headerSubtitle: 'text-muted-foreground text-sm',
    dividerLine: 'bg-border',
    profileSectionTitleText: 'text-foreground font-medium',
    formButtonPrimary: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm',
    formFieldInput: 'bg-background border-input rounded-md ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    footerActionLink: 'text-primary hover:text-primary/90 font-medium',
  },
  variables: {
    fontFamily: 'inherit',
    colorPrimary: '#000000',
    colorText: '#09090b',
    colorBackground: '#ffffff',
    colorInputBackground: '#ffffff',
    colorInputText: '#09090b',
    borderRadius: '0.5rem',
  },
}

function UserSettingsPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4 w-full">
      <UserProfile path="/user-settings" routing="path" appearance={appearance} />
    </div>
  )
}
