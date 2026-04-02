import { useClerk } from '@clerk/clerk-react'
import { AlertTriangle, LogOut, Shield } from 'lucide-react'
import { useUser } from '@/entities/user'
import { Badge } from '@/shared/ui/primitives/badge'
import { Button } from '@/shared/ui/primitives/button'
import { Separator } from '@/shared/ui/primitives/separator'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/ui/primitives/alert-dialog'

export function UserAccountPage() {
  const { user } = useUser()
  const { signOut } = useClerk()

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold">Account</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your sign-in method and account security.</p>
      </div>

      {/* Email / Identity */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Identity</h3>
        <div className="rounded-xl border bg-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Email address</p>
              <p className="text-sm text-muted-foreground">{user?.email ?? '—'}</p>
            </div>
            <Badge variant="secondary" className="text-xs">
              <Shield className="h-3 w-3 mr-1" />
              Verified
            </Badge>
          </div>
        </div>
      </div>

      <Separator />

      {/* Sessions */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Session</h3>
        <div className="rounded-xl border bg-card p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Current session</p>
            <p className="text-xs text-muted-foreground mt-0.5">Active on this device</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/10"
            onClick={() => void signOut({ redirectUrl: '/sign-in' })}
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </Button>
        </div>
      </div>

      <Separator />

      {/* Danger zone */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-destructive uppercase tracking-wider flex items-center gap-1.5">
          <AlertTriangle className="h-4 w-4" />
          Danger zone
        </h3>
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Delete account</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Permanently delete your account and all associated data. This cannot be undone.
            </p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-destructive text-destructive-foreground hover:bg-destructive/90 h-9 px-3">
              Delete account
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete your account, remove you from all workspaces, and erase all your data.
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Yes, delete my account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  )
}
