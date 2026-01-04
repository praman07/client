import { ArrowRight, MessageSquare, FileText } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import { Input } from '@/shared/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'

export function MarketingHero() {
  return (
    <section className="relative overflow-hidden pt-12 md:pt-24 pb-24">
      <div className="container px-4 md:px-6 mx-auto max-w-7xl flex flex-col items-center text-center space-y-8">
        
        {/* Badge */}
        <div className="inline-flex items-center rounded-full border bg-background px-3 py-1 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer">
          <Badge variant="secondary" className="mr-2 rounded-full px-2 font-normal">
            New
          </Badge>
          <span className="text-muted-foreground">Introducing Oracle AI Assistant</span>
          <ArrowRight className="ml-2 h-4 w-4 text-muted-foreground" />
        </div>

        {/* Headlines */}
        <div className="space-y-4 max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            The collaboration platform for modern teams
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            Replace Notion, Jira, and Slack with one powerful workspace. Built for high-performing teams who demand more.
          </p>
        </div>

        {/* CTA Form */}
        <div className="flex flex-col items-center gap-2 w-full max-w-md">
           <div className="flex w-full items-center gap-2">
            <Input type="email" placeholder="Enter your work email" className="h-12" />
            <Button size="lg" className="h-12 px-8">
              Get Started
            </Button>
           </div>
           <p className="text-xs text-muted-foreground">
             Free forever • No credit card required
           </p>
        </div>

        {/* Dashboard Mockup (CSS/Shadcn Only) */}
        <div className="w-full max-w-6xl mt-16 rounded-xl border bg-background shadow-2xl overflow-hidden">
            {/* Browser Header */}
            <div className="border-b bg-muted/40 p-4 flex items-center gap-4">
                <div className="flex gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-400/80" />
                    <div className="h-3 w-3 rounded-full bg-yellow-400/80" />
                    <div className="h-3 w-3 rounded-full bg-green-400/80" />
                </div>
                <div className="flex-1 text-center">
                    <div className="inline-block px-3 py-1 bg-background rounded text-xs text-muted-foreground border">
                        app.collabify.com
                    </div>
                </div>
                <div className="w-16" /> {/* Spacer for balance */}
            </div>

            {/* App Content */}
            <div className="p-4 bg-slate-50/50 min-h-[500px] flex flex-col gap-4 text-left">
                <div className="flex flex-col md:flex-row gap-4 h-full">
                    
                    {/* Sidebar / Doc Card */}
                    <Card className="w-full md:w-64 shrink-0 shadow-sm">
                        <CardHeader className="flex flex-row items-center gap-3 pb-2">
                            <div className="p-2 bg-primary text-primary-foreground rounded-md">
                                <FileText className="h-5 w-5" />
                            </div>
                            <div className="flex flex-col">
                                <CardTitle className="text-base">Product Docs</CardTitle>
                                <span className="text-xs text-muted-foreground">24 pages</span>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                             <div className="h-2 w-full bg-muted rounded-full" />
                             <div className="h-2 w-3/4 bg-muted rounded-full" />
                             <div className="h-2 w-5/6 bg-muted rounded-full" />
                        </CardContent>
                    </Card>

                    {/* Main Board Area */}
                    <Card className="flex-1 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-lg">Sprint Board</CardTitle>
                            <div className="flex items-center border rounded-md overflow-hidden">
                                <div className="px-3 py-1 bg-muted text-xs font-medium">Board</div>
                                <div className="px-3 py-1 bg-background text-xs text-muted-foreground">List</div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {/* Column 1: To Do */}
                                <div className="space-y-2 bg-muted/30 p-2 rounded-lg">
                                    <h4 className="text-xs font-medium text-muted-foreground mb-1.5">To Do</h4>
                                    <div className="bg-background border rounded p-2.5 shadow-sm space-y-1.5">
                                        <div className="font-medium text-sm">Design review</div>
                                        <Badge variant="secondary" className="text-[10px] h-4 px-1.5 font-normal">High</Badge>
                                    </div>
                                    <div className="bg-background border rounded p-2.5 shadow-sm">
                                        <div className="font-medium text-sm">API integration</div>
                                    </div>
                                </div>

                                {/* Column 2: In Progress */}
                                <div className="space-y-2 bg-muted/30 p-2 rounded-lg">
                                    <h4 className="text-xs font-medium text-muted-foreground mb-1.5">In Progress</h4>
                                    <div className="bg-background border rounded p-2.5 shadow-sm">
                                        <div className="font-medium text-sm">User testing</div>
                                    </div>
                                </div>

                                {/* Column 3: Done */}
                                <div className="space-y-2 bg-muted/30 p-2 rounded-lg">
                                    <h4 className="text-xs font-medium text-muted-foreground mb-1.5">Done</h4>
                                    <div className="bg-background border rounded p-2.5 shadow-sm">
                                        <div className="font-medium text-sm">Landing page</div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Bottom Activity Feed */}
                <Card className="shadow-sm">
                    <CardContent className="p-3 flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src="" />
                            <AvatarFallback>SC</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm">Sarah Chen</span>
                                <span className="text-xs text-muted-foreground">2 minutes ago</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Just pushed the latest design updates to the staging environment. Ready for review! 🚀
                            </p>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground pt-0.5">
                                <span className="flex items-center gap-1 hover:text-primary cursor-pointer">
                                    <div className="h-2.5 w-2.5 border rounded-sm" /> 12
                                </span>
                                <span className="flex items-center gap-1 hover:text-primary cursor-pointer">
                                    <MessageSquare className="h-2.5 w-2.5" /> 3
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
      
      {/* Background gradients */}
      <div className="absolute top-0 -z-10 h-full w-full bg-background">
          <div className="absolute top-[20%] left-[20%] h-[400px] w-[400px] bg-primary/5 blur-[100px] rounded-full" />
          <div className="absolute top-[20%] right-[20%] h-[400px] w-[400px] bg-blue-500/5 blur-[100px] rounded-full" />
      </div>
    </section>
  )
}
