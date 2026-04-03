import { Card, Progress } from '@/shared/ui'

export function StorageUsage() {
  return (
    <Card className="flex flex-col p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-foreground tracking-tight">Storage Usage</h3>
        <span className="text-xs font-semibold text-primary">72%</span>
      </div>
      
      <Progress value={72} className="h-2 mb-3 bg-surface-2" />
      
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>36.2 GB of 50 GB used</span>
        <a href="#" className="font-medium text-foreground hover:text-primary transition-colors">
          Upgrade
        </a>
      </div>
    </Card>
  )
}
