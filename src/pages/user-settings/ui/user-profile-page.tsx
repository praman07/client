import { useEffect, useState } from 'react'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { useUpdateProfile, useUser } from '@/entities/user'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/primitives/avatar'
import { Button } from '@/shared/ui/primitives/button'
import { Input } from '@/shared/ui/primitives/input'
import { Label } from '@/shared/ui/primitives/label'
import { Textarea } from '@/shared/ui/primitives/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/primitives/select'
import { Separator } from '@/shared/ui/primitives/separator'

const TIMEZONES = [
  'UTC', 'America/New_York', 'America/Chicago', 'America/Denver',
  'America/Los_Angeles', 'Europe/London', 'Europe/Paris', 'Europe/Berlin',
  'Asia/Dubai', 'Asia/Kolkata', 'Asia/Singapore', 'Asia/Tokyo',
  'Australia/Sydney',
]

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'ja', label: 'Japanese' },
  { value: 'zh', label: 'Chinese' },
  { value: 'ar', label: 'Arabic' },
]

export function UserProfilePage() {
  const { user } = useUser()
  const { mutateAsync: updateProfile, isPending } = useUpdateProfile()

  const [fullName, setFullName] = useState('')
  const [bio, setBio] = useState('')
  const [timezone, setTimezone] = useState('UTC')
  const [language, setLanguage] = useState('en')
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Populate from DB once loaded
  useEffect(() => {
    if (!user) return
    const t = setTimeout(() => {
      setFullName(user.fullName ?? '')
      setBio(user.bio ?? '')
      setTimezone(user.timezone ?? 'UTC')
      setLanguage(user.language ?? 'en')
    }, 0)
    return () => clearTimeout(t)
  }, [user])

  const initials = user?.fullName
    ? user.fullName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSaved(false)
    try {
      await updateProfile({ fullName, bio, timezone, language })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setError('Failed to save changes. Please try again.')
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold">Profile</h2>
        <p className="text-sm text-muted-foreground mt-0.5">This information is visible to your teammates.</p>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16 ring-2 ring-border">
          <AvatarImage src={user?.avatarUrl ?? undefined} alt={user?.fullName ?? 'User'} />
          <AvatarFallback className="text-xl font-semibold">{initials}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">{user?.fullName ?? '—'}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{user?.email}</p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            Avatar is synced from your sign-in provider (Google / GitHub) or Gravatar.
          </p>
        </div>
      </div>

      <Separator />

      <form onSubmit={handleSave} className="space-y-5 max-w-lg">
        {error && (
          <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="profile-name">Full name</Label>
          <Input
            id="profile-name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your full name"
            maxLength={80}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="profile-bio">Bio</Label>
          <Textarea
            id="profile-bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell your team a bit about yourself…"
            rows={3}
            maxLength={300}
          />
          <p className="text-xs text-muted-foreground text-right">{bio.length}/300</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="profile-timezone">Timezone</Label>
            <Select value={timezone} onValueChange={(v) => { if (v) setTimezone(v) }}>
              <SelectTrigger id="profile-timezone">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                {TIMEZONES.map((tz) => (
                  <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="profile-language">Language</Label>
            <Select value={language} onValueChange={(v) => { if (v) setLanguage(v) }}>
              <SelectTrigger id="profile-language">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-1">
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving…</>
            ) : 'Save changes'}
          </Button>
          {saved && (
            <span className="flex items-center gap-1 text-sm text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
              Saved
            </span>
          )}
        </div>
      </form>
    </div>
  )
}
