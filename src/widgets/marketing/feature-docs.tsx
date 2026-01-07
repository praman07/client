import { ArrowRight, Check, FileText } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/shared/ui/primitives/button'
import { Card, CardContent } from '@/shared/ui/primitives/card'

export function MarketingFeatureDocs() {
  return (
    <section className="py-24 bg-background">
      <div className="container px-4 md:px-6 mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
          {/* Left Content */}
          <div className="flex-1 space-y-8">
            <div className="inline-flex items-center rounded-md border bg-muted/50 px-2.5 py-0.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted">
              <FileText className="mr-2 h-3.5 w-3.5" />
              Docs
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Beautiful documents that feel alive
              </h2>
              <p className="text-muted-foreground md:text-xl leading-relaxed">
                Create stunning documentation with our block-based editor.
                Real-time collaboration, nested hierarchies, and rich embeds
                make knowledge sharing effortless.
              </p>
            </div>

            <ul className="space-y-3">
              {[
                'Real-time multiplayer editing with live cursors',
                'Infinite nesting and organization',
                'Rich blocks: tables, code, embeds, and more',
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
                  Learn more about Docs
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              }
            ></Button>
          </div>

          {/* Right Visualization (Document Mockup) */}
          <div className="flex-1 w-full scale-100">
            <div className="relative rounded-2xl bg-muted/20 p-8 md:p-12 border">
              <Card className="shadow-xl bg-background border-border/50 max-w-md mx-auto aspect-4/3 overflow-hidden flex flex-col">
                <CardContent className="p-8 space-y-6">
                  {/* Doc Title */}
                  <div className="flex items-center gap-3 mb-6">
                    <FileText className="h-6 w-6" />
                    <h3 className="text-xl font-bold">Product Roadmap 2025</h3>
                  </div>

                  {/* Unchecked Item */}
                  <div className="flex items-start gap-3 group">
                    <div className="mt-1 h-4 w-4 shrink-0 rounded-sm border border-primary/20 ring-offset-background group-hover:border-primary transition-colors cursor-pointer" />
                    <div className="space-y-1">
                      <p className="font-medium leading-none">Q1 Objectives</p>
                      <p className="text-xs text-muted-foreground">
                        Launch new collaboration features
                      </p>
                    </div>
                  </div>

                  {/* Checked Item */}
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-4 w-4 shrink-0 rounded-sm bg-primary text-primary-foreground flex items-center justify-center">
                      <Check className="h-3 w-3" />
                    </div>
                    <div className="space-y-1 opacity-60">
                      <p className="font-medium leading-none line-through">
                        Beta testing phase
                      </p>
                      <p className="text-xs text-muted-foreground line-through">
                        Completed ahead of schedule
                      </p>
                    </div>
                  </div>

                  {/* Table of Contents Block */}
                  <div className="rounded-lg bg-muted/30 p-4 mt-2">
                    <p className="text-xs font-semibold text-muted-foreground mb-3">
                      Table of contents
                    </p>
                    <div className="space-y-2 text-sm text-muted-foreground/80">
                      <div className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer">
                        <ArrowRight className="h-3 w-3 opacity-50" />
                        Overview
                      </div>
                      <div className="flex items-center gap-1.5 pl-2 hover:text-primary transition-colors cursor-pointer">
                        <ArrowRight className="h-3 w-3 opacity-50" />
                        Goals & Metrics
                      </div>
                      <div className="flex items-center gap-1.5 pl-2 hover:text-primary transition-colors cursor-pointer">
                        <ArrowRight className="h-3 w-3 opacity-50" />
                        Timeline
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
