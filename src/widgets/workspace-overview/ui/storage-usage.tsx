import { Card, Progress } from '@/shared/ui'

export function StorageUsage() {
  return (
<Card className="flex flex-col p-5 shadow-raised-100 border border-subtle bg-layer-1">
  <div className="flex items-center justify-between mb-3">
    <h3 className="text-14 font-semibold text-primary tracking-tight">Storage Usage</h3>
    <span className="text-12 font-semibold text-accent-primary">72%</span>
  </div>

  <Progress value={72} className="h-2 mb-3 bg-layer-2" />

  <div className="flex items-center justify-between text-12 text-secondary">
    <span>36.2 GB of 50 GB used</span>
    <a href="#" className="font-medium text-primary hover:text-accent-primary transition-colors">
      Upgrade
    </a>
  </div>
</Card>
  )
}
