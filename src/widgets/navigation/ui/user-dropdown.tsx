import { useClerk } from '@clerk/clerk-react'
import { useNavigate } from '@tanstack/react-router'
import { LayoutGrid, LogOut, Settings } from 'lucide-react'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/ui/primitives/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/primitives/dropdown-menu'
import { useUser } from '@/entities/user'

/**
 * UserDropdown — replaces Clerk's <UserButton>.
 *
 * Sources avatar and display name from the Postgres DB user (via useUser),
 * not from Clerk's client-side object — ensuring the displayed data is
 * consistent with what the rest of the app sees.
 */
export function UserDropdown() {
  const { signOut } = useClerk()
  const { user } = useUser()
  const navigate = useNavigate()

  const initials = user?.fullName
    ? user.fullName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="rounded-full outline-none cursor-pointer"
        aria-label="User menu"
      >
        <Avatar className="h-8 w-8">
          <AvatarImage src={user?.avatarUrl ?? undefined} alt={user?.fullName ?? 'User'} />
          <AvatarFallback className="text-xs font-medium">{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-52">
        {/* User Info */}
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium leading-none truncate">{user?.fullName ?? 'User'}</p>
          <p className="text-xs text-secondary mt-0.5 truncate">{user?.email}</p>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => void navigate({ to: '/user/profile' as never })}
          className="gap-2 cursor-pointer"
        >
          <Settings className="h-4 w-4 text-secondary" />
          Profile & Settings
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => void navigate({ to: '/user/workspaces' as never })}
          className="gap-2 cursor-pointer"
        >
          <LayoutGrid className="h-4 w-4 text-secondary" />
          My Workspaces
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => void signOut({ redirectUrl: '/sign-in' })}
          className="gap-2 cursor-pointer text-danger-primary focus:text-danger-primary"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
