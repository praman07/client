import {
  ArrowRight,
  Calendar,
  Check,
  MessageSquare,
  MoreHorizontal,
  Send,
  UserPlus,
} from 'lucide-react'
import { Link } from '@tanstack/react-router'
import {
  Avatar,
  AvatarFallback,
  Button,
  Card,
  CardContent,
  Input,
} from '@/shared/ui'

export function MarketingFeatureChat() {
  return (
    <section className="py-24 bg-background">
      <div className="container px-4 md:px-6 mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-24">
          {/* Right Content (Text) */}
          <div className="flex-1 space-y-8">
            <div className="inline-flex items-center rounded-md border bg-muted/50 px-2.5 py-0.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted">
              <MessageSquare className="mr-2 h-3.5 w-3.5" />
              Chat
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Team communication, reimagined
              </h2>
              <p className="text-muted-foreground md:text-xl leading-relaxed">
                Channels, threads, and DMs that actually integrate with your
                work. No more context switching between Slack and your project
                tools.
              </p>
            </div>

            <ul className="space-y-3">
              {[
                'Organized channels with threaded conversations',
                'Rich file previews and inline reactions',
                'Direct links to tasks and documents',
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-sm font-medium"
                >
                  <Check className="h-5 w-5 text-primary" />
                  {item}
                </li>
              ))}
            </ul>

            <Button
              variant="link"
              className="p-0 h-auto font-semibold text-base group"
              render={
                <Link to="/about">
                  Learn more about Chat
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              }
            ></Button>
          </div>

          {/* Left Visualization (Chat Mockup) */}
          <div className="flex-1 w-full scale-100">
            <div className="relative rounded-2xl bg-muted/20 p-8 md:p-12 border">
              <Card className="shadow-xl bg-background border-border/50 max-w-md mx-auto overflow-hidden flex flex-col">
                {/* Chat Header */}
                <div className="border-b px-6 py-4 flex items-center justify-between bg-card">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground font-bold text-lg">
                      #
                    </span>
                    <h3 className="font-bold text-sm">design-team</h3>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <UserPlus className="h-4 w-4 hover:text-primary cursor-pointer" />
                    <MoreHorizontal className="h-4 w-4 hover:text-primary cursor-pointer" />
                  </div>
                </div>

                {/* Chat Messages */}
                <CardContent className="p-6 space-y-6 bg-slate-50/50">
                  {/* Message 1 */}
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        AR
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <div className="flex items-baseline gap-2">
                        <span className="font-semibold text-sm">
                          Alex Rivera
                        </span>
                        <span className="text-xs text-muted-foreground">
                          9:42 AM
                        </span>
                      </div>
                      <p className="text-sm text-foreground/80 leading-relaxed">
                        Hey team, I've updated the design system with the new
                        color palette. Check it out!
                      </p>
                      <div className="flex items-center gap-2 pt-1">
                        <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-background border text-xs text-muted-foreground">
                          ❤️ 4
                        </div>
                        <span className="text-xs text-muted-foreground hover:underline cursor-pointer">
                          Reply
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Message 2 */}
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarFallback className="bg-purple-100 text-purple-600">
                        JK
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <div className="flex items-baseline gap-2">
                        <span className="font-semibold text-sm">
                          Jordan Kim
                        </span>
                        <span className="text-xs text-muted-foreground">
                          9:45 AM
                        </span>
                      </div>
                      <p className="text-sm text-foreground/80 leading-relaxed">
                        Love it! The new blues are much more accessible 🦋
                      </p>
                    </div>
                  </div>

                  {/* Message 3 (Rich Embed) */}
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarFallback className="bg-green-100 text-green-600">
                        SC
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1 w-full">
                      <div className="flex items-baseline gap-2">
                        <span className="font-semibold text-sm">Sam Chen</span>
                        <span className="text-xs text-muted-foreground">
                          9:47 AM
                        </span>
                      </div>
                      <p className="text-sm text-foreground/80 leading-relaxed mb-2">
                        Can we schedule a quick sync to discuss the mobile
                        breakpoints?
                      </p>

                      {/* Embed Card */}
                      <div className="rounded-lg border bg-background p-3 w-full max-w-xs cursor-pointer hover:border-primary/50 transition-colors">
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span className="font-semibold text-sm">
                            Design Review
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          Tomorrow at 2:00 PM
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>

                {/* Chat Input */}
                <div className="p-4 bg-card border-t mt-auto">
                  <div className="relative">
                    <Input className="pr-10" placeholder="Type a message..." />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute right-1 top-1 h-7 w-7"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
