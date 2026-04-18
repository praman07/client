import { Upload } from 'lucide-react'
import { Button, Label } from '@/shared/ui'

export function WorkspaceLogoField() {
  return (
    <div className="space-y-3">
      <Label className="text-14 font-medium">Workspace Logo</Label>
      <div className="flex items-center gap-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-lg border-2 border-dashed border-subtle bg-layer-1 text-secondary">
          <Upload className="h-6 w-6" />
        </div>
        <Button type="button" variant="outline" className="h-10 px-4">
          Upload Logo
        </Button>
      </div>
    </div>
  )
}
