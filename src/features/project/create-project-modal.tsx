import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog"

export function CreateProjectModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  
  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-muted-foreground">This is where the project creation form will live.</p>
          <div className="mt-4 flex justify-end">
             <button 
                className="bg-primary text-primary-foreground px-4 py-2 rounded"
                onClick={onClose}
             >
                Close
             </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
