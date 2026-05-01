import { useClerk } from '@clerk/clerk-react'
import { LogOut, Shield } from 'lucide-react'
import { useUser } from '@/entities/user'
import { Badge } from '@/shared/ui/primitives/badge'
import { Button } from '@/shared/ui/primitives/button'
import { Separator } from '@/shared/ui/primitives/separator'

export function UserSettingsPage() {
  const { user } = useUser()
  const { signOut } = useClerk()

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-20 sm:text-24 font-bold tracking-tight">Settings</h1>
        <p className="text-13 sm:text-14 text-secondary mt-1">Manage your sign-in method and account security.</p>
      </div>

      {/* Email / Identity */}
      <div className="space-y-4">
        <h3 className="text-13 font-medium text-secondary uppercase tracking-wider">Identity</h3>
        <div className="rounded-xl border border-subtle bg-layer-1 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-13 font-medium text-primary">Email address</p>
              <p className="text-13 text-secondary break-all">{user?.email ?? '—'}</p>
            </div>
            <div className="self-start sm:self-auto">
              <Badge variant="secondary" className="text-12">
                <Shield className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Sessions */}
      <div className="space-y-4">
        <h3 className="text-13 font-medium text-secondary uppercase tracking-wider">Session</h3>
        <div className="rounded-xl border border-subtle bg-layer-1 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-13 font-medium text-primary">Current session</p>
            <p className="text-11 text-tertiary mt-0.5">Active on this device</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-danger-primary border-danger-strong hover:bg-danger-subtle sm:w-auto w-full"
            onClick={() => void signOut({ redirectUrl: '/sign-in' })}
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </Button>
        </div>
      </div>

      <Separator />
    </div>
  )
}
