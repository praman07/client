import { Upload } from 'lucide-react'
import { Button, Label } from '@/shared/ui'

export function WorkspaceLogoField() {
  return (
    <div className="space-y-3">
      <Label className="text-base font-medium">Workspace Logo</Label>
      <div className="flex items-center gap-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 text-muted-foreground">
          <Upload className="h-6 w-6" />
        </div>
        <Button type="button" variant="outline" className="h-10 px-4">
          Upload Logo
        </Button>
      </div>
    </div>
  )
}
