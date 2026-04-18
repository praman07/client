import { FileText, Image } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage, Badge, Card } from '@/shared/ui'

const ACTIVITIES = [
  {
    id: 1,
    user: 'Sarah Jenkins',
    avatar: 'https://i.pravatar.cc/150?u=sarah',
    action: 'moved',
    target: 'User Onboarding Flow',
    targetLink: '#',
    status: 'COMPLETED',
    time: '14 minutes ago',
  },
  {
    id: 2,
    user: 'Marcus Thorne',
    avatar: 'https://i.pravatar.cc/150?u=marcus',
    action: 'commented on',
    target: 'API Authentication Specs',
    targetLink: '#',
    comment: '"We need to verify the OAuth callback limits before proceeding."',
    time: '1 hour ago',
  },
  {
    id: 3,
    user: 'Elena Rodriguez',
    avatar: 'https://i.pravatar.cc/150?u=elena',
    action: 'uploaded 4 files to',
    target: 'Brand Assets v2',
    targetLink: '#',
    files: true,
    time: '3 hours ago',
  },
]

export function ActivityFeed() {
  return (
<Card className="flex flex-col p-6 shadow-raised-100 border border-subtle bg-layer-1">
    <div className="flex items-center justify-between mb-5">
      <h2 className="text-14 font-semibold text-primary tracking-tight">Activity Feed</h2>
      <a href="#" className="text-11 font-semibold uppercase tracking-widest text-accent-primary hover:text-accent-primary/80 transition-colors">
        View All
      </a>
    </div>

    <div className="flex flex-col">
      {ACTIVITIES.map((item, index) => (
        <div key={item.id} className={`group flex gap-4 flex-row ${index !== ACTIVITIES.length - 1 ? 'pb-5 mb-5 border-b border-subtle' : ''}`}>
          <Avatar className="w-9 h-9 rounded-full shrink-0 border border-subtle ring-2 ring-transparent group-hover:ring-accent-primary/20 transition-all mt-0.5">
            <AvatarImage src={item.avatar} />
            <AvatarFallback>{item.user[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <div className="text-13 leading-relaxed break-words">
              <span className="font-semibold text-primary">{item.user}</span>{' '}
              <span className="text-secondary">{item.action}</span>{' '}
              <a href={item.targetLink} className="font-semibold text-accent-primary hover:underline hover:text-accent-primary/80 transition-colors">
                {item.target}
              </a>
              {item.status && (
                <Badge variant="outline" className="ml-2 relative -top-0.5 text-10 h-[18px] px-1.5 uppercase font-bold tracking-wider bg-success-subtle text-success-primary border-none">
                  {item.status}
                </Badge>
              )}
            </div>

            {item.comment && (
              <p className="text-13 text-primary/80 mt-2 italic border-l-2 border-accent-subtle pl-3 py-1.5 bg-layer-2 rounded-r-md">
                {item.comment}
              </p>
            )}

            {item.files && (
              <div className="flex gap-2 mt-3 flex-wrap">
                <div className="w-12 h-10 rounded-md border border-subtle flex items-center justify-center bg-layer-2-hover hover:bg-layer-2 hover:border-accent-subtle cursor-pointer transition-all group/file">
                  <Image className="w-4 h-4 text-secondary group-hover/file:text-accent-primary transition-colors" />
                </div>
                <div className="w-12 h-10 rounded-md border border-subtle flex items-center justify-center bg-layer-2-hover hover:bg-layer-2 hover:border-accent-subtle cursor-pointer transition-all group/file">
                  <Image className="w-4 h-4 text-secondary group-hover/file:text-accent-primary transition-colors" />
                </div>
                <div className="w-12 h-10 rounded-md border border-subtle flex items-center justify-center bg-layer-2-hover hover:bg-layer-2 hover:border-accent-subtle cursor-pointer transition-all group/file">
                  <FileText className="w-4 h-4 text-secondary group-hover/file:text-accent-primary transition-colors" />
                </div>
              </div>
            )}

            <span className="text-12 text-secondary mt-2 font-medium">{item.time}</span>
          </div>
        </div>
      ))}
    </div>
  </Card>
  )
}
