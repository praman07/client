import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useCreateDmModal } from '../hooks/use-create-dm-modal'
import { useCreateDm } from '../hooks/use-create-dm'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/primitives/dialog'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/shared/ui/primitives/command'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/primitives/avatar'
import { PROJECT_MEMBER_FIELDS, useProjectMembers } from '@/entities/project-member'
import { useFragment } from '@/gql'
import { useAppSelector, useUser  } from '@/shared/hooks'
import { selectCurrentProject } from '@/entities/project'

/**
 * CreateDmDialog
 *
 * A Command-palette style dialog that lets the user search project members
 * and open a 1:1 DM with them. Filters out the current user from the list.
 *
 * Opens via useCreateDmModal().open() (wired to the + button in DMList).
 * Uses useFragment to unmask the fragment-masked ProjectMember data.
 */
export function CreateDmDialog() {
  const { isOpen, close } = useCreateDmModal()
  const { mutate: createDm, isPending } = useCreateDm()
  const project = useAppSelector(selectCurrentProject)
  const { user } = useUser()
  const [search, setSearch] = useState('')

  const { data: membersData, isLoading: membersLoading } = useProjectMembers(
    project?.id ?? '',
  )

  // Unmask fragment-protected data
  const maskedMembers = membersData?.projectMembers ?? []
  const members = useFragment(PROJECT_MEMBER_FIELDS, maskedMembers)

  // Filter out the current user — you can't DM yourself
  const filtered = members
    .filter((m) => m.userId !== user?.id)
    .filter((m) =>
      search.trim()
        ? m.user.fullName?.toLowerCase().includes(search.toLowerCase())
        : true,
    )

  function handleSelect(userId: string) {
    if (isPending) return
    createDm(userId)
  }

  function handleOpenChange(open: boolean) {
    if (!open) {
      close()
      setSearch('')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="p-0 gap-0 max-w-md overflow-hidden">
        <DialogHeader className="px-4 pt-4 pb-2">
          <DialogTitle>New Direct Message</DialogTitle>
          <DialogDescription>
            Search project members to start a conversation.
          </DialogDescription>
        </DialogHeader>

        <Command shouldFilter={false} className="border-t">
          <CommandInput
            placeholder="Search members..."
            value={search}
            onValueChange={setSearch}
            disabled={isPending}
          />
          <CommandList className="max-h-72">
            {membersLoading ? (
              <div className="py-6 flex justify-center">
                <Loader2 className="h-4 w-4 animate-spin text-tertiary" />
              </div>
            ) : (
              <>
                <CommandEmpty>No members found.</CommandEmpty>
                <CommandGroup>
                  {filtered.map((member) => {
                    const initials = member.user.fullName
                      ?.split(' ')
                      .map((n: string) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()

                    return (
                      <CommandItem
                        key={member.userId}
                        value={member.userId}
                        onSelect={() => handleSelect(member.userId)}
                        disabled={isPending}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <Avatar className="h-7 w-7 rounded-md">
                          <AvatarImage
                            src={member.user.avatarUrl ?? undefined}
                            alt={member.user.fullName ?? ''}
                          />
                          <AvatarFallback className="rounded-md text-12">
                            {initials ?? '??'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col min-w-0">
                          <span className="text-13 font-medium truncate">
                            {member.user.fullName ?? 'Unknown'}
                          </span>
                          <span className="text-11 text-secondary truncate">
                            {member.user.email}
                          </span>
                        </div>
                        {isPending && (
                          <Loader2 className="ml-auto h-3.5 w-3.5 animate-spin text-tertiary" />
                        )}
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  )
}
